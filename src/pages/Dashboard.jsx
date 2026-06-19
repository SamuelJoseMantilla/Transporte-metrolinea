import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import toast from 'react-hot-toast'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import BusMap from '../components/BusMap'
import BusCard from '../components/BusCard'
import { getBuses } from '../services/api'

const POLLING_INTERVAL = 5000
const UMBRAL_RETRASO_NOTIFICACION = 5
const RUTAS = ['Todas', 'Ruta A - Centro', 'Ruta B - Norte', 'Ruta C - Sur', 'Ruta D - Este', 'Ruta E - Oeste']
const MAX_HISTORIAL_ETA = 10

const fetchBuses = async () => {
  const { data } = await getBuses()
  return data.map((bus) => ({
    ...bus,
    lat: bus.lat + (Math.random() - 0.5) * 0.002,
    lng: bus.lng + (Math.random() - 0.5) * 0.002,
  }))
}

const extraerMinutos = (eta) => {
  const n = parseInt(eta, 10)
  return isNaN(n) ? 0 : n
}

// Colores para gráficos
const COLORES_ESTADO = {
  en_servicio: '#96BD0D',
  retrasado: '#F59E0B',
  fuera_de_servicio: '#EF4444',
}

const ETIQUETAS_ESTADO = {
  en_servicio: 'En servicio',
  retrasado: 'Retrasado',
  fuera_de_servicio: 'Fuera de servicio',
}

// Tarjeta reutilizable para envolver cada gráfica
const ChartCard = ({ titulo, children }) => (
  <div className="bg-white rounded-xl p-4" style={{ border: '1px solid var(--color-border)' }}>
    <h4 className="text-sm font-medium mb-3" style={{ color: 'var(--color-primary-darker)' }}>
      {titulo}
    </h4>
    {children}
  </div>
)

