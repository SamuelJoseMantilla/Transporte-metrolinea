"""Seed data for MetroLinea database (async SQLAlchemy)."""
import asyncio
from sqlalchemy import text
from .session import AsyncSessionLocal
from . import *  # noqa: F403


USERS = [
    {"username": "admin", "email": "admin@metrolinea.com", "hashed_password": "$2b$12$LJ3m4ys3Lk0TSwHjmz0VOeUtEdHdJOE3BjBQp3/7Vp1PfK4YHq3We", "full_name": "Administrador MetroLinea", "is_active": True, "is_admin": True},
]

ROUTES = [
    {"id": 1, "name": "Ruta Norte-Sur", "code": "RN-S", "description": "Corredor principal norte-sur de Bucaramanga", "color": "#EF4444"},
    {"id": 2, "name": "Ruta Centro-Oriental", "code": "RC-O", "description": "Conecta el centro con el oriente de la ciudad", "color": "#3B82F6"},
    {"id": 3, "name": "Ruta Universitaria", "code": "RU", "description": "Servicio universitario UdeA - Sotavento", "color": "#10B981"},
    {"id": 4, "name": "Ruta Metropolitana", "code": "RM", "description": "Ruta metropolitana interurbana", "color": "#F59E0B"},
]

STOPS = [
    {"id": 1, "name": "Terminal del Norte", "code": "TN01", "latitude": 7.1450, "longitude": -73.1215, "address": "Av. 33 #18-50"},
    {"id": 2, "name": "Centro Comercial Santander", "code": "TN02", "latitude": 7.1380, "longitude": -73.1190, "address": "Cra 27 #35-20"},
    {"id": 3, "name": "Parque Santander", "code": "TN03", "latitude": 7.1310, "longitude": -73.1230, "address": "Plaza de Bolivar"},
    {"id": 4, "name": "Pilar Antioqueño", "code": "TN04", "latitude": 7.1250, "longitude": -73.1185, "address": "Av. Santander #32-15"},
    {"id": 5, "name": "Centro Histórico", "code": "TN05", "latitude": 7.1200, "longitude": -73.1210, "address": "Cra 9 #32-16"},
    {"id": 6, "name": "Catedral Basílica", "code": "TN06", "latitude": 7.1170, "longitude": -73.1250, "address": "Cra 9 #32-10"},
    {"id": 7, "name": "Hospital Universitario", "code": "TN07", "latitude": 7.1120, "longitude": -73.1310, "address": "Calle 32 #12-50"},
    {"id": 8, "name": "Universidad Industrial", "code": "TN08", "latitude": 7.1060, "longitude": -73.1340, "address": "Cra 27 #36-80"},
    {"id": 9, "name": "Barrio Sotomayor", "code": "TN09", "latitude": 7.1000, "longitude": -73.1290, "address": "Av. Sotomayor"},
    {"id": 10, "name": "La Flora", "code": "TN10", "latitude": 7.0940, "longitude": -73.1240, "address": "Cra 30 #23-10"},
    {"id": 11, "name": "Kenedy", "code": "TN11", "latitude": 7.0900, "longitude": -73.1190, "address": "Av. Kenedy #5-20"},
    {"id": 12, "name": "Terminal del Sur", "code": "TN12", "latitude": 7.0850, "longitude": -73.1150, "address": "Cra 25 #1-50"},
    {"id": 13, "name": "Ciudadela Oriental", "code": "CO01", "latitude": 7.1320, "longitude": -73.1080, "address": "Av. Oriental #40-50"},
    {"id": 14, "name": "La Concordia", "code": "CO02", "latitude": 7.1280, "longitude": -73.1130, "address": "Cra 15 #40-20"},
    {"id": 15, "name": "San Alonso", "code": "RU01", "latitude": 7.1400, "longitude": -73.1280, "address": "Cra 27 #42-10"},
    {"id": 16, "name": "Universidad Autónoma", "code": "RU02", "latitude": 7.1350, "longitude": -73.1320, "address": "Cra 52 #60-30"},
    {"id": 17, "name": "Sotavento", "code": "RU03", "latitude": 7.1300, "longitude": -73.1370, "address": "Av. Sotavento"},
    {"id": 18, "name": "Chipatá", "code": "RM01", "latitude": 7.0900, "longitude": -73.1050, "address": "Km 2 Vía Girón"},
    {"id": 19, "name": "Floridablanca", "code": "RM02", "latitude": 7.0700, "longitude": -73.0800, "address": "Autopista Floridablanca"},
]

