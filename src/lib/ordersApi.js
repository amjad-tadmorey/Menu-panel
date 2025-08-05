

// ─────────────────────────────────────────────

import { endOfDay, startOfDay } from "date-fns"
import { supabase } from "./supabase"

// ✅ 1. Fetch basic orders
export async function fetchOrders() {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: true })

    if (error) throw error
    return data
}


// ─────────────────────────────────────────────
// ✅ 2. Fetch orders with table number
export async function fetchOrdersWithTable() {
    const { data, error } = await supabase
        .from('orders')
        .select(`
      *,
      table:table_id (
        table_number
      )
    `)
        .order('created_at', { ascending: true })

    if (error) throw error
    return data
}


// ─────────────────────────────────────────────
// ✅ 3. Fetch orders with order items
export async function fetchOrdersWithItems() {
    const { data, error } = await supabase
        .from('orders')
        .select(`
      *,
      order_items (
        id,
        quantity,
        unit_price,
        menu_id,
        order_id
      )
    `)
        .order('created_at', { ascending: true })

    if (error) throw error
    return data
}


// ─────────────────────────────────────────────
// ✅ 4. Fetch orders with items AND table
export async function fetchOrdersWithItemsAndTable() {
    const { data, error } = await supabase
        .from('orders')
        .select(`
      *,
      table:table_id (
        table_number
      ),
      order_items (
        id,
        quantity,
        unit_price,
        menu_id,
        order_id
      )
    `)
        .order('created_at', { ascending: true })

    if (error) throw error
    return data
}


// ─────────────────────────────────────────────
// ✅ 5. Fetch orders with items, table, AND menu name
export async function fetchOrdersWithFullDetails() {
    const { data, error } = await supabase
        .from('orders')
        .select(`
      *,
      table:table_id (
        table_number
      ),
      order_items (
        id,
        quantity,
        unit_price,
        menu:menu_id (
          id,
          name,
          price
        )
      )
    `).eq('restaurant_id', 1)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('❌ Error fetching detailed orders:', error.message);
        throw error;
    }

    return data;
}




//

// ─────────────────────────────────────────────
// ✅ . Create Order

export async function createOrder({ restaurant_id = 1, table_id = 1 }) {
    const start = startOfDay(new Date()).toISOString()
    const end = endOfDay(new Date()).toISOString()

    // 1. Get latest order_number for today
    const { data: latestOrder, error: fetchError } = await supabase
        .from('orders')
        .select('order_number')
        .eq('restaurant_id', restaurant_id)
        .gte('created_at', start)
        .lte('created_at', end)
        .order('order_number', { ascending: false })
        .limit(1)
        .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
        throw new Error('Error fetching latest order: ' + fetchError.message)
    }

    const nextOrderNumber = (latestOrder?.order_number || 0) + 1

    // 2. Create new order
    const { data: newOrder, error: insertOrderError } = await supabase
        .from('orders')
        .insert([
            {
                restaurant_id,
                table_id,
                total_price: 300,
                order_number: nextOrderNumber,
            },
        ])
        .select()
        .single()

    if (insertOrderError) {
        throw new Error('Error inserting order: ' + insertOrderError.message)
    }

    // 3. Insert order_items
    const sampleItems = [
        {
            order_id: newOrder.id,
            menu_id: 1,
            quantity: 2,
            unit_price: 100,
        },
        {
            order_id: newOrder.id,
            menu_id: 2,
            quantity: 1,
            unit_price: 100,
        },
    ]

    const { error: insertItemsError } = await supabase
        .from('order_items')
        .insert(sampleItems)

    if (insertItemsError) {
        throw new Error('Error inserting order items: ' + insertItemsError.message)
    }

    return newOrder
}


//

// ─────────────────────────────────────────────
// ✅ . Update Order
export async function updateOrder(orderId, updatedFields) {
    const { data, error } = await supabase
        .from('orders')
        .update(updatedFields)
        .eq('id', orderId)
        .select();

    if (error) {
        console.error(error.message);
        throw new Error(error.message);
    }

    return data?.[0];
}
