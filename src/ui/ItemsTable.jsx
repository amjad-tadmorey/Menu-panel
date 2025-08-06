/* eslint-disable react/prop-types */

import { useState } from "react";
import { FOOD_CATEGORIES } from "../constants/local";

export default function ItemsTable({ items }) {
    console.log(items);

    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredItems = items.filter((item) => {
        const matchesCategory =
            selectedCategory === "all" || item.category === selectedCategory;
        const matchesSearch = item.name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
    });
    return <div className="overflow-auto rounded-lg shadow bg-white">

        <div className="flex flex-col sm:flex-row items-center gap-3 p-4">
            <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded w-full sm:w-64"
            />

            <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded w-full sm:w-48"
            >
                <option value="all">All Categories</option>
                {
                    FOOD_CATEGORIES.map(op => <option key={op} value={op}>{op}</option>)
                }
            </select>
        </div>
        <table className="min-w-full text-sm text-gray-700">
            <thead>
                <tr className="bg-gray-100 text-left">
                    <th className="p-3">Image</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Toatal Orders</th>
                    <th className="p-3">Total Orderd</th>
                    <th className="p-3">Price</th>
                </tr>
            </thead>
            <tbody>
                {filteredItems.map((item) => (
                    <tr key={item.id} className="border-t border-gray-300 hover:bg-gray-50">
                        <td className="p-3">
                            <img
                                src={item.image_url}
                                alt={item.name}
                                className="h-16 w-16 object-cover rounded-md"
                            />
                        </td>
                        <td className="p-3 font-medium">{item.name.trim()}</td>
                        <td className="p-3 capitalize">{item.category}</td>
                        <td className="p-3 capitalize">{item.order_items.length}</td>
                        <td className="p-3 capitalize">{item.order_items.reduce((total, item) => total + item.quantity, 0)}</td>
                        <td className="p-3 font-semibold text-blue-500">{item.price} &pound;</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
}
