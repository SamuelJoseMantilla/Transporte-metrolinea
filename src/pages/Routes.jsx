import React from 'react'

const routes = [
  { id: 'A', name: 'Ruta A - Centro', desc: 'Conecta el sector norte con el centro histórico de Bucaramanga.', color: 'var(--color-primary)' },
  { id: 'B', name: 'Ruta B - Norte', desc: 'Cubre las principales avenidas del norte de la ciudad.', color: 'var(--color-primary-dark)' },
  { id: 'C', name: 'Ruta C - Sur', desc: 'Enlace rápido hacia el sur y zonas residenciales.', color: 'var(--color-primary-light)' },
  { id: 'D', name: 'Ruta D - Este', desc: 'Acceso a zonas comerciales y centros educativos del este.', color: '#f59e0b' },
  { id: 'E', name: 'Ruta E - Oeste', desc: 'Conexión eficiente con el sector occidente de la ciudad.', color: '#8b5cf6' },
]

const RoutesPage = () => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--color-surface)' }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: 'var(--color-primary-darker)' }}>
            Rutas del Sistema
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--color-text-muted)' }}>
            Conoce todas las rutas disponibles de MetroLínea y sus paraderos asociados.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {routes.map((route) => (
            <div
              key={route.id}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              style={{ border: '1px solid var(--color-border)' }}
            >
              <div className="flex items-center gap-6 p-6">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shrink-0 shadow-lg group-hover:scale-110 transition-transform"
                  style={{ background: route.color }}
                >
                  {route.id}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--color-text-main)' }}>{route.name}</h3>
                  <p className="leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{route.desc}</p>
                </div>
                <svg className="w-5 h-5 shrink-0 group-hover:translate-x-1 transition-all" style={{ color: 'var(--color-border)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RoutesPage
