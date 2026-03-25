import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate, useOutletContext } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Database } from '../../lib/types'

type Customer = Database['public']['Tables']['customers']['Row']
type LayoutContext = {
  workshop: Database['public']['Tables']['workshops']['Row']
}

export default function CustomerDetail() {
  const { workshop } = useOutletContext<LayoutContext>()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) loadCustomer(id)
  }, [id])

  async function loadCustomer(customerId: string) {
    try {
      const { data, error } = await (supabase as any)
        .from('customers')
        .select('*')
        .eq('id', customerId)
        .single()

      if (error) throw error

      const customerData = data as Customer

      if (customerData.workshop_id !== workshop.id) {
        navigate('/clientes')
        return
      }

      setCustomer(customerData)
    } catch (err: any) {
      console.error('Error cargando cliente:', err)
      navigate('/clientes')
    } finally {
      setLoading(false)
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('es-PA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-3 text-gray-500 text-sm">Cargando cliente...</p>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Cliente no encontrado</p>
        <Link to="/clientes" className="text-blue-600 text-sm hover:underline mt-2 inline-block">
          Volver a clientes
        </Link>
      </div>
    )
  }

  return (
    <div>
      <Link to="/clientes" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-4">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver a clientes
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-xl font-bold text-blue-700">
              {customer.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
            <p className="text-sm text-gray-500">
              Cliente desde {formatDate(customer.created_at)}
            </p>
          </div>
        </div>
        <Link
          to={`/clientes/${customer.id}/editar`}
          className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Editar
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Información de contacto</h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase">Teléfono</dt>
              <dd className="mt-1 text-gray-900">{customer.phone}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase">Email</dt>
              <dd className="mt-1 text-gray-900">{customer.email || 'No registrado'}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase">Dirección</dt>
              <dd className="mt-1 text-gray-900">{customer.address || 'No registrada'}</dd>
            </div>
            {customer.notes && (
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase">Notas</dt>
                <dd className="mt-1 text-gray-900 whitespace-pre-line">{customer.notes}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Vehículos</h2>
          <div className="text-center py-8">
            <div className="text-3xl mb-2">🚗</div>
            <p className="text-gray-500 text-sm">
              Los vehículos de este cliente aparecerán aquí.
            </p>
            <p className="text-gray-400 text-xs mt-1">
              (Lo construiremos en el siguiente paso)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}