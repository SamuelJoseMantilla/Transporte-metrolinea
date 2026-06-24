# backend/database/connection.py
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# El formato es: postgresql://usuario:contraseña@servidor:puerto/nombre_base_datos
# Si usan Supabase, Neon o Render, ellos les darán una URL larga parecida a esta:
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://postgres:tu_password_aqui@localhost:5432/metrolinea_db"
)

# Cambiamos el engine para PostgreSQL (ya no se necesita el argumento check_same_thread)
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()