Metrolínea Inteligente — Frontend
Sistema de monitoreo en tiempo real para la red de transporte MetroLínea de Bucaramanga, Colombia.

Stack
Tecnología	Versión	Uso
React	19	UI declarativa por componentes
Vite	8	Bundler y dev server ultrarrápido
Leaflet + react-leaflet	1.9 / 5	Mapas interactivos
Axios	1.7	Cliente HTTP con interceptores
Tailwind CSS	3.4	Estilos utilitarios
react-hot-toast	2.4	Notificaciones toast
react-router-dom	6.30	Enrutamiento SPA
PropTypes	15.8	Validación de props
Instalación
cd frontend
npm install
Ejecución
npm run dev        # Dev server en http://localhost:5173
npm run build      # Build producción → dist/
npm run preview    # Previsualizar build
npm run lint       # ESLint
Variables de entorno
Variable	Default	Descripción
VITE_API_URL	/api	URL base del backend FastAPI. Con Vite proxy se usa /api; en producción cambiar a https://api.ejemplo.com
Datos simulados (sin backend)
El archivo src/services/api.js expone:

export const useMockData = true   // false en producción
Con useMockData = true todas las funciones retornan datos mock con 10 buses distribuidos en 5 rutas, paraderos simulados y variación aleatoria de coordenadas para simular movimiento GPS. El Dashboard refresca automáticamente cada 5 segundos.

Estructura del proyecto
frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/        # Componentes reutilizables
│   │   ├── BusCard.jsx      # Tarjeta de información de un bus
│   │   ├── BusMap.jsx       # Mapa Leaflet con marcadores
│   │   ├── Navbar.jsx       # Barra de navegación
│   │   ├── Navbar.module.css
│   │   ├── Sidebar.jsx      # Panel lateral (legado)
│   │   └── StatsCard.jsx    # Card de estadística
│   ├── data/
│   │   └── mockBuses.js     # 10 buses simulados
│   ├── pages/
│   │   ├── Dashboard.jsx    # Panel principal (mapa + lista)
│   │   ├── Home.jsx         # Landing page
│   │   └── Routes.jsx       # Listado de rutas
│   ├── services/
│   │   └── api.js           # Cliente Axios + mock data
│   ├── styles/
│   │   └── globals.css      # Tailwind directives + variables
│   ├── App.jsx              # Router + layout global
│   ├── index.css            # Estilos base
│   └── main.jsx             # Entry point
├── index.html
├── package.json
├── vite.config.js           # Proxy a :8000 + alias @
├── tailwind.config.js
└── postcss.config.js
Descripción de componentes
Navbar
Barra superior con logo, navegación con NavLink (resalta ruta activa), reloj digital, indicador de estado del backend (health check cada 30s) y menú hamburguesa con drawer lateral en mobile. Usa CSS Modules.

BusMap
Mapa Leaflet centrado en Bucaramanga (7.1193, -73.1227). Renderiza marcadores con icono personalizado (divIcon con 🚌) por cada bus. Almacena el ajuste inicial de bounds para no re-encuadrar en cada polling. Soporta rutaActiva (Polyline) opcional.

BusCard
Tarjeta de bus individual con indicador de estado (verde/ámbar/rojo), ETA, velocidad y botón "Ver en mapa". Si la ETA ≤ 2 min, el texto del ETA se resalta en rojo con animación pulsante. Validación con PropTypes.

Dashboard (página)
Layout de dos columnas: mapa (izquierda) y lista filtrable de buses (derecha). Polling cada 5s. Incluye selector de ruta, buscador por placa/ruta, contador de "Actualizado hace Xs", stats rápidas y notificaciones toast automáticas para retrasos > 5 min.

Home (página)
Landing page con hero en gradiente azul, título principal, dos CTAs, estadísticas decorativas (12 rutas, 48 buses, 98% puntualidad) y cards de características (GPS en vivo, ETA con IA, alertas).

Routes (página)
Listado de las 5 rutas del sistema con tarjetas de colores degradados.

api.js (servicio)
Cliente Axios con interceptores de request (headers) y response (errores en español con toast). Expone 8 funciones asíncronas (getBuses, getBusById, getBusesByRuta, getRutas, getRutaById, getParaderos, getParaderosByRuta, getETA) con fallback a datos mock cuando useMockData = true.

Capturas de pantalla
[Home — Hero]          → src/assets/screenshots/home.png
[Dashboard — Desktop]  → src/assets/screenshots/dashboard-desktop.png
[Dashboard — Mobile]   → src/assets/screenshots/dashboard-mobile.png
[Rutas]                → src/assets/screenshots/routes.png
Licencia
Proyecto académico — Reto de movilidad inteligente.
