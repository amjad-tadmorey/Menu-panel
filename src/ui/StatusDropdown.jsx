/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { useUpdate } from '../hooks/main/useUpdate'
import Badge from "./Badge";
import { STATUS_COLORS, STATUS_OPTIONS } from "../constants/local";
import { useQueryClient } from "@tanstack/react-query";



export default function StatusDropdown({ status, id, table_id, isOpen, onToggle, closeDropdown }) {
    const queryClient = useQueryClient()
    const { mutate: updateStatus } = useUpdate('orders', 'orders')
    const { mutate: updateTable } = useUpdate('tables', 'tables')
    const [selectedStatus, setSelectedStatus] = useState(null);
    const dropdownRef = useRef(null);
    const [openUp, setOpenUp] = useState(false);

    useEffect(() => {
        if (isOpen && dropdownRef.current) {
            const rect = dropdownRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            setOpenUp(spaceBelow < 410);
        }
    }, [isOpen]);


    function handleUpdateStatus(status) {
        updateStatus({
            match: { id: table_id },
            updates: { status }
        }, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['orders'] })
                if (status === 'completed') {
                    updateTable({
                        match: { id: table_id },
                        updates: { is_active: false }
                    })
                }
            }
        })
    }

    return (
        <div className="relative inline-block w-40 text-left " ref={dropdownRef}>
            <button
                onClick={onToggle}
                className="bg-gradient-to-l from-blue-100 to-indigo-50 text-white shadow-md hover:brightness-105 flex items-center justify-between w-full px-6 py-3 rounded-2xl bg-white/70 backdrop-blur-md border border-gray-200 font-semibold text-base hover:bg-white/90 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                {selectedStatus ? (
                    <span className={STATUS_COLORS[selectedStatus]}>{selectedStatus}</span>
                ) : (
                    <span> <Badge status={status} /> </span>
                )}
                <svg
                    className={`w-6 h-6 text-gray-600 transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                        }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <ul
                className={`absolute z-50 w-full h-60 overflow-y-scroll rounded-2xl bg-white/70 backdrop-blur-md border border-gray-200 shadow-2xl py-2 text-gray-800 font-medium text-base transition-all duration-300 transform
  ${isOpen
                        ? "opacity-100 scale-100 pointer-events-auto"
                        : "opacity-0 scale-95 pointer-events-none"}
  ${openUp ? "bottom-full mb-2 origin-bottom" : "top-full mt-2 origin-top"}
`}
            >
                {STATUS_OPTIONS.map((status) => (
                    <li
                        key={status}
                        onClick={() => {
                            setSelectedStatus(status);
                            closeDropdown();
                            handleUpdateStatus(status)
                        }}
                        className={`cursor-pointer select-none px-6 py-2 rounded-xl transition-colors duration-250 hover:bg-blue-400 text-white
       
            `}
                    >
                        <span className={STATUS_COLORS[status]}>{status}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
