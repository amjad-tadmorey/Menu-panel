/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { formateDate } from "../../helpers/utilHelpers";
import NoData from "../NoData";
import LogoutButton from "../../components/LogoutButton";
import StatusDropdown from "../StatusDropdown";
import OrderDetails from "../OrderDetails";
const PAGE_SIZE = 7;

export default function OrdersTable({ orders, label }) {
    const [openDropdown, setOpenDropdown] = useState(null);
    const [sortBy, setSortBy] = useState({ key: "id", asc: true });
    const [page, setPage] = useState(1);
    const [TablefilteredOrders, setTableFilteredOrders] = useState([]);
    const [search, setSearch] = useState("");

    const toggleDropdown = (id) => {
        setOpenDropdown((prev) => (prev === id ? null : id));
    };

    function toggleSort(key) {
        setPage(1);
        setSortBy((s) => (s.key === key ? { key, asc: !s.asc } : { key, asc: true }));
    }


    useEffect(() => {
        if (!orders) {
            setTableFilteredOrders([]);
            return;
        }

        const lowerSearch = search.toLowerCase();

        setTableFilteredOrders(
            orders
                .filter((o) => {
                    return (
                        o.order_number?.toString().includes(lowerSearch) ||
                        o.table?.table_number?.toString().includes(lowerSearch) ||
                        o.status?.toLowerCase().includes(lowerSearch) || // ✅ status search
                        o.order_items?.some((item) =>
                            item.menu?.name?.toLowerCase().includes(lowerSearch)
                        )
                    );
                })
        );
    }, [orders, search]);

    const pages = Math.max(1, Math.ceil(TablefilteredOrders.length / PAGE_SIZE));
    const visible = TablefilteredOrders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <div className="py-8 px-6 bg-gradient-to-br from-gray-50 to-white">

            <div className="max-w-6xl mx-auto">
                <div className="mb-6 flex items-center justify-between gap-4">
                    {
                        label && <div className="flex items-center gap-4">
                            <LogoutButton />
                            <h1 className="text-2xl font-semibold text-gray-900">{label}</h1>
                        </div>
                    }

                    <div className="flex items-center gap-3 ml-auto">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search orders..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-10 w-72 pl-4 pr-10 rounded-lg border border-gray-200 bg-white text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">⌕</div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => { setSearch(""); }}
                                className="h-10 px-3 rounded-md text-sm bg-white border border-gray-200 shadow-sm hover:shadow-md"
                            >Reset</button>

                            <div className="text-sm text-gray-600">Showing <span className="font-medium text-gray-900">{TablefilteredOrders.length}</span></div>
                        </div>
                    </div>
                </div>

                {/* container with glass card */}
                <div style={{ height: "calc(100vh - 200px)" }} className="rounded-2xl bg-white/60 backdrop-blur-md border border-gray-100 shadow-lg overflow-hidden ">
                    {/* sticky header for wide screens */}
                    <div className="hidden md:block sticky top-0 bg-white/60 backdrop-blur-md z-10">
                        <div className="grid grid-cols-12 gap-4 px-6 py-3 items-center">
                            <div className="col-span-1 text-xs font-semibold text-gray-600 cursor-pointer" onClick={() => toggleSort("id")}># {sortBy.key === "id" && (sortBy.asc ? "▲" : "▼")}</div>
                            <div className="col-span-3 text-xs font-semibold text-gray-600 cursor-pointer" onClick={() => toggleSort("created_at")}>Created At {sortBy.key === "created_at" && (sortBy.asc ? "▲" : "▼")}</div>
                            <div className="col-span-2 text-xs font-semibold text-gray-600">Table Number</div>
                            <div className="col-span-2 text-xs font-semibold text-gray-600 cursor-pointer" onClick={() => toggleSort("total")}>Total {sortBy.key === "total" && (sortBy.asc ? "▲" : "▼")}</div>
                            <div className="col-span-4 text-xs font-semibold text-gray-600 cursor-pointer" onClick={() => toggleSort("status")}>Status {sortBy.key === "status" && (sortBy.asc ? "▲" : "▼")}</div>
                        </div>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {/* rows: on md+ show grid rows, on mobile show stacked cards */}

                        {visible.map((row) => (
                            <div key={row.id} className={`group px-4 py-4 md:px-6 md:py-3 hover:bg-white/40 transition-colors`}>
                                <div className="md:grid md:grid-cols-12 md:gap-4 items-center">
                                    <div className="md:col-span-1 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-white shadow flex items-center justify-center text-sm font-semibold text-gray-800">#{row.order_number}</div>

                                    </div>

                                    <div className="md:col-span-3 mt-3 md:mt-0">
                                        <div className="mt-1 text-xs text-gray-500 hidden md:block">• {formateDate(row.created_at)}</div>
                                    </div>

                                    <div className="md:col-span-2 flex flex-col items-start mt-3 md:mt-0">
                                        <div className="text-gray-700 text-xl font-semibold">{row.table.table_number}</div>
                                        <img src={row.table.qr_image} alt="" className="w-12 h-12" />
                                    </div>
                                    <div className="md:col-span-2 mt-3 md:mt-0 text-sm font-semibold text-gray-900">EGP {row.total_price}</div>

                                    <div className="md:col-span-4 mt-4 md:mt-0 flex md:justify-end md:items-center">
                                        <div className="flex items-center gap-2">
                                            <OrderDetails
                                                order={row}
                                                isOpen={openDropdown === `orderDetails-${row.id}`}
                                                onToggle={() => toggleDropdown(`orderDetails-${row.id}`)}
                                                closeDropdown={() => setOpenDropdown(null)}

                                            />
                                            <StatusDropdown
                                                status={row.status}
                                                id={row.id}
                                                isOpen={openDropdown === `status-${row.id}`}
                                                onToggle={() => toggleDropdown(`status-${row.id}`)}
                                                closeDropdown={() => setOpenDropdown(null)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* empty state */}
                        {visible.length === 0 && (
                            <div className="px-6 py-8 text-center text-gray-500"><NoData /></div>
                        )}
                    </div>
                    {/* pagination */}
                    <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100">
                        <div className="text-sm text-gray-600">Page <span className="font-medium text-gray-900">{page}</span> of {pages}</div>

                        <div className="flex items-center gap-2">
                            <button
                                className="h-9 px-3 rounded-md bg-white border border-gray-200 shadow-sm disabled:opacity-50"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >Prev</button>

                            <div className="hidden sm:flex items-center gap-1">
                                {Array.from({ length: pages }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setPage(i + 1)}
                                        className={`h-9 w-9 rounded-md text-sm ${page === i + 1 ? "bg-blue-600 text-white shadow-md" : "bg-white border border-gray-200"}`}
                                    >{i + 1}</button>
                                ))}
                            </div>

                            <button
                                className="h-9 px-3 rounded-md bg-white border border-gray-200 shadow-sm disabled:opacity-50"
                                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                                disabled={page === pages}
                            >Next</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
