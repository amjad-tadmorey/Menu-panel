import { restaurantId } from "../constants/remote"
import { supabase } from "./supabase"

export async function fetchProductsWithItems() {
    const { data, error } = await supabase
        .from('menu')
        .select(`
      *,
      order_items (
        id,
        quantity,
        unit_price,
        menu_id,
        order_id
      )
    `).eq('restaurant_id', restaurantId)
        .order('created_at', { ascending: true })

    if (error) throw error
    return data
}