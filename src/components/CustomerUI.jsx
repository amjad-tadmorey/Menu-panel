// components/OrderPage.jsx
import { useState } from "react"
import { useCreateOrder } from "../hooks/remote/useCreateOrder"
import Spinner from "../ui/Spinner"
import toast from "react-hot-toast"
import Button from "../ui/Button"
import Image from "../ui/Image"
import { useGet } from "../hooks/remote/generals/useGet"



export default function CustomerUI() {
    const { mutate: createOrder, isPending: isCreating, isSuccess } = useCreateOrder()
    const { data: menuItems, isPending } = useGet('menu')

    const [selectedItems, setSelectedItems] = useState({})
    const [activeCategory, setActiveCategory] = useState('all')
    const [notes, setNotes] = useState('')

    const handleAddToOrder = (item) => {
        setSelectedItems((prev) => ({
            ...prev,
            [item.id]: { ...item, quantity: 1 },
        }))
    }

    const handleQuantityChange = (menu_id, delta) => {
        setSelectedItems((prev) => {
            const current = prev[menu_id]
            const newQty = current.quantity + delta
            if (newQty <= 0) {
                const updated = { ...prev }
                delete updated[menu_id]
                return updated
            }
            return {
                ...prev,
                [menu_id]: { ...current, quantity: newQty },
            }
        })
    }

    const totalPrice = Object.values(selectedItems).reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    )

    const handleSubmit = async () => {
        try {
            const items = Object.values(selectedItems).map((item) => ({
                menu_id: item.id,
                quantity: item.quantity,
                unit_price: item.price,
            }))

            createOrder({
                restaurant_id: 1, table_id: 1, items, notes
            })
            isSuccess && toast.success('done')
            setSelectedItems({})
        } catch (err) {
            toast.error(err.message)
        }
    }

    if (isPending) return <Spinner />

    const categories = ['all', ...new Set(menuItems?.map((item) => item.category))]

    const filteredMenu = activeCategory === 'all'
        ? menuItems
        : menuItems.filter((item) => item.category === activeCategory)

    return (
        <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
            <h1 className="text-3xl font-semibold mb-6 text-gray-800">Customer UI</h1>

            <div className="flex gap-2 mb-6 overflow-x-auto">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2 rounded-full border text-sm whitespace-nowrap transition-all ${activeCategory === cat
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredMenu.map((item) => {
                    console.log(item);

                    const selected = selectedItems[item.id]
                    return (
                        <div
                            key={item.id}
                            className="rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden bg-white"
                        >
                            <Image
                                src={item.image_url}
                                alt={item.name}
                                className="w-full h-40 object-cover"
                            />

                            <div className="p-4 flex flex-col items-center">
                                <h2 className="text-lg font-semibold text-center">{item.name}</h2>
                                <p className="text-sm text-gray-600 mb-2">{item.price} ج.م</p>

                                {selected ? (
                                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                        <button
                                            onClick={() => handleQuantityChange(item.id, -1)}
                                            className="bg-gray-300 px-3 py-1 rounded text-lg"
                                        >
                                            -
                                        </button>
                                        <span className="font-medium">{selected.quantity}</span>
                                        <button
                                            onClick={() => handleQuantityChange(item.id, 1)}
                                            className="bg-blue-500 text-white px-3 py-1 rounded text-lg"
                                        >
                                            +
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleAddToOrder(item)}
                                        className="bg-green-600 text-white mt-2 px-4 py-2 rounded hover:bg-green-700 transition"

                                    >
                                        Add
                                    </button>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>


            <div className="my-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                    Notes
                    <textarea
                        value={notes} onChange={(e) => setNotes(e.target.value)}
                        className="w-full mt-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow resize-none shadow-sm"
                        rows="4"
                    ></textarea>
                </label>
            </div>

            <div className="mt-10 border-t pt-6">
                <div className="flex justify-between items-center text-xl font-semibold mb-4">
                    <span>المجموع:</span>
                    <span className="text-green-700">{totalPrice} ج.م</span>
                </div>

                <Button
                    onClick={handleSubmit}
                    disabled={isCreating}
                    variant="lg"
                >
                    تأكيد
                </Button>

                {isSuccess && (
                    <div className="mt-4 text-center text-green-700 font-bold">

                    </div>
                )}
            </div>
        </div>
    )
}
