import { LogOut } from "lucide-react"
import { supabase } from "../lib/supabase"
import { useNavigate } from "react-router-dom"

export default function LogoutButton() {
    const navigate = useNavigate()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate("/login")
    }

    return (
        <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-red-500 transition"
            title="Log out"
        >
            <LogOut className=" cursor-pointer" color="red" size={50} />
        </button>
    )
}
