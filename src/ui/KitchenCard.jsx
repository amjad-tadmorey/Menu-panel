import { useUpdate } from "../hooks/main/useUpdate";
import Button from "./Button";

/* eslint-disable react/prop-types */
export default function KitchenCard({ order }) {
    const { mutate: updateOrder, isPending: isUpdating } = useUpdate('orders', 'orders');
    const handleUpdate = (id) => {
        updateOrder({
            match: { id },
            updates: { status: 'ready' }
        })
    }

    return <div className="relative p-6 rounded-3xl overflow-hidden bg-white/60 backdrop-blur-2xl border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_8px_50px_rgb(0,0,0,0.15)] transition-all duration-300">
        {/* Background Accent Glow */}
        <div className="absolute -top-14 -right-14 w-56 h-56 bg-gradient-to-br from-gray-200/40 to-gray-400/20 rounded-full blur-3xl opacity-50"></div>

        {/* Header */}
        <div className="flex justify-between items-center mb-6 relative z-10">
            <h2 className="text-2xl font-semibold text-gray-500 tracking-tight">
                Order #{order.order_number}
            </h2>
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 inset-ring inset-ring-blue-700/10">
                Table: {order.table?.table_number ?? 'Unknown'}
            </span>
        </div>

        {/* Order Items */}
        <ul className="relative z-10 space-y-3">
            {order.order_items.map((item) => (
                <li
                    key={item.id}
                    className="flex justify-between items-center bg-white/50 backdrop-blur-md rounded-xl px-4 py-3 border border-gray-100 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all"
                >
                    <span className="text-gray-800 font-medium">{item.menu?.name ?? '—'}</span>
                    <span className="text-sm font-bold bg-gray-700 text-white px-3 py-1 rounded-lg">
                        × {item.quantity}
                    </span>
                </li>
            ))}
        </ul>

        {/* Notes */}
        {order.notes && (
            <div className="mt-6 relative z-10 bg-yellow-50/80 backdrop-blur-md text-yellow-900 text-sm p-4 rounded-xl border border-yellow-200 shadow-inner">
                {order.notes}
            </div>
        )}

        {/* Action Button */}
        <Button
            onClick={() => handleUpdate(order.id)}
            disabled={isUpdating}
            variant="success"
            className="mt-8 w-full rounded-xl py-3 text-base font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
            Mark as Prepared
        </Button>
    </div>



}
