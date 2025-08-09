import { useOrders } from "../hooks/remote/useOrders";
import { useUpdateOrder } from "../hooks/remote/useUpdateOrder";
import { fetchOrdersWithFullDetails } from "../lib/ordersApi";
import Button from "../ui/Button";
import NoData from "../ui/NoData";
import Spinner from "../ui/Spinner";

export default function KitchenUI() {
    const { data: orders, isPending } = useOrders(fetchOrdersWithFullDetails, 'orders');
    const { mutate: updateOrder, isPending: isUpdating } = useUpdateOrder();


    if (isPending) return <Spinner />

    return (
        <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
            <h1 className="text-3xl font-semibold mb-6 text-gray-800">Kitchen UI</h1>

            {orders.length === 0 && (
                <div className="text-center text-gray-400">
                    <NoData message="No Orders Yet" />
                </div>
            )}

            <div className="grid gap-6">
                {orders.filter(o => o.status === 'in-kitchen').map((order) => (
                    <div
                        key={order.id}
                        className="bg-white shadow-md rounded-xl p-5 border border-gray-200"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">
                                طلب رقم #{order.order_number}
                            </h2>
                            <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                                الطاولة: {order.table?.table_number ?? 'غير معروف'}
                            </span>
                        </div>

                        <ul className="divide-y divide-gray-100">
                            {order.order_items.map((item) => (
                                <li key={item.id} className="py-2 flex justify-between items-center">
                                    <span className="font-medium">
                                        {item.menu?.name ?? '—'}
                                    </span>
                                    <span className="text-xl text-gray-600">
                                        الكمية: <strong>{item.quantity}</strong>
                                    </span>
                                </li>
                            ))}
                        </ul>
                        {order.notes && <div className="w-full mt-1 p-3 rounded-lg border border-gray-300 my-4">{order.notes}</div>}

                        <Button
                            onClick={() => updateOrder({ orderId: order.id, updatedFields: { status: 'ready' } })}
                            disabled={isUpdating}
                            variant="success"
                            className="mt-4"
                        >
                            إنهاء التحضير
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
