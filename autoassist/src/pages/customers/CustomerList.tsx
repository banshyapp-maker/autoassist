import { useState, useEffect } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Database } from '../../lib/types'

type Customer = Database['public']['Tables']['customers']['Row']
type LayoutContext = {
  workshop: Database['public']['Tables']['workshops']['Row']
}

export default function CustomerList() {
  const { workshop } = useOutletContext<LayoutContext>()

  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    loadCustomers()
  }, [workshop.id])

  async function loadCustomers() {
    try {
      setLoading(true)
      const { data, error } = await (supabase as any)
        .from('customers')
        .select('*')
        .eq('workshop_id', workshop.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setCustomers((data as Customer[]) || [])
    } catch (err: any) {
      console.error('Error cargando clientes:', err)
      alert('Error al cargar clientes: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(customerId: string) {
    try {
      const { error } = await (supabase as any)
        .from('customers')
        .delete()
        .eq('id', customerId)

      if (error) throw error
      setCustomers(prev => prev.filter(c => c.id !== customerId))
      setDeleteConfirm(null)
    } catch (err: any) {
      console.error('Error eliminando cliente:', err)
      alert('Error al eliminar: ' + err.message)
    }
  }

  const filteredCustomers = customers.filter(customer => {
    const term = searchTerm.toLowerCase()
    return (
      customer.name.toLowerCase().includes(term) ||
      customer.phone.toLowerCase().includes(term) ||
      (customer.email && customer.email.toLowerCase().includes(term))
    )
  })

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('es-PA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Clientes</h1>
          <p className="text-gray-500 text-sm mt-1">
            {customers.length} cliente{customers.length !== 1 ? 's' : ''} registrado{customers.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          to="/clientes/nuevo"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Agregar Cliente
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por nombre, teléfono o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-3 text-gray-500 text-sm">Cargando clientes...</p>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          {searchTerm ? (
            <>
              <p className="text-gray-500">No se encontraron clientes con "{searchTerm}"</p>
              <button
                onClick={() => setSearchTerm('')}
                className="mt-2 text-blue-600 text-sm hover:underline"
              >
                Limpiar búsqueda
              </button>
            </>
          ) : (
            <>
              <div className="text-4xl mb-3">👥</div>
              <p className="text-gray-500 mb-4">Aún no tienes clientes registrados</p>
              <Link
                to="/clientes/nuevo"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                + Agregar tu primer cliente
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Nombre</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Teléfono</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Email</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Registrado</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <Link to={`/clientes/${customer.id}`} className="font-medium text-gray-900 hover:text-blue-600">
                        {customer.name}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{customer.phone}</td>
                    <td className="py-3 px-4 text-gray-600">{customer.email || '—'}</td>
                    <td className="py-3 px-4 text-gray-500 text-sm">{formatDate(customer.created_at)}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/clientes/${customer.id}/editar`} className="text-gray-400 hover:text-blue-600 p-1" title="Editar">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </Link>
                        {deleteConfirm === customer.id ? (
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleDelete(customer.id)} className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">
                              Sí, eliminar
                            </button>
                            <button onClick={() => setDeleteConfirm(null)} className="text-xs text-gray-500 px-2 py-1 rounded hover:bg-gray-100">
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteConfirm(customer.id)} className="text-gray-400 hover:text-red-600 p-1" title="Eliminar">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden divide-y divide-gray-100">
            {filteredCustomers.map((customer) => (
              <div key={customer.id} className="p-4">
                <div className="flex items-start justify-between">
                  <Link to={`/clientes/${customer.id}`} className="flex-1">
                    <p className="font-medium text-gray-900">{customer.name}</p>
                    <p className="text-sm text-gray-600 mt-1">{customer.phone}</p>
                    {customer.email && <p className="text-sm text-gray-500">{customer.email}</p>}
                  </Link>
                  <div className="flex items-center gap-2 ml-4">
                    <Link to={`/clientes/${customer.id}/editar`} className="text-gray-400 hover:text-blue-600 p-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </Link>
                    <button
                      onClick={() => deleteConfirm === customer.id ? handleDelete(customer.id) : setDeleteConfirm(customer.id)}
                      className={`p-1 ${deleteConfirm === customer.id ? 'text-red-600' : 'text-gray-400 hover:text-red-600'}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}