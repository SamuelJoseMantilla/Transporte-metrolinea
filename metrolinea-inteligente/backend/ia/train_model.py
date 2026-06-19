import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import joblib

datos = pd.read_csv("datos.csv")

X = datos[["hora", "dia", "velocidad", "distancia"]]
y = datos["eta"]

modelo = RandomForestRegressor()

modelo.fit(X, y)

joblib.dump(modelo, "modelo.pkl")

print("Modelo entrenado correctamente")