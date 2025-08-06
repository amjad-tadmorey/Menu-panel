/* eslint-disable react/prop-types */
// components/ProtectedRoute.jsx
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"

export default function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()

      if (data?.session) {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
        navigate("/login")
      }
    }

    checkAuth()
  }, [navigate])

  if (isAuthenticated === null) return null

  return children
}
