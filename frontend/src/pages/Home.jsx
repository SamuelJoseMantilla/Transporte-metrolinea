import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="flex-1">
      <section className="relative overflow-hidden" style={{ background: 'var(--color-primary)' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '50px 50px',
          }} />
        </div>

        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 blur-3xl" style={{ background: 'var(--color-primary-light)' }} />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-30 blur-3xl" style={{ background: 'var(--color-primary-dark)' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 sm:py-36">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <img src="/recursos/logo.png" alt="Metrolínea" style={{ height: '80px', width: 'auto' }} />
            </div>

            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-8 border border-white/30">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-sm font-medium text-white/90">Monitoreo en vivo</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1] text-white">
              Metrolínea Inteligente
              <br />
              <span className="text-white/90">
                Bucaramanga en tiempo real
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
              Visualiza la posición exacta de cada bus, consulta rutas activas, 
              recibe estimaciones de llegada con IA y mantente informado sobre 
              el estado del sistema de transporte público.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 bg-white text-[var(--color-primary-darker)] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[var(--color-primary-soft)] hover:scale-105 transition-all shadow-xl"
              >
                Explorar Dashboard
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                to="/routes"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg border border-white/40 hover:bg-white/20 transition-all"
              >
                Ver Rutas
              </Link>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto">
              {[
                { valor: '12', label: 'Rutas activas' },
                { valor: '48', label: 'Buses en operación' },
                { valor: '98%', label: 'Puntualidad' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl sm:text-4xl font-extrabold text-white">{stat.valor}</p>
                  <p className="text-sm text-white/70 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--color-surface)] to-transparent" />
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: 'var(--color-text-main)' }}>
            ¿Por qué Metrolínea Inteligente?
          </h2>
          <p className="max-w-2xl mx-auto text-lg" style={{ color: 'var(--color-text-muted)' }}>
            Una plataforma diseñada para mejorar la experiencia de movilidad 
            en Bucaramanga con tecnología de punta.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              titulo: 'Monitoreo GPS en Vivo',
              desc: 'Seguimiento satelital de cada unidad con actualización cada 5 segundos. Visualiza la posición exacta en el mapa.',
              icono: (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                </svg>
              ),
            },
            {
              titulo: 'ETA con Inteligencia Artificial',
              desc: 'Modelos de Machine Learning entrenados con datos históricos de tráfico para predecir tiempos de llegada precisos.',
              icono: (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                </svg>
              ),
            },
            {
              titulo: 'Alertas y Notificaciones',
              desc: 'Recibe notificaciones proactivas sobre retrasos, desvíos y novedades operativas en tiempo real.',
              icono: (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
              ),
            },
          ].map((feature) => (
            <div
              key={feature.titulo}
              className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border hover:border-[var(--color-primary)]/30"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" style={{ background: 'var(--color-primary-soft)', color: 'var(--color-primary-darker)' }}>
                {feature.icono}
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--color-text-main)' }}>{feature.titulo}</h3>
              <p className="leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
