import React, { useState, useEffect, useCallback } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import axios from 'axios'
import { useMockData } from '../services/api'
import styles from './Navbar.module.css'

const Navbar = () => {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [backendOnline, setBackendOnline] = useState(false)
  const [hora, setHora] = useState(new Date())
  const { pathname } = useLocation()

  useEffect(() => {
    setMenuAbierto(false)
  }, [pathname])

  useEffect(() => {
    const id = setInterval(() => setHora(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const verificarBackend = useCallback(async () => {
    if (useMockData) {
      setBackendOnline(true)
      return
    }
    try {
      const apiBase = import.meta.env.VITE_API_URL || '/api'
      await axios.get(`${apiBase}/health`, { timeout: 5000 })
      setBackendOnline(true)
    } catch {
      setBackendOnline(false)
    }
  }, [])

  useEffect(() => {
    verificarBackend()
    const id = setInterval(verificarBackend, 30000)
    return () => clearInterval(id)
  }, [verificarBackend])

  const links = [
    { to: '/', label: 'Inicio', icono: '🏠', exact: true },
    { to: '/dashboard', label: 'Dashboard', icono: '📊' },
    { to: '/routes', label: 'Rutas', icono: '🗺️' },
    { to: '/about', label: 'Acerca de', icono: 'ℹ️' },
  ]

  const formatoHora = hora.toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.inner}>
          <Link to="/" className={styles.logo}>
            <img src="/recursos/logo.png" alt="Metrolínea" className={styles.logoImg} />
            <span className={styles.logoText}>
              Metrolínea <span>Inteligente</span>
            </span>
          </Link>

          <ul className={styles.navLinks}>
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.exact}
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className={styles.rightSection}>
            <span className={styles.clock}>{formatoHora}</span>
            <div className={styles.statusIndicator}>
              <span
                className={`${styles.statusDot} ${
                  backendOnline ? styles.statusDotOnline : styles.statusDotOffline
                }`}
              />
              <span className={styles.statusLabel}>
                {backendOnline ? 'Sistema activo' : 'Sin conexión'}
              </span>
            </div>

            <button
              className={`${styles.hamburger} ${menuAbierto ? styles.hamburgerOpen : ''}`}
              onClick={() => setMenuAbierto((v) => !v)}
              aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
            >
              <span className={styles.hamburgerLine} />
              <span className={styles.hamburgerLine} />
              <span className={styles.hamburgerLine} />
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`${styles.overlay} ${menuAbierto ? styles.overlayVisible : ''}`}
        onClick={() => setMenuAbierto(false)}
        aria-hidden="true"
      />

      <aside className={`${styles.drawer} ${menuAbierto ? styles.drawerOpen : ''}`}>
        <div className={styles.drawerHeader}>
          <div className={styles.drawerLogo}>
            <img src="/recursos/logo.png" alt="Metrolínea" className={styles.logoImg} />
            <span className={styles.logoText}>Metrolínea</span>
          </div>
          <button
            className={styles.drawerClose}
            onClick={() => setMenuAbierto(false)}
            aria-label="Cerrar menú"
          >
            ✕
          </button>
        </div>

        <ul className={styles.drawerLinks}>
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.exact}
                className={({ isActive }) =>
                  `${styles.drawerLink} ${isActive ? styles.drawerLinkActive : ''}`
                }
              >
                <span className={styles.drawerLinkIcon}>{link.icono}</span>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div style={{ padding: '16px 20px', borderTop: `1px solid var(--color-border)` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--color-text-muted)' }}>
            <span
              style={{
                width: 8, height: 8, borderRadius: '50%',
                background: backendOnline ? 'var(--color-primary)' : '#e53935',
                flexShrink: 0,
              }}
            />
            {backendOnline ? 'Sistema activo' : 'Sin conexión al servidor'}
          </div>
        </div>
      </aside>
    </>
  )
}

export default Navbar
