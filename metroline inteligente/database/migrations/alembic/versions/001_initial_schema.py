"""initial schema

Revision ID: 001
Revises: None
Create Date: 2025-01-01
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("username", sa.String(50), unique=True, nullable=False),
        sa.Column("email", sa.String(255), unique=True, nullable=False),
        sa.Column("hashed_password", sa.String(255), nullable=False),
        sa.Column("full_name", sa.String(255), nullable=False),
        sa.Column("is_active", sa.Boolean(), default=True, nullable=False),
        sa.Column("is_admin", sa.Boolean(), default=False, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    op.create_table(
        "routes",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(100), nullable=False),
        sa.Column("code", sa.String(20), unique=True, nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("color", sa.String(7), default="#3B82F6"),
        sa.Column("is_active", sa.Boolean(), default=True, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    op.create_table(
        "stops",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(200), nullable=False),
        sa.Column("code", sa.String(20), unique=True, nullable=False),
        sa.Column("latitude", sa.Float(), nullable=False),
        sa.Column("longitude", sa.Float(), nullable=False),
        sa.Column("address", sa.String(300), nullable=True),
        sa.Column("is_active", sa.Boolean(), default=True, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    op.create_table(
        "route_stops",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("route_id", sa.Integer(), sa.ForeignKey("routes.id", ondelete="CASCADE"), nullable=False),
        sa.Column("stop_id", sa.Integer(), sa.ForeignKey("stops.id", ondelete="CASCADE"), nullable=False),
        sa.Column("sequence", sa.Integer(), nullable=False),
        sa.Column("distance_from_start_km", sa.Float(), default=0.0, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("route_id", "stop_id", name="uq_route_stop"),
    )

    op.create_table(
        "buses",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("plate_number", sa.String(20), unique=True, nullable=False),
        sa.Column("internal_code", sa.String(30), unique=True, nullable=False),
        sa.Column("capacity", sa.Integer(), default=40, nullable=False),
        sa.Column("is_active", sa.Boolean(), default=True, nullable=False),
        sa.Column("route_id", sa.Integer(), sa.ForeignKey("routes.id"), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    op.create_table(
        "bus_locations",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("bus_id", sa.Integer(), sa.ForeignKey("buses.id", ondelete="CASCADE"), nullable=False),
        sa.Column("latitude", sa.Float(), nullable=False),
        sa.Column("longitude", sa.Float(), nullable=False),
        sa.Column("speed_kmh", sa.Float(), default=0.0, nullable=False),
        sa.Column("heading", sa.Float(), default=0.0, nullable=False),
        sa.Column("recorded_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    op.create_table(
        "eta_predictions",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("bus_id", sa.Integer(), sa.ForeignKey("buses.id", ondelete="CASCADE"), nullable=False),
        sa.Column("stop_id", sa.Integer(), sa.ForeignKey("stops.id", ondelete="CASCADE"), nullable=False),
        sa.Column("eta_seconds", sa.Integer(), nullable=False),
        sa.Column("distance_km", sa.Float(), nullable=False),
        sa.Column("congestion_factor", sa.Float(), default=1.0, nullable=False),
        sa.Column("time_factor", sa.Float(), default=1.0, nullable=False),
        sa.Column("calculated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    op.create_table(
        "alerts",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("bus_id", sa.Integer(), sa.ForeignKey("buses.id", ondelete="CASCADE"), nullable=True),
        sa.Column("route_id", sa.Integer(), sa.ForeignKey("routes.id", ondelete="CASCADE"), nullable=True),
        sa.Column("alert_type", sa.String(30), nullable=False),
        sa.Column("title", sa.String(200), nullable=False),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("severity", sa.String(20), default="LOW", nullable=False),
        sa.Column("is_active", sa.Boolean(), default=True, nullable=False),
        sa.Column("latitude", sa.Float(), nullable=True),
        sa.Column("longitude", sa.Float(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("resolved_at", sa.DateTime(timezone=True), nullable=True),
        sa.CheckConstraint("alert_type IN ('DELAY','CONGESTION','BUS_STOPPED','MAINTENANCE','ROUTE_CHANGE')", name="chk_alert_type"),
        sa.CheckConstraint("severity IN ('LOW','MEDIUM','HIGH','CRITICAL')", name="chk_severity"),
    )

    # Indexes
    op.create_index("idx_users_username", "users", ["username"])
    op.create_index("idx_users_email", "users", ["email"])
    op.create_index("idx_routes_name", "routes", ["name"])
    op.create_index("idx_routes_code", "routes", ["code"])
    op.create_index("idx_stops_name", "stops", ["name"])
    op.create_index("idx_stops_code", "stops", ["code"])
    op.create_index("idx_route_stops_route_id", "route_stops", ["route_id"])
    op.create_index("idx_route_stops_stop_id", "route_stops", ["stop_id"])
    op.create_index("idx_buses_plate_number", "buses", ["plate_number"])
    op.create_index("idx_buses_internal_code", "buses", ["internal_code"])
    op.create_index("idx_buses_route_id", "buses", ["route_id"])
    op.create_index("idx_bus_locations_bus_id", "bus_locations", ["bus_id"])
    op.create_index("idx_bus_locations_recorded_at", "bus_locations", ["recorded_at"])
    op.create_index("idx_bus_locations_bus_time", "bus_locations", ["bus_id", "recorded_at"])
    op.create_index("idx_eta_predictions_bus_id", "eta_predictions", ["bus_id"])
    op.create_index("idx_eta_predictions_stop_id", "eta_predictions", ["stop_id"])
    op.create_index("idx_alerts_bus_id", "alerts", ["bus_id"])
    op.create_index("idx_alerts_route_id", "alerts", ["route_id"])
    op.create_index("idx_alerts_alert_type", "alerts", ["alert_type"])
    op.create_index("idx_alerts_is_active", "alerts", ["is_active"])


def downgrade() -> None:
    op.drop_table("alerts")
    op.drop_table("eta_predictions")
    op.drop_table("bus_locations")
    op.drop_table("buses")
    op.drop_table("route_stops")
    op.drop_table("stops")
    op.drop_table("routes")
    op.drop_table("users")
