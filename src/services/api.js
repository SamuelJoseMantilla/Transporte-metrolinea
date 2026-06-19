import axios from 'axios'
import toast from 'react-hot-toast'
import { mockBuses } from '../data/mockBuses'

/*
 * ─────────────────────────────────────────────
 *  CONFIGURACIÓN
 * ─────────────────────────────────────────────
 */

/** Desactivar en producción: false */
export const useMockData = true

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

/*
 * ─────────────────────────────────────────────
 *  INTERCEPTORES
 * ─────────────────────────────────────────────
 */

/** Agrega headers comunes a cada petición */
api.interceptors.request.use(
  (config) => {
    config.headers['X-Requested-With'] = 'XMLHttpRequest'
    config.headers['Accept'] = 'application/json'
    return config
  },
  (error) => Promise.reject(error)
)

/**
 * Intercepta errores de respuesta y muestra un mensaje amigable en español.
 * - 400 → dato inválido
 * - 404 → recurso no encontrado
 * - 500 → error interno del servidor
 * - otros → error de conexión / desconocido
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const detail = error.response?.data?.detail || error.response?.data?.message

    const mensajes = {
      400: detail || 'Solicitud inválida. Verifica los datos enviados.',
      404: 'El recurso solicitado no existe en el servidor.',
      422: 'Los datos enviados no son válidos.',
      429: 'Demasiadas solicitudes. Intenta de nuevo en unos segundos.',
      500: 'Error interno del servidor. Intenta más tarde.',
      502: 'El servidor no está disponible en este momento.',
      503: 'El servicio está temporalmente fuera de línea.',
    }

    const mensaje = mensajes[status] || detail || 'Error de conexión. Verifica tu red e intenta de nuevo.'
    toast.error(mensaje)
    return Promise.reject(error)
  }
)

/*
 * ─────────────────────────────────────────────
 *  DATOS MOCK (cuando el backend no está disponible)
 * ─────────────────────────────────────────────
 */

/** Retraso simulado en milisegundos */
const MOCK_DELAY = 300

/** Simula una respuesta exitosa de la API */
const mockResponse = (data, delay = MOCK_DELAY) =>
  new Promise((resolve) => setTimeout(() => resolve({ data }), delay))

/** Simula un error ocasional (10% de las veces) */
const mockFallible = (data, probabilidadError = 0) => {
  if (Math.random() < probabilidadError) {
    return Promise.reject(new Error('Simulación: error temporal'))
  }
  return mockResponse(data)
}

/** Rutas disponibles para los datos mock */
const mockRutas = [
  { id: 'A', nombre: 'Ruta A - Centro', descripcion: 'Conecta el norte con el centro histórico.', color: '#0056b3' },
  { id: 'B', nombre: 'Ruta B - Norte', descripcion: 'Cubre las avenidas del norte de la ciudad.', color: '#10b981' },
  { id: 'C', nombre: 'Ruta C - Sur', descripcion: 'Enlace hacia el sur y zonas residenciales.', color: '#ef4444' },
  { id: 'D', nombre: 'Ruta D - Este', descripcion: 'Acceso a zonas comerciales del este.', color: '#f59e0b' },
  { id: 'E', nombre: 'Ruta E - Oeste', descripcion: 'Conexión con el sector occidente.', color: '#8b5cf6' },
]

/** Paraderos mock asociados a cada ruta */
const mockParaderos = [
  { id: 'P01', nombre: 'Paradero Centro', ruta: 'Ruta A - Centro', lat: 7.1208, lng: -73.1222 },
  { id: 'P02', nombre: 'Paradero Norte', ruta: 'Ruta B - Norte', lat: 7.1350, lng: -73.1180 },
  { id: 'P03', nombre: 'Paradero Sur', ruta: 'Ruta C - Sur', lat: 7.1050, lng: -73.1320 },
  { id: 'P04', nombre: 'Paradero Este', ruta: 'Ruta D - Este', lat: 7.1220, lng: -73.1080 },
  { id: 'P05', nombre: 'Paradero Oeste', ruta: 'Ruta E - Oeste', lat: 7.1180, lng: -73.1420 },
]

