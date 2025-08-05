import KitchenOrders from "./pages/KitchenUI";
import OrdersManagement from "./pages/CashierUI";
import WaiterUI from "./pages/WaiterUI";
import CreateOrder from "./pages/CreateOrder";

function App() {




  return (
    <div className="flex">
      <WaiterUI />
      <OrdersManagement />
      <KitchenOrders />
      <CreateOrder />
    </div>
  )
}

export default App
