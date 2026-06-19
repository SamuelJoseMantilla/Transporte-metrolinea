# backend/ai/predictor.py
import joblib
import os
import pandas as pd
from datetime import datetime

def predecir_tiempo_paradero(hora: int, dia: int, velocidad: float, distancia: float) -> float:
    """
    Usa el modelo binario (.pkl) entrenado por el compañero para predecir 
    el tiempo estimado de llegada (ETA) en minutos.
    """
    # Manejo de rutas dinámicas del archivo para evitar errores según dónde se corra uvicorn
    actual_path = 'backend/ai/modelo_eta.pkl' if os.path.exists('backend/ai/modelo_eta.pkl') else 'ai/modelo_eta.pkl'
    if not os.path.exists(actual_path):
        # Intentar buscarlo con el nombre original por si acaso
        actual_path = 'backend/modelo.pkl' if os.path.exists('backend/modelo.pkl') else 'modelo.pkl'

    if not os.path.exists(actual_path):
        print(f"Advertencia: No se encontró el archivo del modelo en {actual_path}. Usando estimación base.")
        return 15.0

    # 1. Cargar el modelo entrenado
    modelo = joblib.load(actual_path)

    try:
        # 2. Realizar la predicción usando la estructura de matriz exacta esperada por el modelo
        prediccion = modelo.predict([[hora, dia, velocidad, distancia]])
        
        # Retornamos los minutos estimados redondeados a 2 decimales
        return round(float(prediccion[0]), 2)
        
    except Exception as e:
        print(f"Error al predecir con el modelo: {e}. Retornando tiempo por defecto.")
        return 15.0