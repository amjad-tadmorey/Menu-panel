import { LogOut } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/login");
    };

    return (
        <button
            onClick={handleLogout}
            title="Log out"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-900 shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
            <LogOut size={24} />
            <span className="font-medium text-sm select-none">Logout</span>
        </button>
    );
}