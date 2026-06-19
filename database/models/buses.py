from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
    ForeignKey,
    func,
)

from .base import Base


class Bus(Base):
    __tablename__ = "buses"

    id = Column(Integer, primary_key=True, index=True)
    plate_number = Column(String(20), unique=True, nullable=False, index=True)
    internal_code = Column(String(30), unique=True, nullable=False, index=True)
    capacity = Column(Integer, default=40, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    route_id = Column(Integer, ForeignKey("routes.id"), nullable=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
