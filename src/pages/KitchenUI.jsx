import { useOrders } from "../hooks/remote/useOrders";
import { useUpdateOrder } from "../hooks/remote/useUpdateOrder";
import { fetchOrdersWithFullDetails } from "../lib/ordersApi";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";

export default function KitchenUI() {
    const { data: orders, isPending } = useOrders(fetchOrdersWithFullDetails, 'orders');
    const { mutate: updateOrder, isPending: isUpdating } = useUpdateOrder();


    if (isPending) return <Spinner />

    return (
        <div className="p-6 mx-auto flex-1">
            <h1 className="text-3xl font-semibold mb-6 text-gray-800">Kitchen UI</h1>

            {orders.length === 0 && (
                <div className="text-center text-gray-400">لا يوجد طلبات حالياً</div>
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
                                    <span className="text-sm text-gray-600">
                                        الكمية: {item.quantity}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <span>{order.notes}</span>

                        <Button
                            onClick={() => updateOrder({ orderId: order.id, updatedFields: { status: 'ready' } })}
                            disabled={isUpdating}
                            variant="success"
                        >
                            إنهاء التحضير
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
