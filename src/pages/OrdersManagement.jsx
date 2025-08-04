import { useGet } from '../hooks/remote/useGet'
import { useUpdate } from '../hooks/remote/useUpdate'
import { useDelete } from '../hooks/remote/useDelete'

import Button from '../ui/Button'
import Spinner from '../ui/Spinner'

export default function OrdersManagement() {
    const { data: orders, isPending } = useGet("orders", {
        joins: [
            { table: "tables", select: "table_number" }
        ]
    })

    const updateMutation = useUpdate('orders');
    const deleteMutation = useDelete('orders');

    if (isPending) return <Spinner />
    console.log(orders);

    const toggleStatus = (order) => {
        const newStatus = order.status === 'pending' ? 'completed' : 'pending';
        updateMutation.mutate({ id: order.id, status: newStatus });
    };

    const deleteOrder = (id) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
            <h1 className="text-3xl font-semibold mb-6 text-gray-800">Orders Management</h1>

            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
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
                            orders.map(order => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.table_id}</td>
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
                                            onClick={() => toggleStatus(order)}
                                            disabled={updateMutation.isLoading}
                                        >
                                            Toggle Status
                                        </Button>
                                        <Button
                                            variant='danger'
                                            onClick={() => deleteOrder(order.id)}
                                            disabled={deleteMutation.isLoading}
                                        >
                                            Delete
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
