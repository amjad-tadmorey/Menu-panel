import { endOfDay, startOfDay } from "date-fns"
import { supabase } from "./supabase"
import { restaurantId } from "../constants/remote"


// ✅ 1. Fetch basic orders
export async function fetchOrders() {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('restaurant_id', restaurantId)
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
    `).eq('restaurant_id', restaurantId)
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
    `).eq('restaurant_id', restaurantId)
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
    `).eq('restaurant_id', restaurantId)
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
        *
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
    `).eq('restaurant_id', restaurantId)
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

export async function createOrder({ restaurant_id = 1, table_id = 1, items = [], notes }) {
    if (!Array.isArray(items) || items.length === 0) {
        throw new Error('You must provide at least one order item.')
    }

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

    // 2. Calculate total_price
    const total_price = items.reduce((sum, item) => {
        return sum + item.unit_price * item.quantity
    }, 0)

    // 3. Create new order
    const { data: newOrder, error: insertOrderError } = await supabase
        .from('orders')
        .insert([
            {
                restaurant_id,
                table_id,
                total_price,
                notes,
                order_number: nextOrderNumber,
            },
        ])
        .select()
        .single()

    if (insertOrderError) {
        throw new Error('Error inserting order: ' + insertOrderError.message)
    }

    // 4. Insert order_items with the new order_id
    const orderItems = items.map(item => ({
        order_id: newOrder.id,
        menu_id: item.menu_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
    }))

    const { error: insertItemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

    if (insertItemsError) {
        throw new Error('Error inserting order items: ' + insertItemsError.message)
    }

    return newOrder
}


//

// ─────────────────────────────────────────────
// ✅ . Update Order
export async function updateOrder(orderId, updatedFields) {
    console.log(orderId, updatedFields);

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
