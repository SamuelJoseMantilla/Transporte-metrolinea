# backend/database/models.py
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from datetime import datetime
from database.connection import Base

class RouteModel(Base):
    __tablename__ = "routes"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    code = Column(String(20), unique=True, nullable=False)
    description = Column(String, nullable=True)
    color = Column(String(7), default="#3B82F6")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

class BusModel(Base):
    __tablename__ = "buses"

    id = Column(Integer, primary_key=True, index=True)
    plate_number = Column(String(20), unique=True, index=True, nullable=False)
    internal_code = Column(String(30), unique=True, nullable=False)
    capacity = Column(Integer, default=40)
    is_active = Column(Boolean, default=True)
    route_id = Column(Integer, ForeignKey("routes.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

class BusLocationModel(Base):
    __tablename__ = "bus_locations"

    id = Column(Integer, primary_key=True, index=True)
    bus_id = Column(Integer, ForeignKey("buses.id", ondelete="CASCADE"), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    speed_kmh = Column(Float, default=0.0)
    heading = Column(Float, default=0.0)
    recorded_at = Column(DateTime, default=datetime.utcnow)