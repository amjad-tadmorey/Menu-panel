import { useGet } from "../hooks/remote/useGet"
import { fetchOrdersWithFullDetails } from "../lib/ordersApi"
import Spinner from "../ui/Spinner"
import OrdersTable from "../ui/tables/OrdersTable"

export default function Orders() {
  const { data: orders, isPending } = useGet(fetchOrdersWithFullDetails, 'orders')

  if (isPending) return <Spinner />
  return (
    <div className="overflow-x-auto">
      <OrdersTable orders={orders} />
    </div>
  )
}



// /* eslint-disable react/prop-types */
// // OrdersPage.jsx
// import { useState, useMemo } from "react"
// import { fetchOrdersWithFullDetails } from "../lib/ordersApi"
// import * as XLSX from 'xlsx';
// import { saveAs } from 'file-saver';
// import { STATUS_OPTIONS } from "../constants/local";
// import Badge from "../ui/Badge";
// import Spinner from "../ui/Spinner";
// import Button from "../ui/Button";
// import NoData from "../ui/NoData";
// import { useGetTable } from "../hooks/main/useGetTable";
// import { useGet } from "../hooks/remote/useGet";

// // ========== FiltersBar ==========
// function FiltersBar({
//   searchTerm,
//   setSearchTerm,
//   statusFilter,
//   setStatusFilter,
//   tableFilter,
//   setTableFilter,
//   sortField,
//   setSortField,
//   sortOrder,
//   setSortOrder,
//   dateRange,
//   setDateRange,
//   allTables,
// }) {
//   return (
//     <div className="flex flex-wrap items-center gap-4 bg-white p-6 rounded-lg shadow-md border border-gray-200">
//       <input
//         type="text"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         placeholder='Search'
//         className="border border-gray-300 p-2 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
//       />

//       <select
//         value={statusFilter}
//         onChange={(e) => setStatusFilter(e.target.value)}
//         className="border border-gray-300 p-2 rounded-md focus:outline-none"
//       >
//         {
//           STATUS_OPTIONS.map((op) => <option key={op} value={op}>{op}</option>)
//         }
//         <option value="all">All States</option>
//       </select>

//       <select
//         value={tableFilter}
//         onChange={(e) => setTableFilter(e.target.value)}
//         className="border border-gray-300 p-2 rounded-md focus:outline-none"
//       >
//         <option value="all">All Tables</option>
//         {allTables.map(({ table_number }) => (
//           <option key={table_number} value={table_number}>Table {table_number}</option>
//         ))}
//       </select>

//       <input
//         type="date"
//         value={dateRange.from}
//         onChange={(e) => setDateRange((prev) => ({ ...prev, from: e.target.value }))}
//         className="border border-gray-300 p-2 rounded-md"
//       />
//       <input
//         type="date"
//         value={dateRange.to}
//         onChange={(e) => setDateRange((prev) => ({ ...prev, to: e.target.value }))}
//         className="border border-gray-300 p-2 rounded-md"
//       />

//       <select
//         value={sortField}
//         onChange={(e) => setSortField(e.target.value)}
//         className="border border-gray-300 p-2 rounded-md"
//       >
//         <option value="created_at">By Date</option>
//         <option value="total_price">By Price</option>
//         <option value="order_number">By Order Number</option>
//       </select>

//       <select
//         value={sortOrder}
//         onChange={(e) => setSortOrder(e.target.value)}
//         className="border border-gray-300 p-2 rounded-md"
//       >
//         <option value="desc">desc</option>
//         <option value="asc">asc</option>
//       </select>

//       <Button
//         variant={'danger'}
//         onClick={() => {
//           setSearchTerm("")
//           setStatusFilter("all")
//           setTableFilter("all")
//           setSortField("created_at")
//           setSortOrder("desc")
//           setDateRange({ from: "", to: "" })
//         }}

//       >
//         Reset
//       </Button>


//     </div>
//   )
// }

// // ========== OrdersTable ==========
// function OrdersTable({ orders }) {
//   return (
//     <div className="overflow-auto rounded-lg shadow bg-white">
//       <table className="min-w-full text-sm text-gray-700">
//         <thead>
//           <tr className="bg-gray-50 text-gray-700">
//             <th className="p-3 text-left">Order No.</th>
//             <th className="p-3 text-left">Date</th>
//             <th className="p-3 text-left">Table No.</th>
//             <th className="p-3 text-left">Total Price</th>
//             <th className="p-3 text-left">Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {orders.length === 0 ? (
//             <tr>
//               <td colSpan={5} className="p-6 text-center text-gray-500">
//                 <NoData />
//               </td>
//             </tr>
//           ) : (
//             orders.map((order) => (
//               <tr key={order.id} className="border-t border-gray-400 hover:bg-gray-50">
//                 <td className="p-3 font-medium">#{order.order_number}</td>
//                 <td className="p-3">
//                   {new Date(order.created_at).toLocaleString()}
//                 </td>
//                 <td className="p-3">{order.table?.table_number || "-"}</td>
//                 <td className="p-3 font-bold text-emerald-500">
//                   {order.total_price} &pound;
//                 </td>
//                 <td className="p-3 capitalize">
//                   <Badge status={order.status} />
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   )
// }

