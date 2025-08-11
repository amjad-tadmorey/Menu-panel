/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import Badge from "./Badge";

export default function OrderDetails({ order, isOpen, onToggle, closeDropdown }) {
    // const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [openUp, setOpenUp] = useState(false);

    useEffect(() => {
        if (isOpen && dropdownRef.current) {
            const rect = dropdownRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            setOpenUp(spaceBelow < 410);
        }
    }, [isOpen]);


    return (
        <div className="relative inline-block text-left " ref={dropdownRef}>
            <button
                onClick={onToggle}
                className="h-9 px-3 rounded-md bg-white border border-gray-200 shadow-sm text-sm hover:scale-105 transition"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                Details
            </button>

            <div
                className={`absolute z-40 max-h-[380px] overflow-y-scroll transition-all duration-300 transform bg-white rounded-2xl shadow-lg border border-gray-100 p-6 max-w-lg mx-auto hover:shadow-xl w-72
  ${isOpen
                        ? "opacity-100 scale-100 pointer-events-auto"
                        : "opacity-0 scale-95 pointer-events-none"}
  ${openUp ? "bottom-full mb-2 origin-bottom" : "top-full mt-2 origin-top"}
`}
            >
                {/* Glow Accent */}
                <div className="absolute -top-12 -right-12 h-48 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

                {/* Header */}
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Order #{order.order_number}
                    </h2>
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 inset-ring inset-ring-blue-700/10">
                        Table: {order.table?.table_number ?? 'Unknown'}
                    </span>
                </div>

                {/* Status */}
                <div className="mb-4">
                    <Badge status={order.status} />
                </div>

                {/* Order Items */}
                <ul className="divide-y divide-gray-100 mb-4">
                    {order.order_items.map((item) => (
                        <li
                            key={item.id}
                            className="py-3 flex justify-between items-center text-gray-700"
                        >
                            <div>
                                <p className="font-medium">{item.menu?.name ?? "—"}</p>
                                <p className="text-sm text-gray-500">
                                    Unit Price: {item.unit_price} EGP
                                </p>
                            </div>
                            <span className="text-lg font-semibold">
                                × {item.quantity}
                            </span>
                        </li>
                    ))}
                </ul>

                {/* Total Price */}
                <div className="flex justify-between items-center border-t pt-4">
                    <span className="text-lg font-semibold text-gray-800">
                        Total
                    </span>
                    <span className="text-xl font-bold text-indigo-600">
                        {order.total_price} EGP
                    </span>
                </div>

                {/* Notes */}
                {order.notes && order.notes.trim() !== "" && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 text-gray-600">
                        {order.notes}
                    </div>
                )}
            </div>
        </div>
    );
}
