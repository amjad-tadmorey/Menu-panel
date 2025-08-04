import { useGet } from '../hooks/remote/useGet'
import { useUpdate } from '../hooks/remote/useUpdate'

import Button from '../ui/Button'
import Spinner from '../ui/Spinner'
import { formateDate } from '../helpers/utilHelpers'

export default function OrdersManagement() {
    const { data: orders, isPending } = useGet("orders", {
        includeRelations: [
            { relation: 'items', foreignKey: 'id' },
            { relation: 'table', foreignKey: 'table_id' }
        ],
        orderBy: {column: 'created_at', ascending: false }
    });

    const { mutate: updateStatus } = useUpdate('orders', 'orders');

    if (isPending) return <Spinner />

    const toggleStatus = (order) => {
        const newStatus = order.status === 'pending' ? 'completed' : 'pending';
        updateStatus({  
            match: { id: order.id },
            updates: { status: newStatus }
        });
    };


    return (
        <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
            <h1 className="text-3xl font-semibold mb-6 text-gray-800">Orders Management</h1>

            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Ordered At</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Table ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                                    No orders found.
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formateDate(order.created_at)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.table.table_number}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span
                                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                                        <Button
                                            onClick={() => {
                                                console.log(order.id);
                                                toggleStatus(order)
                                            }}
                                        >
                                            Toggle Status
                                        </Button>
                                    </td>

                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
