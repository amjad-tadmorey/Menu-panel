
import Spinner from "../ui/Spinner";
import { fetchOrdersWithFullDetails } from "../lib/ordersApi";
import OrdersTable from "../ui/tables/OrdersTable";
import { useGet } from "../hooks/remote/useGet";
import { useEffect, useState } from "react";

export default function WaiterUI() {
    const { data: orders, isPending } = useGet(fetchOrdersWithFullDetails, "orders");
    const [filteredOrders, setFilteredOrders] = useState([]);

    useEffect(() => {
        if (!orders) {
            setFilteredOrders([]);
            return;
        }
        setFilteredOrders(
            orders.filter(
                (o) => o.status === "ready" || o.status === "billing-requested"
            )
        );
    }, [orders]);


    if (isPending) return <Spinner />;

    return (
        <div className="overflow-x-auto p-4">




            <OrdersTable orders={filteredOrders} label="Waiter UI" />
        </div>
    );
}
