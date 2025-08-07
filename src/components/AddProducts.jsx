import { useEffect, useState } from "react";
import { restaurantId } from "../constants/remote";
import { useInsert } from "../hooks/remote/generals/useInsert";
import { FOOD_CATEGORIES } from "../constants/local";

import Input from '../ui/Input'
import { uploadImage } from "../lib/productsApi";


export default function AddProducts() {
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        category: FOOD_CATEGORIES[0],
    });
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const insertItem = useInsert("menu", "menu");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };
    setImageFile
    const handleFileChange = (file) => {
        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!imageFile) {
            alert("Please select an image");
            return;
        }

        try {
            const image_url = await uploadImage(imageFile);
            await insertItem.mutateAsync({
                ...form,
                price: Number(form.price),
                restaurant_id: restaurantId,
                image_url,
            });

            setForm({
                name: "",
                description: "",
                price: "",
                category: FOOD_CATEGORIES[0],
            });
            setImageFile(null);
            alert("Item created successfully");
        } catch (err) {
            console.error(err);
            alert("Error: " + err.message);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/")) {
            handleFileChange(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    return (
        <form onSubmit={handleSubmit} className="mx-auto p-6 bg-white rounded-lg shadow-md space-y-5">
            <h2 className="text-2xl font-bold text-gray-800">Add New Menu Item</h2>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <Input name="name" value={form.name} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} required rows={3} className="w-full p-4 rounded-xl bg-white/40 border border-blue-100 text-gray-800 shadow
        placeholder-gray-600 focus:outline-none focus:border-[#4e6ef2] backdrop-blur" />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <Input name="price" type="number" value={form.price} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select name="category" value={form.category} onChange={handleChange} className="w-full p-4 rounded-xl bg-white/40 border border-blue-100 text-gray-800 shadow
        placeholder-gray-600 focus:outline-none focus:border-[#4e6ef2] backdrop-blur" >
                    {FOOD_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-blue-400 transition"
            >
                <label className="text-gray-500 text-sm">Drag & drop an image here or click to select</label>
                <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e.target.files[0])}
                    className="hidden"
                    id="imageUpload"
                />
                <label htmlFor="imageUpload" className="mt-2 text-blue-600 underline cursor-pointer">Choose Image</label>
                {previewUrl && (
                    <img src={previewUrl} alt="Preview" className="mt-4 max-h-48 rounded" />
                )}
            </div>

            <button
                type="submit"
                disabled={insertItem.isPending}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
                {insertItem.isPending ? "Submitting..." : "Create Item"}
            </button>

            {insertItem.error && (
                <p className="text-red-600 text-sm mt-2">{insertItem.error.message}</p>
            )}
        </form>
    );
}
