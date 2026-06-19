import React, { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const createBusIcon = () =>
  L.divIcon({
    className: '',
    html: `
      <div style="
        width: 40px; height: 40px;
        background: linear-gradient(135deg, #96BD0D, #B8D94A);
        border: 3px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 3px 12px rgba(150,189,13,0.4);
        font-size: 20px;
      ">🚌</div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  })

const CENTRO_BUCARAMANGA = [7.1193, -73.1227]

const MapInitialFit = ({ buses }) => {
  const map = useMap()
  const yaAjustado = useRef(false)

  useEffect(() => {
    if (buses.length > 0 && !yaAjustado.current) {
      const bounds = L.latLngBounds(buses.map((b) => [b.lat, b.lng]))
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 })
      yaAjustado.current = true
    }
  }, [buses, map])

  return null
}

const BusMap = ({ buses = [], rutaActiva = [] }) => {
  return (
    <div className="h-[300px] lg:h-[500px] w-full rounded-xl overflow-hidden shadow-lg border" style={{ borderColor: 'var(--color-border)' }}>
      <MapContainer
        center={CENTRO_BUCARAMANGA}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <MapInitialFit buses={buses} />

        {rutaActiva.length > 1 && (
          <Polyline
            positions={rutaActiva}
            pathOptions={{
              color: '#96BD0D',
              weight: 4,
              opacity: 0.7,
              dashArray: '10 10',
            }}
          />
        )}

        {buses.map((bus) => (
          <Marker
            key={bus.id}
            position={[bus.lat, bus.lng]}
            icon={createBusIcon()}
          >
            <Popup>
              <div className="min-w-[200px]">
                <div className="font-bold text-base border-b pb-2 mb-2" style={{ color: 'var(--color-primary-darker)', borderColor: 'var(--color-border)' }}>
                  Bus {bus.placa}
                </div>
                <div className="space-y-1.5 text-sm">
                  <p style={{ color: 'var(--color-text-muted)' }}>
                    <span className="font-medium" style={{ color: 'var(--color-text-main)' }}>Ruta:</span>{' '}
                    {bus.ruta}
                  </p>
                  <p style={{ color: 'var(--color-text-muted)' }}>
                    <span className="font-medium" style={{ color: 'var(--color-text-main)' }}>Velocidad:</span>{' '}
                    <span className="font-semibold" style={{ color: 'var(--color-text-main)' }}>{bus.velocidad}</span>
                  </p>
                  <div className="mt-2 pt-2 flex items-center justify-between" style={{ borderTop: `1px solid var(--color-border)` }}>
                    <span className="text-xs uppercase tracking-wide font-medium" style={{ color: 'var(--color-text-muted)' }}>
                      Próximo paradero
                    </span>
                    <span className="text-lg font-bold" style={{ color: 'var(--color-primary-darker)' }}>
                      {bus.eta}
                    </span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

export default BusMap
