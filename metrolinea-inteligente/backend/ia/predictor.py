# backend/ai/predictor.py
import joblib
import os
import pandas as pd
from datetime import datetime

def predecir_tiempo_paradero(ruta: str, paradero: str, clima: str = "Despejado") -> float:
    """
    Usa el modelo binario (.pkl) generado por el equipo para predecir 
    cuántos minutos se demorará el bus en llegar a un paradero específico.
    """
    actual_path = 'backend/ai/modelo_eta.pkl' if os.path.exists('backend/ai/modelo_eta.pkl') else 'ai/modelo_eta.pkl'
    
    if not os.path.exists(actual_path):
        print(f"Advertencia: No se encontró el modelo en {actual_path}.")
        return 12.5 
    
    modelo = joblib.load(actual_path)
    
    # Calcular la hora actual en formato decimal
    ahora = datetime.now()
    hora_decimal = ahora.hour + (ahora.minute / 60.0)
    
    # =====================================================================
    # TRUCO DE DEBUGGING: Ver qué columnas espera el modelo de tu compañero
    # =====================================================================
    try:
        # Si es un Pipeline de Scikit-Learn, intentamos sacar las columnas originales
        if hasattr(modelo, 'feature_names_in_'):
            print("🔍 Las columnas que espera la IA son:", modelo.feature_names_in_)
        elif hasattr(modelo, 'named_steps') and hasattr(modelo.named_steps.get('preprocesador'), 'transformers'):
            # Si tiene un preprocesador intermedio
            print("🔍 Tu compañero usó estas columnas en el entrenamiento:", modelo.feature_names_in_)
    except Exception:
        pass
    # =====================================================================

    # Intento 1: Intentar con la estructura que definimos antes
    datos_entrada = pd.DataFrame([{
        'ruta': ruta,
        'paradero_destino': paradero,
        'hora_del_dia': hora_decimal,  
        'clima': clima
    }])
    
    try:
        prediccion = modelo.predict(datos_entrada)
        return round(float(prediccion[0]), 1)
        
    except Exception as e:
        print(f"❌ Falló el Intento 1 debido a: {e}")
        print("💡 Probando Intento 2 con nombres alternativos de columnas...")
        
        # Intento 2: Estructura alternativa común (si tu compañero usó nombres más cortos)
        datos_entrada_alt = pd.DataFrame([{
            'ruta': ruta,
            'paradero': paradero,
            'hora': hora_decimal,  # <-- Probamos llamándola simplemente 'hora'
            'clima': clima
        }])
        
        try:
            prediccion = modelo.predict(datos_entrada_alt)
            return round(float(prediccion[0]), 1)
        except Exception as e_alt:
            print(f"❌ El Intento 2 también falló: {e_alt}")
            return 15.0  # Retorno seguro para que la app no se caiga