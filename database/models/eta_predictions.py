from sqlalchemy import (
    Column,
    Integer,
    Float,
    DateTime,
    ForeignKey,
    func,
)

from .base import Base


class ETAPrediction(Base):
    __tablename__ = "eta_predictions"

    id = Column(Integer, primary_key=True, index=True)
    bus_id = Column(Integer, ForeignKey("buses.id", ondelete="CASCADE"), nullable=False, index=True)
    stop_id = Column(Integer, ForeignKey("stops.id", ondelete="CASCADE"), nullable=False, index=True)
    eta_seconds = Column(Integer, nullable=False)
    distance_km = Column(Float, nullable=False)
    congestion_factor = Column(Float, default=1.0, nullable=False)
    time_factor = Column(Float, default=1.0, nullable=False)
    calculated_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
