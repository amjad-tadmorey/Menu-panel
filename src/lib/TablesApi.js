import { restaurantId } from "../constants/remote"
import { supabase } from "./supabase"
import { endOfDay, startOfDay } from "date-fns"

export async function fetchTablesWithOrders() {
  const { data, error } = await supabase
    .from('tables')
    .select(`
      *,
      orders (
        *
      )
    `).eq('restaurant_id', restaurantId)

  if (error) throw error
  return data
}


export async function createTable() {
  const start = startOfDay(new Date()).toISOString()
  const end = endOfDay(new Date()).toISOString()
  console.log(restaurantId);

  // 1. Get latest table_number for today
  const { data: latestTable, error: fetchError } = await supabase
    .from('tables')
    .select('table_number')
    .eq('restaurant_id', restaurantId)
    .gte('created_at', start)
    .lte('created_at', end)
    .order('table_number', { ascending: false })
    .limit(1)
    .single()

  if (fetchError && fetchError.code !== 'PGRST116') {
    throw new Error('Error fetching latest table: ' + fetchError.message)
  }

  const nextTableNumber = (latestTable?.table_number || 0) + 1

  // 3. Create new table


  const { data: newTable, error: insertTableError } = await supabase
    .from('tables')
    .insert(
      {
        restaurant_id: restaurantId,
        table_number: nextTableNumber,
      },
    )
    .select()
  // .single()

  if (insertTableError) {
    throw new Error('Error inserting table: ' + insertTableError.message)
  }


  return newTable
}