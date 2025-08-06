import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { useNavigate } from "react-router-dom"

export default function Login() {
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")

    const navigate = useNavigate()

    useEffect(() => {
        const checkSession = async () => {
            const { data } = await supabase.auth.getSession()
            if (data?.session) {
                const restaurantId = data.session.user.user_metadata?.restaurant_id
                if (restaurantId) {
                    localStorage.setItem("restaurant_id", restaurantId)
                }

                navigate("/")
            }
        }

        checkSession()
    }, [navigate])

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setErrorMsg("")

        const email = `${name}@fake.com`

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setErrorMsg(error.message)
        } else {
            const restaurantId = data.user.user_metadata?.restaurant_id
            if (restaurantId) {
                localStorage.setItem("restaurant_id", restaurantId)
            }

            navigate("/")
        }

        setLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleLogin}
                className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-4"
            >
                <h2 className="text-2xl font-semibold text-center">Login</h2>

                {errorMsg && <div className="text-red-500 text-sm">{errorMsg}</div>}

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

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    )
}
