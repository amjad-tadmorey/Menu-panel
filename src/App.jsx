import { Toaster } from "react-hot-toast"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Orders from "./pages/Orders"
import Products from "./pages/Products"
import Tables from "./pages/Tables"
import Staff from "./pages/Staff"
import Settings from "./pages/Settings"
import Login from "./pages/Login"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <>
      {/* <CreateUser /> */}
      <BrowserRouter>
        <Routes>
          {/* صفحة تسجيل الدخول متاحة للجميع */}
          <Route path="/login" element={<Login />} />

          {/* كل شي داخل AppLayout محمي */}
          <Route
            path="/"
            element={
              <ProtectedRoute />
            }
          >
            <Route index element={<Home />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/products" element={<Products />} />
            <Route path="/tables" element={<Tables />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>

        <Toaster
          gutter={12}
          containerStyle={{
            width: "100%",
            top: "35%",
            left: "50%",
            translate: "-50% -50%",
          }}
          toastOptions={{
            success: { duration: 3000 },
            error: { duration: 5000 },
            style: {
              fontSize: "1rem",
              width: "fit-content",
              padding: "8px 24px",
              backgroundColor: "white",
              color: "var(--color-grey-700)",
            },
          }}
        />
      </BrowserRouter>
    </>
  )
}

export default App
