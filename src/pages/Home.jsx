import Analytics from "../components/Analytics"
import { useGet } from "../hooks/remote/useGet"
import { fetchOrdersWithFullDetails } from "../lib/ordersApi"
import { fetchProducts } from "../lib/productsApi"
import { fetchTablesWithOrders } from "../lib/TablesApi"
import Spinner from "../ui/Spinner"

export default function Home() {
    const { data: orders, isPending: isPendingOrders } = useGet(fetchOrdersWithFullDetails, "orders")
    const { data: tables, isPending: isPendingTables } = useGet(fetchTablesWithOrders, 'tables')
    const { data: menuItems, isPending: isPendingItems } = useGet(fetchProducts, 'menu')

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
