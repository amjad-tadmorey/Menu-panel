/* eslint-disable react/prop-types */
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useEffect, useState } from 'react';

export default function Analytics({ orders, menuItems, tables }) {
    const [dailyOrders, setDailyOrders] = useState([]);
    const [monthlyRevenue, setMonthlyRevenue] = useState([]);
    const [topItems, setTopItems] = useState([]);
    const [statusData, setStatusData] = useState([]);

    console.log(orders);


    useEffect(() => {
        if (!orders || !menuItems) return;

        // 📅 Daily Orders
        const dailyMap = {};
        orders.forEach(order => {
            const day = new Date(order.created_at).toLocaleDateString();
            dailyMap[day] = (dailyMap[day] || 0) + 1;
        });
        setDailyOrders(Object.entries(dailyMap).map(([day, count]) => ({ day, count })));

        // 💰 Monthly Revenue
        const monthlyMap = {};
        orders.forEach(order => {
            const month = new Date(order.created_at).toLocaleString('default', { month: 'short', year: 'numeric' });
            monthlyMap[month] = (monthlyMap[month] || 0) + order.total_price;
        });
        setMonthlyRevenue(Object.entries(monthlyMap).map(([month, revenue]) => ({ month, revenue })));

        // 🏆 Top Selling Items
        const itemMap = {};
        orders.forEach(order => {
            order.order_items?.forEach(item => {
                const menuName = menuItems.find(m => m.id === item.menu.id)?.name || 'Unknown';
                itemMap[menuName] = (itemMap[menuName] || 0) + item.quantity;
            });
        });
        setTopItems(Object.entries(itemMap)
            .map(([name, quantity]) => ({ name, quantity }))
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5)
        );

        // 📊 Orders by Status
        const statusMap = {};
        orders.forEach(order => {
            statusMap[order.status] = (statusMap[order.status] || 0) + 1;
        });
        setStatusData(Object.entries(statusMap).map(([status, value]) => ({ status, value })));

    }, [orders, menuItems]);

    const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F'];

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Daily Orders */}
            <div className="p-4 bg-white rounded-2xl shadow">
                <h2 className="text-lg font-bold mb-4">Daily Orders</h2>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={dailyOrders}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Monthly Revenue */}
            <div className="p-4 bg-white rounded-2xl shadow">
                <h2 className="text-lg font-bold mb-4">Monthly Revenue</h2>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={monthlyRevenue}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="revenue" fill="#82ca9d" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Top Selling Items */}
            <div className="p-4 bg-white rounded-2xl shadow">
                <h2 className="text-lg font-bold mb-4">Top 5 Menu Items</h2>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={topItems} layout="vertical" margin={{ left: 2 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis
                            dataKey="name"
                            type="category"
                            width={150} // Increased width for longer names
                        />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="quantity" fill="#ffc658" radius={[0, 8, 8, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Orders by Status */}
            <div className="p-4 bg-white rounded-2xl shadow">
                <h2 className="text-lg font-bold mb-4">Orders by Status</h2>
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie
                            data={statusData}
                            dataKey="value"
                            nameKey="status"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            label
                        >
                            {statusData.map((entry, index) => (
                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
