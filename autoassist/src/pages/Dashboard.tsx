// Dashboard.tsx
// Página principal "Inicio"

import { Link, useOutletContext } from 'react-router-dom'
import { Database } from '../lib/types'

type LayoutContext = {
  workshop: Database['public']['Tables']['workshops']['Row']
}

export default function Dashboard() {
  const { workshop } = useOutletContext<LayoutContext>()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          ¡Bienvenido, {workshop.name}!
        </h1>
        <p className="text-gray-500 mt-1">
          Aquí verás el resumen de tu taller.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link
          to="/clientes"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
              👥
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Mis Clientes</h3>
              <p className="text-sm text-gray-500">Gestionar clientes</p>
            </div>
          </div>
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 opacity-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">
              🚗
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Vehículos</h3>
              <p className="text-sm text-gray-500">Próximamente</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 opacity-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-2xl">
              🔧
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Servicios</h3>
              <p className="text-sm text-gray-500">Próximamente</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 mb-2">
          ¿Qué hacer primero?
        </h3>
        <p className="text-blue-700 text-sm">
          Empieza agregando tus clientes. Luego podrás registrar sus vehículos
          y llevar el historial de servicios de cada uno.
        </p>
        <Link
          to="/clientes/nuevo"
          className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Agregar primer cliente
        </Link>
      </div>
    </div>
  )
} 