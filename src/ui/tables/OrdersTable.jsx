/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import NoData from '../NoData'
import Button from "../Button";
import { useUpdate } from "../../hooks/remote/generals/useUpdate";
import Badge from "../Badge";

const STATUS_FLOW = {
    new: "in-kitchen",
    "in-kitchen": "ready",
    ready: "delivered",
    delivered: "billing-requested",
    "billing-requested": "paid",
    paid: "completed",
};
const STATUS_LABELS = {
    new: "إرسال إلى المطبخ",
    "in-kitchen": "إنهاء التحضير",
    ready: "توصيل الطلب",
    delivered: "طلب الحساب",
    "billing-requested": "تحصيل الحساب",
    paid: "إغلاق",
};

export default function OrdersTable({ orders = [], STATUS_OPTIONS }) {

    const { mutate: updateStatus } = useUpdate('orders', 'orders');
    const { mutate: updateStatusTable } = useUpdate('tables', 'tables');
    const [selectedStatuses, setSelectedStatuses] = useState(STATUS_OPTIONS);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const allSelected = selectedStatuses.length === STATUS_OPTIONS.length;

    function toggleAll() {
        if (allSelected) {
            setSelectedStatuses([]);
        } else {
            setSelectedStatuses([...STATUS_OPTIONS]);
        }
    }

    function toggleStatusFilter(status) {
        setSelectedStatuses((prev) =>
            prev.includes(status)
                ? prev.filter((s) => s !== status)
                : [...prev, status]
        );
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredOrders = orders.filter((order) =>
        selectedStatuses?.includes(order.status)
    );



    function getNextStatus(current) {
        return STATUS_FLOW[current];
    }

    function getNextStatusLabel(current) {
        return STATUS_LABELS[current] ?? "";
    }

    function onToggleStatus(order) {
        const next = getNextStatus(order.status);
        if (!next) return;
        console.log(order);

        updateStatus({
            match: { id: order.id },
            updates: { status: next }
        });
        console.log(next);
        if (next === 'completed') {
            updateStatusTable({
                match: { id: order.table_id },
                updates: { is_active: false }
            })
        }

    }

    return (
        <table className="min-w-full min-h-96 border border-gray-200 divide-y divide-gray-200 relative">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Ordered At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Table ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Total Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide relative">
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center gap-1"
                        >
                            Status
                            <svg
                                className={`w-4 h-4 transition-transform ${showDropdown ? "rotate-180" : "rotate-0"
                                    }`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {showDropdown && (
                            <div
                                ref={dropdownRef}
                                className="absolute top-full left-0 mt-1 w-48 max-h-48 overflow-auto rounded border bg-white shadow-md z-50 p-2"
                            >
                                <label className="flex items-center space-x-2 text-sm cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={allSelected}
                                        onChange={toggleAll}
                                        className="accent-blue-500"
                                    />
                                    <span>All</span>
                                </label>
                                {STATUS_OPTIONS.map((status) => (
                                    <label key={status} className="flex items-center space-x-2 text-sm cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={selectedStatuses.includes(status)}
                                            onChange={() => toggleStatusFilter(status)}
                                            className="accent-blue-500"
                                        />
                                        <span>{status}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.length === 0 ? (
                    <tr>
                        <td colSpan="6" className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                            <NoData />
                        </td>
                    </tr>
                ) : (
                    filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {new Date(order.created_at).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.order_number}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {order.table?.table_number ?? "—"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.total_price} EGP</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <Badge status={order.status}/>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                                {/* {order.status !== 'in-kitchen' && order.status !== 'ready' && getNextStatus(order.status) && (
                                    <Button size="sm" onClick={() => onToggleStatus(order)}>
                                        {getNextStatusLabel(order.status)}
                                    </Button>
                                )} */}
                                {getNextStatus(order.status) && (
                                    <Button size="sm" onClick={() => onToggleStatus(order)}>
                                        {getNextStatusLabel(order.status)}
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );
}
