import { Outlet } from "react-router-dom"
import Sidenav from "./Sidenav"
import Header from "./Header"

export default function AppLayout() {
    return (
        <div className="flex h-screen overflow-hidden">

            {/* Sidebar */}
            <Sidenav />

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-y-auto bg-gray-100">

                {/* Header */}
                <Header />

                {/* Pages */}
                <main className="p-6">
                    <Outlet />
                </main>
            </div>

        </div>
    )
}
