import Spinner from '../ui/Spinner'
import { useOrders } from '../hooks/remote/useOrders'
import { fetchOrdersWithFullDetails } from '../lib/ordersApi'
import OrdersTable from '../ui/tables/OrdersTable'
import LogoutButton from './LogoutButton'

export default function WaiterUI() {
    const { data: orders, isPending } = useOrders(fetchOrdersWithFullDetails, 'orders')

    if (isPending) return <Spinner />

    return (
        <div className="w-full h-screen  mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-semibold mb-6 text-gray-800">Waiter UI</h1>
                <LogoutButton />
            </div>

            <div className="overflow-x-auto">
                <OrdersTable orders={orders.filter(o => o.status === 'ready' || o.status === 'billing-requested')} STATUS_OPTIONS={[
                    "ready",
                    "billing-requested",
                ]} />
            </div>
        </div>
    );
}