const Dashboard = () => {
  const [buses, setBuses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filtroRuta, setFiltroRuta] = useState('Todas')
  const [busquedaParadero, setBusquedaParadero] = useState('')
  const [ultimaActualizacion, setUltimaActualizacion] = useState(null)
  const [busSeleccionado, setBusSeleccionado] = useState(null)
  const [historialETA, setHistorialETA] = useState([])
  const busesNotificados = useRef(new Set())

  const cargarBuses = useCallback(async () => {
    try {
      const datos = await fetchBuses()
      setBuses(datos)
      setError(null)
      setUltimaActualizacion(Date.now())

      datos.forEach((bus) => {
        const minutosRetraso = extraerMinutos(bus.eta)
        if (bus.estado === 'retrasado' && minutosRetraso > UMBRAL_RETRASO_NOTIFICACION) {
          if (!busesNotificados.current.has(bus.id)) {
            busesNotificados.current.add(bus.id)
            toast.error(
              `Bus ${bus.placa} con retraso de ${bus.eta} en ${bus.ruta}`,
              { id: `retraso-${bus.id}`, duration: 6000 }
            )
          }
        } else {
          busesNotificados.current.delete(bus.id)
        }
      })
    } catch (err) {
      setError('No se pudieron cargar los datos. Verifica la conexión con el servidor.')
      toast.error('Error de conexión con el servidor')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    cargarBuses()
    const intervalo = setInterval(cargarBuses, POLLING_INTERVAL)
    return () => clearInterval(intervalo)
  }, [cargarBuses])

  useEffect(() => {
    return () => busesNotificados.current.clear()
  }, [])

  // Actualiza historial ETA del bus seleccionado en cada polling
  useEffect(() => {
    const objetivo = busSeleccionado
      ? buses.find((b) => b.id === busSeleccionado)
      : null
    const fallback = !objetivo && buses.length > 0
      ? buses.reduce((a, b) => (extraerMinutos(a.eta) < extraerMinutos(b.eta) ? a : b))
      : null
    const busActual = objetivo || fallback

    if (busActual) {
      setHistorialETA((prev) => {
        const ahora = Date.now()
        const nuevo = [...prev, { time: ahora, eta: extraerMinutos(busActual.eta) }]
        return nuevo.slice(-MAX_HISTORIAL_ETA)
      })
    }
  }, [buses, busSeleccionado])

  const busesFiltrados = useMemo(() => {
    return buses.filter((bus) => {
      const coincideRuta = filtroRuta === 'Todas' || bus.ruta === filtroRuta
      const termino = busquedaParadero.toLowerCase().trim()
      const coincideBusqueda = !termino ||
        bus.placa.toLowerCase().includes(termino) ||
        bus.ruta.toLowerCase().includes(termino)
      return coincideRuta && coincideBusqueda
    })
  }, [buses, filtroRuta, busquedaParadero])

  const handleVerEnMapa = useCallback((id) => {
    const bus = buses.find((b) => b.id === id)
    if (bus) {
      setBusSeleccionado(id)
      setHistorialETA([])
      toast.success(`Buscando bus ${bus.placa} en el mapa...`)
    }
  }, [buses])

  // Datos para BarChart: velocidad promedio por ruta
  const datosVelocidad = useMemo(() => {
    const agrupado = {}
    buses.forEach((bus) => {
      if (!agrupado[bus.ruta]) agrupado[bus.ruta] = { suma: 0, count: 0 }
      agrupado[bus.ruta].suma += bus.velocidad
      agrupado[bus.ruta].count += 1
    })
    return Object.entries(agrupado).map(([ruta, { suma, count }]) => ({
      ruta: ruta.replace('Ruta ', '').replace(' - ', ' '),
      velocidad: Math.round((suma / count) * 10) / 10,
    }))
  }, [buses])

  // Datos para PieChart: estado de la flota
  const datosEstado = useMemo(() => {
    const conteo = { en_servicio: 0, retrasado: 0, fuera_de_servicio: 0 }
    buses.forEach((bus) => {
      if (conteo[bus.estado] !== undefined) conteo[bus.estado] += 1
    })
    return Object.entries(conteo)
      .filter(([, v]) => v > 0)
      .map(([key, value]) => ({
        name: ETIQUETAS_ESTADO[key],
        value,
        color: COLORES_ESTADO[key],
      }))
  }, [buses])

  // Datos para LineChart: historial ETA
  const datosETA = useMemo(() => {
    if (historialETA.length === 0) return []
    const base = historialETA[historialETA.length - 1].time
    return historialETA.map((p) => ({
      segundos: Math.round((p.time - base) / 1000),
      eta: p.eta,
    }))
  }, [historialETA])

  const busETAInfo = useMemo(() => {
    if (historialETA.length === 0) return null
    const objetivo = busSeleccionado
      ? buses.find((b) => b.id === busSeleccionado)
      : buses.reduce((a, b) => (extraerMinutos(a.eta) < extraerMinutos(b.eta) ? a : b), buses[0])
    return objetivo
  }, [buses, busSeleccionado, historialETA])

  const totalActivos = buses.filter((b) => b.estado === 'en_servicio').length
  const totalRetrasados = buses.filter((b) => b.estado === 'retrasado').length
  const totalRutas = new Set(buses.filter((b) => b.estado !== 'fuera_de_servicio').map((b) => b.ruta)).size

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col" style={{ background: 'var(--color-surface)' }}>
      <div className="bg-white border-b px-4 sm:px-6 py-3 shrink-0" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

          <div className="flex items-center gap-4">
            <h1 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--color-primary-darker)' }}>
              Dashboard
            </h1>
            <select
              value={filtroRuta}
              onChange={(e) => setFiltroRuta(e.target.value)}
              className="text-sm rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-main)', '--tw-ring-color': 'var(--color-primary-light)' }}
            >
              {RUTAS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar placa o ruta..."
                value={busquedaParadero}
                onChange={(e) => setBusquedaParadero(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-sm rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 w-48"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-main)', '--tw-ring-color': 'var(--color-primary-light)' }}
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs whitespace-nowrap" style={{ color: 'var(--color-text-muted)' }}>
              <span className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-gray-300' : ''}`} style={{ background: loading ? undefined : 'var(--color-primary)' }} />
              <ActualizacionContador timestamp={ultimaActualizacion} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
          {[
            { label: 'En servicio', valor: loading ? '...' : totalActivos, color: 'var(--color-primary)' },
            { label: 'Rutas activas', valor: loading ? '...' : totalRutas, color: 'var(--color-primary-light)' },
            { label: 'Retrasados', valor: loading ? '...' : totalRetrasados, color: '#f59e0b' },
            { label: 'Total buses', valor: loading ? '...' : buses.length, color: 'var(--color-text-muted)' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-lg px-4 py-2.5 shadow-sm" style={{ borderLeft: `4px solid ${stat.color}` }}>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{stat.label}</p>
              <p className="text-xl font-bold" style={{ color: 'var(--color-text-main)' }}>{stat.valor}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="lg:flex-1 h-1/2 lg:h-full p-3 lg:p-4">
          {error ? (
            <MensajeError mensaje={error} onReintentar={cargarBuses} />
          ) : (
            <BusMap buses={busesFiltrados} />
          )}
        </div>

        <div className="lg:w-80 xl:w-96 h-1/2 lg:h-full bg-white lg:border-l overflow-hidden flex flex-col" style={{ borderColor: 'var(--color-border)' }}>
          <div className="p-3 border-b" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}>
            <p className="text-sm font-semibold" style={{ color: 'var(--color-text-main)' }}>
              {busesFiltrados.length} bus{busesFiltrados.length !== 1 ? 'es' : ''} encontrado{busesFiltrados.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-xl h-28" style={{ background: 'var(--color-primary-soft)' }} />
              ))
            ) : busesFiltrados.length === 0 ? (
              <MensajeSinDatos />
            ) : (
              busesFiltrados.map((bus) => (
                <BusCard
                  key={bus.id}
                  id={bus.id}
                  placa={bus.placa}
                  ruta={bus.ruta}
                  eta={bus.eta}
                  velocidad={bus.velocidad}
                  estado={bus.estado}
                  onVerEnMapa={handleVerEnMapa}
                  seleccionado={busSeleccionado === bus.id}
                />
              ))
            )}

            {/* Separador y sección de análisis */}
            {buses.length > 0 && (
              <>
                <hr style={{ borderColor: 'var(--color-border)', margin: '16px 0' }} />

                <div className="mb-2">
                  <h3 className="text-sm font-bold" style={{ color: 'var(--color-primary-darker)' }}>
                    Análisis en tiempo real
                  </h3>
                </div>

                <div className="space-y-4">
                  {/* Gráfica 1 — Velocidad promedio por ruta */}
                  <ChartCard titulo="Velocidad promedio por ruta">
                    {datosVelocidad.length === 0 ? (
                      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Sin datos</p>
                    ) : (
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={datosVelocidad} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#D4E87A" />
                          <XAxis dataKey="ruta" tick={{ fontSize: 11, fill: '#4A5C0D' }} />
                          <YAxis tick={{ fontSize: 11, fill: '#4A5C0D' }} unit=" km/h" />
                          <Tooltip
                            contentStyle={{
                              background: '#fff',
                              border: '1px solid #D4E87A',
                              borderRadius: 8,
                              fontSize: 12,
                            }}
                          />
                          <Bar dataKey="velocidad" fill="#96BD0D" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </ChartCard>

                  {/* Gráfica 2 — ETA en tiempo real */}
                  <ChartCard titulo={`ETA en tiempo real — Bus ${busETAInfo ? busETAInfo.placa : '...'}`}>
                    {datosETA.length < 2 ? (
                      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        {datosETA.length === 0
                          ? 'Esperando datos del bus seleccionado...'
                          : 'Acumulando datos...'}
                      </p>
                    ) : (
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={datosETA} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#D4E87A" />
                          <XAxis
                            dataKey="segundos"
                            tick={{ fontSize: 11, fill: '#4A5C0D' }}
                            tickFormatter={(v) => `hace ${Math.abs(v)}s`}
                          />
                          <YAxis tick={{ fontSize: 11, fill: '#4A5C0D' }} unit=" min" domain={[0, 'auto']} />
                          <Tooltip
                            contentStyle={{
                              background: '#fff',
                              border: '1px solid #D4E87A',
                              borderRadius: 8,
                              fontSize: 12,
                            }}
                            labelFormatter={(v) => `hace ${Math.abs(v)}s`}
                          />
                          <Line
                            type="monotone"
                            dataKey="eta"
                            stroke="#96BD0D"
                            strokeWidth={2}
                            dot={{ fill: '#96BD0D', r: 4 }}
                            activeDot={(props) => {
                              const esCritico = props.payload.eta <= 2
                              return (
                                <circle
                                  cx={props.cx}
                                  cy={props.cy}
                                  r={6}
                                  fill={esCritico ? '#EF4444' : '#96BD0D'}
                                  stroke="#fff"
                                  strokeWidth={2}
                                />
                              )
                            }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </ChartCard>

                  {/* Gráfica 3 — Estado de la flota */}
                  <ChartCard titulo="Estado de la flota">
                    {datosEstado.length === 0 ? (
                      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Sin datos</p>
                    ) : (
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={datosEstado}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={3}
                            dataKey="value"
                            label={({ value, payload }) => {
                              const total = datosEstado.reduce((a, b) => a + b.value, 0)
                              return `${Math.round((value / total) * 100)}%`
                            }}
                            labelLine={false}
                          >
                            {datosEstado.map((entry, index) => (
                              <Cell key={index} fill={entry.color} />
                            ))}
                          </Pie>
                          <Legend
                            verticalAlign="bottom"
                            iconType="circle"
                            iconSize={10}
                            formatter={(value, entry) => (
                              <span style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>
                                {value}: {entry.payload.value}
                              </span>
                            )}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </ChartCard>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const ActualizacionContador = ({ timestamp }) => {
  const [texto, setTexto] = useState('Conectando...')

  useEffect(() => {
    if (!timestamp) {
      setTexto('Conectando...')
      return
    }
    const actualizar = () => {
      const segs = Math.floor((Date.now() - timestamp) / 1000)
      setTexto(segs < 60 ? `Actualizado hace ${segs}s` : `Actualizado hace ${Math.floor(segs / 60)}m`)
    }
    actualizar()
    const id = setInterval(actualizar, 1000)
    return () => clearInterval(id)
  }, [timestamp])

  return <span>{texto}</span>
}

const MensajeError = ({ mensaje, onReintentar }) => (
  <div className="h-full flex flex-col items-center justify-center text-center p-8">
    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: '#fee2e2' }}>
      <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
    </div>
    <p className="font-semibold mb-1" style={{ color: 'var(--color-text-main)' }}>Error de conexión</p>
    <p className="text-sm mb-4 max-w-xs" style={{ color: 'var(--color-text-muted)' }}>{mensaje}</p>
    <button
      onClick={onReintentar}
      className="text-white text-sm font-medium rounded-lg px-5 py-2 transition-colors"
      style={{ background: 'var(--color-primary)' }}
      onMouseEnter={(e) => e.target.style.background = 'var(--color-primary-dark)'}
      onMouseLeave={(e) => e.target.style.background = 'var(--color-primary)'}
    >
      Reintentar
    </button>
  </div>
)

const MensajeSinDatos = () => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3" style={{ background: 'var(--color-primary-soft)' }}>
      <svg className="w-7 h-7" style={{ color: 'var(--color-text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    </div>
    <p className="font-medium" style={{ color: 'var(--color-text-muted)' }}>Sin resultados</p>
    <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>No hay buses que coincidan con los filtros seleccionados.</p>
  </div>
)

export default Dashboard
