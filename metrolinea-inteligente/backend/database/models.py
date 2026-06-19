# backend/ai/predictor.py
import joblib
import os
import pandas as pd
from datetime import datetime

# Ruta exacta hacia el modelo que te envió tu compañero
MODEL_PATH = 'database/../ai/modelo_eta.pkl' # O 'backend/ai/modelo_eta.pkl' dependiendo de dónde lances uvicorn

def predecir_tiempo_paradero(ruta: str, paradero: str, clima: str = "Despejado") -> float:
    """
    Usa el modelo binario de tu compañero para predecir cuántos minutos se demorará el bus.
    """
    if not os.path.exists('ai/modelo_eta.pkl') and not os.path.exists('backend/ai/modelo_eta.pkl'):
        # Salvavidas por si el archivo .pkl no se encuentra en la ruta
        return 12.5 
    
    # Encontrar la ruta real del archivo vayas donde vayas
    actual_path = 'backend/ai/modelo_eta.pkl' if os.path.exists('backend/ai/modelo_eta.pkl') else 'ai/modelo_eta.pkl'
    
    # 1. Cargar el modelo entrenado por tu compañero
    modelo = joblib.load(actual_path)
    
    # 2. Capturar la hora actual de Bucaramanga de forma automática
    hora_actual = datetime.now().hour + (datetime.now().minute / 60.0)
    
    # 3. Formatear los datos de entrada exactamente como el modelo los espera
    # Ajusta los nombres de las columnas según cómo los entrenó tu compañero (ej: 'ruta', 'clima', etc.)
    datos_entrada = pd.DataFrame([{
        'ruta': ruta,
        'paradero_destino': paradero,
        'hora_del_dia': hora_actual,
        'clima': clima
    }])
    
    # 4. Hacer la predicción predictiva
    prediccion = modelo.predict(datos_entrada)
    
    return round(float(prediccion[0]), 1)