/*
 * ─────────────────────────────────────────────
 *  BUSES
 * ─────────────────────────────────────────────
 */

/**
 * Obtiene todos los buses con su ubicación en tiempo real.
 * @returns {Promise<{data: Array}>} Lista de buses
 */
export const getBuses = () => {
  if (useMockData) return mockFallible(mockBuses)
  return api.get('/buses')
}

/**
 * Obtiene un bus por su ID.
 * @param {string|number} id - Identificador del bus
 * @returns {Promise<{data: Object}>} Datos del bus
 */
export const getBusById = (id) => {
  if (useMockData) {
    const bus = mockBuses.find((b) => b.id === id)
    if (!bus) return Promise.reject(new Error('Bus no encontrado'))
    return mockResponse(bus)
  }
  return api.get(`/bus/${id}`)
}

/**
 * Obtiene los buses que operan en una ruta específica.
 * @param {string} rutaId - ID o nombre de la ruta ("Ruta A - Centro", etc.)
 * @returns {Promise<{data: Array}>} Lista de buses en esa ruta
 */
export const getBusesByRuta = (rutaId) => {
  if (useMockData) {
    const filtrados = mockBuses.filter((b) => b.ruta === rutaId)
    return mockResponse(filtrados)
  }
  return api.get('/buses', { params: { ruta: rutaId } })
}

/*
 * ─────────────────────────────────────────────
 *  RUTAS
 * ─────────────────────────────────────────────
 */

/**
 * Obtiene todas las rutas del sistema.
 * @returns {Promise<{data: Array}>} Lista de rutas
 */
export const getRutas = () => {
  if (useMockData) return mockResponse(mockRutas)
  return api.get('/rutas')
}

/**
 * Obtiene una ruta por su ID.
 * @param {string} id - ID de la ruta ("A", "B", etc.)
 * @returns {Promise<{data: Object}>} Datos de la ruta
 */
export const getRutaById = (id) => {
  if (useMockData) {
    const ruta = mockRutas.find((r) => r.id === id)
    if (!ruta) return Promise.reject(new Error('Ruta no encontrada'))
    return mockResponse(ruta)
  }
  return api.get(`/ruta/${id}`)
}

/*
 * ─────────────────────────────────────────────
 *  PARADEROS
 * ─────────────────────────────────────────────
 */

/**
 * Obtiene todos los paraderos del sistema.
 * @returns {Promise<{data: Array}>} Lista de paraderos
 */
export const getParaderos = () => {
  if (useMockData) return mockResponse(mockParaderos)
  return api.get('/paraderos')
}

/**
 * Obtiene los paraderos de una ruta específica.
 * @param {string} id - ID o nombre de la ruta
 * @returns {Promise<{data: Array}>} Lista de paraderos en esa ruta
 */
export const getParaderosByRuta = (id) => {
  if (useMockData) {
    const ruta = mockRutas.find((r) => r.id === id)
    const nombreRuta = ruta ? ruta.nombre : id
    const filtrados = mockParaderos.filter((p) => p.ruta === nombreRuta)
    return mockResponse(filtrados)
  }
  return api.get('/paraderos', { params: { ruta: id } })
}

/*
 * ─────────────────────────────────────────────
 *  ETA — PREDICCIÓN CON IA
 * ─────────────────────────────────────────────
 */

/**
 * Obtiene el tiempo estimado de llegada de un bus a un paradero.
 * @param {string|number} busId - ID del bus
 * @param {string|number} paraderoId - ID del paradero destino
 * @returns {Promise<{data: {eta: string, confianza: number}>} Tiempo estimado y nivel de confianza
 */
export const getETA = (busId, paraderoId) => {
  if (useMockData) {
    const bus = mockBuses.find((b) => b.id === busId)
    const eta = bus ? bus.eta : `${Math.floor(Math.random() * 15) + 1} min`
    const confianza = Math.round((0.7 + Math.random() * 0.25) * 100)
    return mockResponse({ eta, confianza })
  }
  return api.get(`/tiempo-llegada/${paraderoId}`, { params: { bus: busId } })
}

export default api
