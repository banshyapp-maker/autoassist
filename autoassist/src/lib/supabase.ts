import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Helper functions
export const getWorkshops = async () => {
  const { data, error } = await supabase
    .from('workshops')
    .select('*')
  
  if (error) throw error
  return data
}

export const getCustomers = async (workshopId: string) => {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('workshop_id', workshopId)
  
  if (error) throw error
  return data
}

export const getVehicles = async (customerId: string) => {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('customer_id', customerId)
  
  if (error) throw error
  return data
}

export const getServices = async (vehicleId: string) => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('vehicle_id', vehicleId)
    .order('date', { ascending: false })
  
  if (error) throw error
  return data
}
