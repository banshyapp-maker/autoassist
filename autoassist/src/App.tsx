// App.tsx - ACTUALIZADO con login rediseñado

import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import CustomerList from './pages/customers/CustomerList'
import CustomerForm from './pages/customers/CustomerForm'
import CustomerDetail from './pages/customers/CustomerDetail'

function App() {
  return (
    <BrowserRouter>
      {/* USUARIO NO LOGUEADO - Login con diseño premium */}
      <SignedOut>
        <div className="min-h-screen bg-gray-950 flex">
          {/* Lado izquierdo - Branding */}
          <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
            {/* Fondo con gradiente */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950"></div>
            {/* Patrón decorativo */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-20 left-20 w-72 h-72 border border-gray-400 rounded-full"></div>
              <div className="absolute top-32 left-32 w-72 h-72 border border-gray-400 rounded-full"></div>
              <div className="absolute bottom-20 right-20 w-96 h-96 border border-gray-400 rounded-full"></div>
              <div className="absolute bottom-32 right-32 w-96 h-96 border border-gray-400 rounded-full"></div>
            </div>
            {/* Líneas diagonales decorativas */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-1/4 w-px h-full bg-white transform rotate-12"></div>
              <div className="absolute top-0 left-2/4 w-px h-full bg-white transform -rotate-12"></div>
              <div className="absolute top-0 left-3/4 w-px h-full bg-white transform rotate-6"></div>
            </div>

            {/* Contenido del lado izquierdo */}
            <div className="relative z-10 flex flex-col justify-between p-12 w-full">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="AutoAssist" className="h-12 w-12 rounded-xl" />
                <span className="text-2xl font-bold text-white">AutoAssist</span>
              </div>

              <div className="space-y-6">
                <h1 className="text-5xl font-bold text-white leading-tight">
                  La gestión de<br />
                  tu taller,<br />
                  <span className="text-blue-400">simplificada.</span>
                </h1>
                <p className="text-lg text-gray-400 max-w-md">
                  Clientes, vehículos, cotizaciones con IA y recordatorios automáticos.
                  Todo en un solo lugar.
                </p>
                {/* Feature pills */}
                <div className="flex flex-wrap gap-3 pt-4">
                  <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-gray-300 border border-white/10">
                    Cotizaciones con IA
                  </span>
                  <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-gray-300 border border-white/10">
                    Recordatorios automáticos
                  </span>
                  <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-gray-300 border border-white/10">
                    Historial completo
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-600">
                Hecho en Panamá con Banshy
              </p>
            </div>
          </div>

          {/* Lado derecho - Formulario de login */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
            <div className="w-full max-w-md space-y-8">
              {/* Logo para móvil */}
              <div className="lg:hidden flex flex-col items-center gap-4 mb-8">
                <img src="/logo.png" alt="AutoAssist" className="h-16 w-16 rounded-2xl" />
                <h1 className="text-3xl font-bold text-white">AutoAssist</h1>
              </div>

              {/* Card de login */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white">Bienvenido</h2>
                  <p className="text-gray-400 mt-2">
                    Inicia sesión para acceder a tu taller
                  </p>
                </div>

                <div className="space-y-4">
                  <SignInButton mode="modal">
                    <button className="w-full bg-blue-600 text-white px-6 py-3.5 rounded-xl font-medium hover:bg-blue-500 transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]">
                      Iniciar Sesión
                    </button>
                  </SignInButton>

                  <SignInButton mode="modal">
                    <button className="w-full bg-transparent text-gray-300 px-6 py-3.5 rounded-xl font-medium border border-gray-700 hover:border-gray-500 hover:text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                      Crear Cuenta
                    </button>
                  </SignInButton>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-800">
                  <p className="text-xs text-gray-500 text-center">
                    Acceso seguro con Google o Email
                  </p>
                </div>
              </div>

              {/* Info extra */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4 text-center">
                  <p className="text-2xl mb-1">🔧</p>
                  <p className="text-xs text-gray-500">Servicios</p>
                </div>
                <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4 text-center">
                  <p className="text-2xl mb-1">🤖</p>
                  <p className="text-xs text-gray-500">IA integrada</p>
                </div>
                <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4 text-center">
                  <p className="text-2xl mb-1">📊</p>
                  <p className="text-xs text-gray-500">Métricas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SignedOut>

      {/* USUARIO LOGUEADO */}
      <SignedIn>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clientes" element={<CustomerList />} />
            <Route path="/clientes/nuevo" element={<CustomerForm />} />
            <Route path="/clientes/:id" element={<CustomerDetail />} />
            <Route path="/clientes/:id/editar" element={<CustomerForm />} />
          </Route>
        </Routes>
      </SignedIn>
    </BrowserRouter>
  )
}

export default App