ROUTE_STOPS = [
    (1, 1, 1, 0.0), (1, 2, 2, 1.2), (1, 3, 3, 2.5), (1, 4, 4, 3.8),
    (1, 5, 5, 4.5), (1, 6, 6, 5.1), (1, 7, 7, 6.0), (1, 8, 8, 7.2),
    (1, 9, 9, 8.5), (1, 10, 10, 9.8), (1, 11, 11, 10.5), (1, 12, 12, 11.5),
    (2, 5, 1, 0.0), (2, 13, 2, 1.5), (2, 14, 3, 2.3), (2, 4, 4, 3.8), (2, 2, 5, 4.5),
    (3, 15, 1, 0.0), (3, 16, 2, 1.0), (3, 17, 3, 2.0), (3, 8, 4, 3.5), (3, 9, 5, 5.0),
    (4, 12, 1, 0.0), (4, 11, 2, 0.8), (4, 10, 3, 2.0), (4, 18, 4, 4.0), (4, 19, 5, 7.0),
]

BUSES = [
    {"id": 1, "plate_number": "ABC-123", "internal_code": "BUS-001", "capacity": 45, "route_id": 1},
    {"id": 2, "plate_number": "DEF-456", "internal_code": "BUS-002", "capacity": 40, "route_id": 1},
    {"id": 3, "plate_number": "GHI-789", "internal_code": "BUS-003", "capacity": 40, "route_id": 1},
    {"id": 4, "plate_number": "JKL-012", "internal_code": "BUS-004", "capacity": 35, "route_id": 2},
    {"id": 5, "plate_number": "MNO-345", "internal_code": "BUS-005", "capacity": 35, "route_id": 2},
    {"id": 6, "plate_number": "PQR-678", "internal_code": "BUS-006", "capacity": 40, "route_id": 3},
    {"id": 7, "plate_number": "STU-901", "internal_code": "BUS-007", "capacity": 40, "route_id": 3},
    {"id": 8, "plate_number": "VWX-234", "internal_code": "BUS-008", "capacity": 50, "route_id": 4},
    {"id": 9, "plate_number": "YZA-567", "internal_code": "BUS-009", "capacity": 50, "route_id": 4},
    {"id": 10, "plate_number": "BCD-890", "internal_code": "BUS-010", "capacity": 45, "route_id": 1},
]

ALERTS = [
    {"bus_id": 1, "route_id": 1, "alert_type": "DELAY", "title": "Retraso Terminal Norte", "message": "Bus ABC-123 retrasado 10 min por tráfico", "severity": "MEDIUM", "latitude": 7.1450, "longitude": -73.1215},
    {"bus_id": 4, "route_id": 2, "alert_type": "CONGESTION", "title": "Congestión Centro", "message": "Tráfico pesado en Centro Histórico", "severity": "HIGH", "latitude": 7.1200, "longitude": -73.1210},
    {"bus_id": 8, "route_id": 4, "alert_type": "MAINTENANCE", "title": "Mantenimiento preventivo", "message": "Bus VWX-234 en mantenimiento programado", "severity": "LOW", "is_active": False, "latitude": 7.0850, "longitude": -73.1150},
    {"bus_id": None, "route_id": 1, "alert_type": "ROUTE_CHANGE", "title": "Cambio de ruta temporal", "message": "Ruta Norte-Sur desviada por obras", "severity": "CRITICAL", "latitude": 7.1170, "longitude": -73.1250},
]


async def seed():
    async with AsyncSessionLocal() as session:
        for u in USERS:
            await session.execute(text(
                "INSERT INTO users (username, email, hashed_password, full_name, is_active, is_admin) "
                "VALUES (:username, :email, :hashed_password, :full_name, :is_active, :is_admin)"
            ), u)

        for r in ROUTES:
            await session.execute(text(
                "INSERT INTO routes (id, name, code, description, color) VALUES (:id, :name, :code, :description, :color)"
            ), r)

        for s in STOPS:
            await session.execute(text(
                "INSERT INTO stops (id, name, code, latitude, longitude, address) VALUES (:id, :name, :code, :latitude, :longitude, :address)"
            ), s)

        for route_id, stop_id, seq, dist in ROUTE_STOPS:
            await session.execute(text(
                "INSERT INTO route_stops (route_id, stop_id, sequence, distance_from_start_km) VALUES (:route_id, :stop_id, :sequence, :distance_from_start_km)"
            ), {"route_id": route_id, "stop_id": stop_id, "sequence": seq, "distance_from_start_km": dist})

        for b in BUSES:
            await session.execute(text(
                "INSERT INTO buses (id, plate_number, internal_code, capacity, is_active, route_id) VALUES (:id, :plate_number, :internal_code, :capacity, TRUE, :route_id)"
            ), b)

        for a in ALERTS:
            a["is_active"] = a.get("is_active", True)
            await session.execute(text(
                "INSERT INTO alerts (bus_id, route_id, alert_type, title, message, severity, is_active, latitude, longitude) "
                "VALUES (:bus_id, :route_id, :alert_type, :title, :message, :severity, :is_active, :latitude, :longitude)"
            ), a)

        await session.commit()
        print("Seed data inserted successfully.")


if __name__ == "__main__":
    asyncio.run(seed())
