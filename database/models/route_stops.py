from sqlalchemy import (
    Column,
    Integer,
    Float,
    DateTime,
    ForeignKey,
    UniqueConstraint,
    func,
)

from .base import Base


class RouteStop(Base):
    __tablename__ = "route_stops"
    __table_args__ = (
        UniqueConstraint("route_id", "stop_id", name="uq_route_stop"),
    )

    id = Column(Integer, primary_key=True, index=True)
    route_id = Column(Integer, ForeignKey("routes.id", ondelete="CASCADE"), nullable=False, index=True)
    stop_id = Column(Integer, ForeignKey("stops.id", ondelete="CASCADE"), nullable=False, index=True)
    sequence = Column(Integer, nullable=False)
    distance_from_start_km = Column(Float, default=0.0, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
