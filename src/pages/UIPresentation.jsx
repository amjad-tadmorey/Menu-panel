import CustomerUI from "../components/CustomerUI";
import KitchenUI from "../components/KitchenUI";
import WaiterUI from "../components/WaiterUI";
import CashierUI from "../components/CashierUI";

export default function UIPresentation() {
    return (
        <div className="grid grid-cols-2 gap-12 p-4">
            <KitchenUI />
            <WaiterUI />
            <CashierUI />
            <CustomerUI />
        </div>
    )
}
