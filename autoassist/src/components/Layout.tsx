// Layout.tsx
// Este componente envuelve TODA la app cuando el usuario está logueado.
// Tiene: barra superior (header) + menú lateral (sidebar) + área de contenido.
// Usamos <Outlet /> de react-router para renderizar la página actual.

import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { UserButton } from '@clerk/clerk-react'
import { useWorkshop } from '../hooks/useWorkshop'

export default function Layout() {
  // useLocation nos dice en qué página estamos (para resaltar el menú)
  const location = useLocation()
  // Obtenemos el taller del usuario
  const { workshop, loading, error } = useWorkshop()
  // Estado para abrir/cerrar el menú en móvil
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Si está cargando el taller, mostramos un loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando tu taller...</p>
        </div>
      </div>
    )
  }

  // Si hay error, lo mostramos
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-red-800 font-bold text-lg">Error</h2>
          <p className="text-red-600 mt-2">{error}</p>
          <p className="text-red-500 text-sm mt-2">
            Revisa la consola del navegador (F12) para más detalles.
          </p>
        </div>
      </div>
    )
  }

  // Elementos del menú lateral
  const menuItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: '📊',
    },
    {
      name: 'Clientes',
      path: '/clientes',
      icon: '👥',
    },
    // Aquí agregaremos más páginas después:
    // { name: 'Vehículos', path: '/vehiculos', icon: '🚗' },
    // { name: 'Servicios', path: '/servicios', icon: '🔧' },
    // { name: 'Cotizaciones', path: '/cotizaciones', icon: '📋' },
    // { name: 'Recordatorios', path: '/recordatorios', icon: '⏰' },
  ]

  // Función para saber si un link está activo
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ===== HEADER (barra superior) ===== */}
      <nav className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo + botón menú móvil */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <Link to="/" className="flex items-center gap-2">
                <span className="text-xl font-bold text-gray-900">AutoAssist</span>
              </Link>
            </div>

            {/* Nombre del taller + botón de usuario */}
            <div className="flex items-center gap-4">
              <span className="hidden sm:block text-sm text-gray-500">
                {workshop?.name}
              </span>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </nav>

      {/* ===== SIDEBAR (menú lateral) ===== */}
      {/* Overlay oscuro en móvil cuando el menú está abierto */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-20
          transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Menú
          </p>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-colors duration-150
                  ${isActive(item.path)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* ===== CONTENIDO PRINCIPAL ===== */}
      {/* Outlet renderiza la página según la ruta actual */}
      <main className="lg:ml-64 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Pasamos el workshop a las páginas hijas via Outlet context */}
          <Outlet context={{ workshop }} />
        </div>
      </main>
    </div>
  )
}   