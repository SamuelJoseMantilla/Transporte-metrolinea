import React from 'react'
import BusCard from './BusCard'

const Sidebar = ({ buses, loading, onVerEnMapa }) => {
  return (
    <aside className="w-80 bg-white h-full overflow-y-auto shadow-sm hidden lg:block" style={{ borderRight: '1px solid var(--color-border)' }}>
      <div className="p-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold" style={{ color: 'var(--color-text-main)' }}>Buses Activos</h2>
          {!loading && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ color: 'var(--color-text-muted)', background: 'var(--color-surface)' }}>
              {buses.length} unidades
            </span>
          )}
        </div>
      </div>
      <div className="p-4 space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-24 rounded-xl" style={{ background: 'var(--color-primary-soft)' }} />
            </div>
          ))
        ) : buses.length === 0 ? (
          <div className="text-center py-12" style={{ color: 'var(--color-text-muted)' }}>
            <p className="text-sm">No hay buses disponibles</p>
          </div>
        ) : (
          buses.map((bus) => (
            <BusCard
              key={bus.id}
              id={bus.id}
              placa={bus.placa}
              ruta={bus.ruta}
              eta={bus.eta}
              velocidad={bus.velocidad}
              estado={bus.estado}
              onVerEnMapa={onVerEnMapa}
            />
          ))
        )}
      </div>
    </aside>
  )
}

export default Sidebar
