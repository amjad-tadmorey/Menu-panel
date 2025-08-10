import Spinner from '../ui/Spinner'
import { useOrders } from '../hooks/remote/useOrders'
import { fetchOrdersWithFullDetails } from '../lib/ordersApi'
import OrdersTable from '../ui/tables/OrdersTable'

export default function CashierUI() {
    const { data: orders, isPending } = useOrders(fetchOrdersWithFullDetails, 'orders')

    if (isPending) return <Spinner />

    console.log(orders);

    return (
        <div className="overflow-x-auto">
            <OrdersTable orders={orders} label={'Cashier UI'} />
        </div>
    );
}
