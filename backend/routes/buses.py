# backend/routes/buses.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from datetime import datetime

# Importaciones de tus módulos locales
from database.connection import get_db
from database.models import BusModel, BusLocationModel
from ia.predictor import predecir_tiempo_paradero

router = APIRouter(prefix="/buses", tags=["Buses"])

# Esquema de respuesta acoplado a la BD en inglés de tu amigo
class BusResponse(BaseModel):
    id: int
    plate_number: str
    internal_code: str
    capacity: int
    is_active: bool
    route_id: int | None

    class Config:
        from_attributes = True

@router.get("/", response_model=List[BusResponse])
def obtener_todos_los_buses(db: Session = Depends(get_db)):
    """
    Retorna la lista de todos los buses asignados en el sistema de Bucaramanga.
    """
    return db.query(BusModel).all()

@router.get("/{bus_id}/eta")
def obtener_eta_inteligente(bus_id: int, distancia_al_paradero_km: float, db: Session = Depends(get_db)):
    """
    Calcula el tiempo estimado de llegada (ETA) usando el modelo de Machine Learning 
    basado en la posición actual del bus y la distancia al paradero objetivo.
    """
    # 1. Buscar el bus en la base de datos
    bus = db.query(BusModel).filter(BusModel.id == bus_id).first()
    if not bus:
        raise HTTPException(status_code=404, detail="El bus solicitado no existe en el sistema.")

    # 2. Buscar la última ubicación conocida y velocidad del bus en tiempo real
    ultima_ubicacion = db.query(BusLocationModel)\
        .filter(BusLocationModel.bus_id == bus_id)\
        .order_by(BusLocationModel.recorded_at.desc())\
        .first()

    # Si el bus no tiene telemetría registrada en la tabla bus_locations, usamos valores por defecto
    velocidad_actual = ultima_ubicacion.speed_kmh if ultima_ubicacion else 25.0

    # 3. Extraer las variables temporales actuales para la IA
    ahora = datetime.now()
    hora_actual = ahora.hour
    dia_semana = ahora.isoweekday() # Devuelve de 1 (Lunes) a 7 (Domingo)

    # 4. Enviar los datos limpios al predictor de Scikit-Learn
    minutos_estimados = predecir_tiempo_paradero(
        hora=hora_actual,
        dia=dia_semana,
        velocidad=velocidad_actual,
        distancia=distancia_al_paradero_km
    )

    return {
        "bus_id": bus.id,
        "placa": bus.plate_number,
        "codigo_interno": bus.internal_code,
        "ruta_id": bus.route_id,
        "velocidad_monitoreada_kmh": velocidad_actual,
        "distancia_solicitada_km": distancia_al_paradero_km,
        "eta_predicho_minutos": minutos_estimados,
        "contexto_ia": {
            "hora_capturada": hora_actual,
            "dia_semana_capturado": dia_semana
        }
    }