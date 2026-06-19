import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import './styles/globals.css'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import RoutesPage from './pages/Routes'

function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--color-primary-darker)',
            color: '#fff',
            borderRadius: '12px',
            padding: '16px 20px',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: 'var(--color-primary)', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/routes" element={<RoutesPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
