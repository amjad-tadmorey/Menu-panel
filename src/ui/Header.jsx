import LogoutButton from "../components/LogoutButton";

export default function Header() {
    return (
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
            {/* You can place a user profile or logout here */}

            <LogoutButton />
        </header>
    )
}
