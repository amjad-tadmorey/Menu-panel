import Analytics from "../components/Analytics"
import { useOrders } from "../hooks/remote/useOrders"
import { useProducts } from "../hooks/remote/useProducts"
import { useTables } from "../hooks/remote/useTables"
import { fetchOrdersWithFullDetails } from "../lib/ordersApi"
import { fetchProductsWithItems } from "../lib/productsApi"
import { fetchTablesWithOrders } from "../lib/TablesApi"
import Spinner from "../ui/Spinner"

export default function Home() {
    const { data: orders, isPending: isPendingOrders } = useOrders(fetchOrdersWithFullDetails, "orders")
    const { data: tables, isPending: isPendingTables } = useTables(fetchTablesWithOrders, 'tables')
    const { data: menuItems, isPending: isPendingItems } = useProducts(fetchProductsWithItems, 'menu')

    if (isPendingOrders || isPendingTables || isPendingItems) return <Spinner />

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Restaurant Analytics</h1>
            <Analytics
                orders={orders}
                menuItems={menuItems}
                tables={tables}
            />
        </div>
    )
}