// // ========== ExportButtons ==========
// function ExportButtons({ orders }) {
//   const handleExport = () => {
//     const simplifiedData = orders.map(order => {
//       const dateObj = new Date(order.created_at);

//       // نحول التاريخ إلى Excel Serial Number
//       const excelDate = (dateObj - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);

//       return {
//         "Order ID": order.id,
//         "Order Number": order.order_number,
//         "Date": excelDate,
//         "Table Number": order.table?.table_number ?? '',
//         "Status": order.status,
//         "Total Price": order.total_price,
//       };
//     });

//     const ws = XLSX.utils.json_to_sheet(simplifiedData);

//     // تطبيق تنسيق التاريخ على العمود
//     const dateColIndex = Object.keys(simplifiedData[0]).indexOf("Date");
//     const range = XLSX.utils.decode_range(ws['!ref']);

//     for (let row = range.s.r + 1; row <= range.e.r; row++) {
//       const cellRef = XLSX.utils.encode_cell({ r: row, c: dateColIndex });
//       if (ws[cellRef]) {
//         ws[cellRef].t = 'n'; // نوع Numeric
//         ws[cellRef].z = 'dd/mm/yyyy'; // تنسيق تاريخي
//       }
//     }

//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Orders");

//     const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
//     const blob = new Blob([wbout], { type: 'application/octet-stream' });
//     saveAs(blob, `orders_${new Date().toISOString().slice(0, 10)}.xlsx`);
//   };

//   return (
//     <Button
//       onClick={handleExport}
//       className="ml-auto block"
//       variant="success"
//     >
//       Export to Excel
//     </Button>
//   );
// }

// // ========== OrdersPage (main) ==========



// export default function Orders() {
//   const [searchTerm, setSearchTerm] = useState("")
//   const [statusFilter, setStatusFilter] = useState("all")
//   const [tableFilter, setTableFilter] = useState("all")
//   const [sortField, setSortField] = useState("created_at")
//   const [sortOrder, setSortOrder] = useState("desc")
//   const [dateRange, setDateRange] = useState({ from: "", to: "" })

//   const { data: orders, isPending: isPendingOrders } = useGet(fetchOrdersWithFullDetails, "orders")
//   const { data: allTables, isPending: isPendingTables } = useGetTable("tables", 'tables')

//   const filteredOrders = useMemo(() => {
//     if (!orders) return []

//     return orders
//       .filter((order) => {
//         const matchesSearch =
//           String(order.order_number).includes(searchTerm) ||
//           String(order.table?.table_number || "").includes(searchTerm) ||
//           order.order_items.some((item) =>
//             item.menu.name.toLowerCase().includes(searchTerm.toLowerCase())
//           )

//         const matchesStatus =
//           statusFilter === "all" || order.status === statusFilter

//         const matchesTable =
//           tableFilter === "all" || String(order.table?.table_number) === tableFilter

//         const createdDate = new Date(order.created_at)
//         const matchesDate =
//           (!dateRange.from || createdDate >= new Date(dateRange.from)) &&
//           (!dateRange.to || createdDate <= new Date(dateRange.to))

//         return matchesSearch && matchesStatus && matchesTable && matchesDate
//       })
//       .sort((a, b) => {
//         if (sortOrder === "asc") {
//           return a[sortField] > b[sortField] ? 1 : -1
//         } else {
//           return a[sortField] < b[sortField] ? 1 : -1
//         }
//       })
//   }, [orders, searchTerm, statusFilter, tableFilter, sortField, sortOrder, dateRange])
//   if (isPendingOrders || isPendingTables) return <Spinner />
//   return (
//     <div className="p-6 space-y-6 bg-gray-50 min-h-screen rounded-2xl shadow-xl">
//       <h1 className="text-3xl font-bold text-gray-800">Orders Managment</h1>
//       <h1 className="text-xl">{filteredOrders.length} results</h1>
//       <FiltersBar
//         searchTerm={searchTerm}
//         setSearchTerm={setSearchTerm}
//         statusFilter={statusFilter}
//         setStatusFilter={setStatusFilter}
//         tableFilter={tableFilter}
//         setTableFilter={setTableFilter}
//         sortField={sortField}
//         setSortField={setSortField}
//         sortOrder={sortOrder}
//         setSortOrder={setSortOrder}
//         dateRange={dateRange}
//         setDateRange={setDateRange}
//         allTables={allTables}
//       />
//       <ExportButtons orders={filteredOrders} />
//       <OrdersTable orders={filteredOrders} />

//     </div>
//   )
// }