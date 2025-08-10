import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import AppLayout from "../ui/AppLayout"
import CashierUI from "./CashierUI"
import KitchenUI from "./KitchenUI"
import WaiterUI from "./WaiterUI"
import UIPresentation from "../pages/UIPresentation"

export default function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true)
      const { data } = await supabase.auth.getSession()

      if (data?.session) {
        setIsAuthenticated(true)
        setUser(data.session.user)
      } else {
        setIsAuthenticated(false)
        navigate("/login")
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [navigate])

  return <UIPresentation />

  // if (isLoading) return null
  // if (isAuthenticated === null) return null
  // if (user.user_metadata.role === 'manager') return <AppLayout />
  // if (user.user_metadata.role === 'cashier') return <CashierUI />
  // if (user.user_metadata.role === 'chef') return <KitchenUI />
  // if (user.user_metadata.role === 'waiter') return <WaiterUI />
}
