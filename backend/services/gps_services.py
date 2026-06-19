# backend/services/gps_service.py
from sqlalchemy.orm import Session
from database.models import BusModel

def simular_movimiento_bus(db: Session, bus_id: int):
    bus = db.query(BusModel).filter(BusModel.id == bus_id).first()
    if not bus:
        return None
    
    # Simulación: Le sumamos un pequeño delta para moverlo por el mapa de Bucaramanga
    bus.latitud += 0.0001
    bus.longitud += 0.00015
    bus.velocidad = 28.4  # km/h promedio en el tráfico de la 27
    
    db.commit()
    db.refresh(bus)
    return bus