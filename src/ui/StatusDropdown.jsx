/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { useUpdate } from '../hooks/remote/generals/useUpdate'
import Badge from "./Badge";
import { STATUS_COLORS, STATUS_OPTIONS } from "../constants/local";



export default function StatusDropdown({ status, id }) {
    const { mutate: updateStatus } = useUpdate('orders', 'orders')
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function handleUpdateStatus(status) {

        updateStatus({
            match: { id },
            updates: { status }
        })
    }


    return (
        <div className="relative inline-block w-52 text-left " ref={dropdownRef}>
            <button
                onClick={() => setOpen((o) => !o)}
                className="bg-gradient-to-l from-blue-100 to-indigo-50 text-white shadow-md hover:brightness-105 flex items-center justify-between w-full px-6 py-3 rounded-2xl bg-white/70 backdrop-blur-md border border-gray-200 font-semibold text-base hover:bg-white/90 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-haspopup="true"
                aria-expanded={open}
            >
                {selectedStatus ? (
                    <span className={STATUS_COLORS[selectedStatus]}>{selectedStatus}</span>
                ) : (
                    <span> <Badge status={status} /> </span>
                )}
                <svg
                    className={`w-6 h-6 text-gray-600 transform transition-transform duration-300 ${open ? "rotate-180" : ""
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
                className={`absolute z-40 mt-2 w-full rounded-2xl bg-white/70 backdrop-blur-md border border-gray-200 shadow-2xl py-2 text-gray-800 font-medium text-base transition-all duration-300 origin-top transform ${open
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : "opacity-0 scale-95 pointer-events-none"
                    }`}
            >
                {STATUS_OPTIONS.map((status) => (
                    <li
                        key={status}
                        onClick={() => {
                            setSelectedStatus(status);
                            setOpen(false);
                            handleUpdateStatus(status)
                        }}
                        className={`cursor-pointer select-none px-6 py-3 rounded-xl transition-colors duration-250 hover:bg-blue-400 text-white
       
            `}
                    >
                        <span className={STATUS_COLORS[status]}>{status}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
