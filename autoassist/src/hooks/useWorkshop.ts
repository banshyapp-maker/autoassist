import { useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { supabase } from '../lib/supabase'
import { Database } from '../lib/types'

type Workshop = Database['public']['Tables']['workshops']['Row']

export function useWorkshop() {
  const [workshop, setWorkshop] = useState<Workshop | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user, isLoaded } = useUser()

  useEffect(() => {
    if (!isLoaded) return
    if (!user) {
      setLoading(false)
      return
    }

    async function fetchOrCreateWorkshop() {
      try {
        const { data: existing, error: fetchError } = await (supabase as any)
          .from('workshops')
          .select('*')
          .eq('owner_id', user!.id)
          .maybeSingle()

        if (fetchError) throw fetchError

        if (existing) {
          setWorkshop(existing as Workshop)
        } else {
          const { data: newWorkshop, error: createError } = await (supabase as any)
            .from('workshops')
            .insert({
              owner_id: user!.id,
              name: `Taller de ${user!.firstName || 'Mi Taller'}`,
              email: user!.emailAddresses[0]?.emailAddress || null,
            })
            .select()
            .single()

          if (createError) throw createError
          setWorkshop(newWorkshop as Workshop)
        }
      } catch (err: any) {
        console.error('Error con workshop:', err)
        setError(err.message || 'Error al cargar el taller')
      } finally {
        setLoading(false)
      }
    }

    fetchOrCreateWorkshop()
  }, [user, isLoaded])

  return { workshop, loading, error }
}