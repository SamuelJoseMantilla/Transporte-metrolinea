from sqlalchemy import (
    Column,
    Integer,
    Float,
    DateTime,
    ForeignKey,
    func,
)

from .base import Base


class BusLocation(Base):
    __tablename__ = "bus_locations"

    id = Column(Integer, primary_key=True, index=True)
    bus_id = Column(Integer, ForeignKey("buses.id", ondelete="CASCADE"), nullable=False, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    speed_kmh = Column(Float, default=0.0, nullable=False)
    heading = Column(Float, default=0.0, nullable=False)
    recorded_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
