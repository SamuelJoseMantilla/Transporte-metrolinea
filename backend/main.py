# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.connection import engine, Base
from database.models import BusModel # Importante para que cree la tabla
from routes import buses
from database.connection import SessionLocal

# 1. Crear las tablas automáticamente en SQLite al arrancar
Base.metadata.create_all(bind=engine)

# 2. Insertar datos de prueba automáticamente si la base de datos está vacía
db = SessionLocal()
if db.query(BusModel).count() == 0:
    bus1 = BusModel(placa="XVX123", ruta_nombre="T3", latitud=7.1193, longitud=-73.1224, velocidad=0.0)
    bus2 = BusModel(placa="SDF456", ruta_nombre="P8", latitud=7.1105, longitud=-73.1180, velocidad=0.0)
    db.add(bus1)
    db.add(bus2)
    db.commit()
db.close()

# 3. Inicializar la app de FastAPI
app = FastAPI(title="Metrolinea Inteligente - Estilo Japón")

# Permitir que React (Frontend) se comunique libremente sin bloqueos de seguridad
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar las rutas de los buses
app.include_router(buses.router)