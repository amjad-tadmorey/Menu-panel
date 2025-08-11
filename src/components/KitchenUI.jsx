import { useState } from "react";
import { useGet } from "../hooks/remote/useGet";
import { fetchOrdersWithFullDetails } from "../lib/ordersApi";
import NoData from "../ui/NoData";
import Spinner from "../ui/Spinner";
import LogoutButton from "./LogoutButton";
import KitchenCard from "../ui/KitchenCard";

export default function KitchenUI() {
    const { data: orders, isPending } = useGet(fetchOrdersWithFullDetails, 'orders');

    const [query, setQuery] = useState("");

    if (isPending) return <Spinner />




    return (
        <div className="min-h-screen py-8 px-6 bg-gradient-to-br from-gray-50 to-white">
            <div className="mb-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <LogoutButton />
                    <h1 className="text-2xl font-semibold text-gray-900">Kitchen UI</h1>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <input
                            value={query}
                            onChange={(e) => { setQuery(e.target.value) }}
                            placeholder="Search by id, customer or status..."
                            className="h-10 w-72 pl-4 pr-10 rounded-lg border border-gray-200 bg-white text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">⌕</div>
                    </div>

                    <div className="flex items-center gap-2">


                        <div className="text-sm text-gray-600">Showing <span className="font-medium text-gray-900">{orders.length}</span></div>
                    </div>
                </div>
            </div>


            {orders.length === 0 && (
                <div className="text-center text-gray-400">
                    <NoData message="No Orders Yet" />
                </div>
            )}

            <div className="grid gap-6 overflow-scroll">
                {orders.filter(o => o.status === 'in-kitchen').map((order) => (
                    <KitchenCard key={order.id} order={order} />
                ))}
            </div>
        </div>
    );
}
