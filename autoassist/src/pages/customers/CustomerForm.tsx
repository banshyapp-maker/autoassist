import { useState, useEffect } from 'react'
import { useNavigate, useParams, useOutletContext, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Database } from '../../lib/types'

type Customer = Database['public']['Tables']['customers']['Row']
type LayoutContext = {
  workshop: Database['public']['Tables']['workshops']['Row']
}

export default function CustomerForm() {
  const { workshop } = useOutletContext<LayoutContext>()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEditing = Boolean(id)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(isEditing)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isEditing && id) {
      loadCustomer(id)
    }
  }, [id])

  async function loadCustomer(customerId: string) {
    try {
      const { data, error } = await (supabase as any)
        .from('customers')
        .select('*')
        .eq('id', customerId)
        .single()

      if (error) throw error

      const customer = data as Customer

      if (customer.workshop_id !== workshop.id) {
        alert('No tienes permiso para editar este cliente')
        navigate('/clientes')
        return
      }

      setFormData({
        name: customer.name,
        email: customer.email || '',
        phone: customer.phone,
        address: customer.address || '',
        notes: customer.notes || '',
      })
    } catch (err: any) {
      console.error('Error cargando cliente:', err)
      alert('Error al cargar cliente: ' + err.message)
      navigate('/clientes')
    } finally {
      setLoadingData(false)
    }
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es obligatorio'
    } else if (formData.phone.trim().length < 7) {
      newErrors.phone = 'El teléfono debe tener al menos 7 dígitos'
    }

    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)

    try {
      const cleanData = {
        name: formData.name.trim(),
        email: formData.email.trim() || null,
        phone: formData.phone.trim(),
        address: formData.address.trim() || null,
        notes: formData.notes.trim() || null,
      }

      if (isEditing && id) {
        const { error } = await (supabase as any)
          .from('customers')
          .update(cleanData)
          .eq('id', id)
        if (error) throw error
      } else {
        const { error } = await (supabase as any)
          .from('customers')
          .insert({
            ...cleanData,
            workshop_id: workshop.id,
          })
        if (error) throw error
      }

      navigate('/clientes')
    } catch (err: any) {
      console.error('Error guardando cliente:', err)
      alert('Error al guardar: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  if (loadingData) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-3 text-gray-500 text-sm">Cargando datos del cliente...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <Link to="/clientes" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a clientes
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
        </h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre completo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: Juan Pérez"
              className={`w-full px-3 py-2.5 border rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors
                ${errors.name
                  ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                }`}
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Ej: 6000-0000"
              className={`w-full px-3 py-2.5 border rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors
                ${errors.phone
                  ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                }`}
            />
            {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-gray-400 text-xs">(opcional)</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ej: juan@email.com"
              className={`w-full px-3 py-2.5 border rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors
                ${errors.email
                  ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                }`}
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Dirección <span className="text-gray-400 text-xs">(opcional)</span>
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Ej: Calle 50, Ciudad de Panamá"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notas <span className="text-gray-400 text-xs">(opcional)</span>
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Ej: Cliente frecuente, prefiere citas los sábados..."
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Crear Cliente'}
            </button>
            <Link
              to="/clientes"
              className="text-gray-600 px-4 py-2.5 rounded-lg text-sm hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}