import Spinner from '../ui/Spinner'
import { useOrders } from '../hooks/remote/useOrders'
import { fetchOrdersWithFullDetails } from '../lib/ordersApi'
import OrdersTable from '../ui/tables/OrdersTable'

export default function WaiterUI() {
    const { data: orders, isPending } = useOrders(fetchOrdersWithFullDetails, 'orders')

    if (isPending) return <Spinner />

    return (


        <div className="overflow-x-auto">
            <OrdersTable orders={orders.filter(o => o.status === 'ready' || o.status === 'billing-requested')} label={"Waiter UI"} />
        </div>
    );
}
