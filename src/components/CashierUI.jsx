import Spinner from '../ui/Spinner'
import { fetchOrdersWithFullDetails } from '../lib/ordersApi'
import OrdersTable from '../ui/tables/OrdersTable'
import { useGet } from '../hooks/remote/useGet'

export default function CashierUI() {
    const { data: orders, isPending } = useGet(fetchOrdersWithFullDetails, 'orders')
    console.log(orders);

    if (isPending) return <Spinner />

    return (
        <div className="overflow-x-auto">
            <OrdersTable orders={orders} label={'Cashier UI'} />
        </div>
    );
}
