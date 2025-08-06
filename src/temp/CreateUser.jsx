import { useState } from "react"
import { supabase } from "../lib/supabase"

export default function CreateUser() {
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("staff")
    const [restaurantId, setRestaurantId] = useState("")
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")
    const [successMsg, setSuccessMsg] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setErrorMsg("")
        setSuccessMsg("")

        const email = `${name}@fake.com`

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                    role,
                    restaurant_id: parseInt(restaurantId),
                },
            },
        })

        if (error) {
            setErrorMsg(error.message)
            setLoading(false)
            return
        }

        const userId = data.user?.id

        if (!userId) {
            setErrorMsg("Signup successful, but user ID not returned.")
            setLoading(false)
            return
        }

        const { error: insertError } = await supabase.from("staff").insert([
            {
                user_id: userId,
                name,
                role,
                restaurant_id: parseInt(restaurantId),
            },
        ])

        if (insertError) {
            setErrorMsg("User created but failed to insert into staff table: " + insertError.message)
        } else {
            setSuccessMsg("User and staff record created successfully!")
            setName("")
            setPassword("")
            setRestaurantId("")
            setRole("staff")
        }

        setLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-4"
            >
                <h2 className="text-2xl font-semibold text-center">Create User</h2>

                {errorMsg && <div className="text-red-500 text-sm">{errorMsg}</div>}
                {successMsg && <div className="text-green-500 text-sm">{successMsg}</div>}

                <input
                    type="text"
                    placeholder="Name"
                    className="w-full p-2 border rounded"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-2 border rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <select
                    className="w-full p-2 border rounded"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    <option value="admin">Admin</option>
                    <option value="staff">Staff</option>
                </select>

                <input
                    type="text"
                    placeholder="Restaurant ID"
                    className="w-full p-2 border rounded"
                    value={restaurantId}
                    onChange={(e) => setRestaurantId(e.target.value)}
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                >
                    {loading ? "Creating..." : "Create User"}
                </button>
            </form>
        </div>
    )
}
