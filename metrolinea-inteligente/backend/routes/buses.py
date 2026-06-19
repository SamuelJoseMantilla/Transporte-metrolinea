from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

# Importaciones absolutas limpias
from database.connection import get_db
from database.models import BusModel
from services.gps_services import simular_movimiento_bus  # Ojo con la 's' al final si la dejaste
from ia.predictor import predecir_tiempo_paradero

router = APIRouter(prefix="/buses", tags=["Buses"])
# ... (Tus otros endpoints de GET /buses y POST /simular quedan igual)

@router.get("/{bus_id}/eta")
def obtener_eta_inteligente(bus_id: int, paradero_destino: str, db: Session = Depends(get_db)):
    """
    Retorna el Tiempo Estimado de Llegada (ETA) calculado por la Inteligencia Artificial.
    """
    # 1. Buscar el bus en la base de datos de Postgres para saber qué ruta está haciendo
    bus = db.query(BusModel).filter(BusModel.id == bus_id).first()
    if not bus:
        raise HTTPException(status_code=404, detail="Bus no encontrado en el sistema operativo")
    
    # 2. Lanzar la predicción usando los datos en tiempo real del bus
    # Simulamos clima 'Despejado', pero en producción se podría conectar a una API de clima
    minutos_estimados = predecir_tiempo_paradero(
        ruta=bus.ruta_nombre, 
        paradero=paradero_destino, 
        clima="Despejado"
    )
    
    return {
        "bus_id": bus.id,
        "placa": bus.placa,
        "ruta": bus.ruta_nombre,
        "paradero_objetivo": paradero_destino,
        "eta_predicho_minutos": minutos_estimados,
        "mensaje": f"El bus pasará por {paradero_destino} en aproximadamente {minutos_estimados} minutos."
    }