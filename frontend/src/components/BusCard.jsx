import React from 'react'
import PropTypes from 'prop-types'

const ESTADO_CONFIG = {
  en_servicio: {
    label: 'En servicio',
    bg: 'var(--color-primary)',
    text: '#ffffff',
    dot: '#ffffff',
  },
  retrasado: {
    label: 'Retrasado',
    bg: '#fef3c7',
    text: '#92400e',
    dot: '#f59e0b',
  },
  fuera_de_servicio: {
    label: 'Fuera de servicio',
    bg: '#fee2e2',
    text: '#991b1b',
    dot: '#ef4444',
  },
}

const BusCard = ({ id, placa, ruta, eta, velocidad, estado, onVerEnMapa, seleccionado }) => {
  const cfg = ESTADO_CONFIG[estado] || ESTADO_CONFIG.fuera_de_servicio

  const etaNumber = parseInt(eta, 10)
  const etaUrgente = !isNaN(etaNumber) && etaNumber <= 2

  return (
    <div
      className="group relative p-4 bg-white rounded-xl transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-0.5 cursor-default"
      style={{
        border: seleccionado ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
        borderLeft: `4px solid var(--color-primary)`,
        boxShadow: seleccionado ? '0 0 0 3px var(--color-primary-soft)' : undefined,
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 group-hover:scale-110 transition-transform" style={{ background: 'var(--color-primary-soft)' }}>
            🚌
          </div>
          <div>
            <h3 className="font-semibold text-sm leading-tight" style={{ color: 'var(--color-text-main)' }}>
              Bus {placa}
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{ruta}</p>
          </div>
        </div>

        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border"
          style={{
            background: cfg.bg,
            color: cfg.text,
            borderColor: 'transparent',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
          {cfg.label}
        </span>
      </div>

      <div className="flex items-center justify-between mb-3 text-sm">
        <div className="flex items-center gap-1.5" style={{ color: 'var(--color-text-muted)' }}>
          <span className="text-base">⚡</span>
          <span>{velocidad}</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase tracking-wide font-medium block" style={{ color: 'var(--color-text-muted)' }}>
            ETA
          </span>
          <span
            className="text-sm font-bold transition-colors"
            style={etaUrgente ? { color: '#dc2626' } : { color: 'var(--color-primary-darker)' }}
          >
            {etaUrgente ? <span className="animate-pulse">{eta}</span> : eta}
          </span>
        </div>
      </div>

      {onVerEnMapa && (
        <button
          onClick={() => onVerEnMapa(id)}
          className="w-full py-2 mt-1 rounded-lg text-sm font-medium transition-all duration-200 ease-out active:scale-[0.98]"
          style={{
            color: '#ffffff',
            background: 'var(--color-primary)',
          }}
          onMouseEnter={(e) => e.target.style.background = 'var(--color-primary-dark)'}
          onMouseLeave={(e) => e.target.style.background = 'var(--color-primary)'}
        >
          Ver en mapa
        </button>
      )}
    </div>
  )
}

BusCard.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  placa: PropTypes.string.isRequired,
  ruta: PropTypes.string,
  eta: PropTypes.string,
  velocidad: PropTypes.string,
  estado: PropTypes.oneOf(['en_servicio', 'retrasado', 'fuera_de_servicio']),
  onVerEnMapa: PropTypes.func,
  seleccionado: PropTypes.bool,
}

BusCard.defaultProps = {
  ruta: 'Sin ruta',
  seleccionado: false,
  eta: '—',
  velocidad: '—',
  estado: 'fuera_de_servicio',
  onVerEnMapa: null,
}

export default BusCard
