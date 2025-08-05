import Spinner from '../ui/Spinner'
import { useOrders } from '../hooks/remote/useOrders'
import { fetchOrdersWithFullDetails } from '../lib/ordersApi'
import OrdersTable from '../ui/OrdersTable'

export default function CashierUI() {
    const { data: orders, isPending } = useOrders(fetchOrdersWithFullDetails, 'orders')

    if (isPending) return <Spinner />


    return (
        <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
            <h1 className="text-3xl font-semibold mb-6 text-gray-800">Cashier UI</h1>

            <div className="overflow-x-auto">
                <OrdersTable
                    orders={orders}
                    STATUS_OPTIONS={[
                        "new",
                        "in-kitchen",
                        "ready",
                        "delivered",
                        "billing-requested",
                        "paid",
                        "completed",
                    ]}
                />
            </div>
        </div>
    );
}
