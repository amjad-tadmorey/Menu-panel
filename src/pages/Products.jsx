import AddProducts from "../components/AddProducts";
import { Modal } from "../ui/Modal";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";
import ItemsTable from "../ui/ItemsTable";
import { useProducts } from "../hooks/remote/useProducts";
import { fetchProductsWithItems } from "../lib/productsApi";

export default function Products() {

  const { data: items, isPending } = useProducts(fetchProductsWithItems, 'menu')

  if (isPending) return <Spinner />



  return (

    <>
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen rounded-2xl shadow-xl">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Items Managment</h1>
          <Modal>
            <Modal.Open>
              <Button className="btn">
                + Add Item
              </Button>
            </Modal.Open>
            <Modal.Content>
              <AddProducts />
            </Modal.Content>

          </Modal>
        </div>
        <ItemsTable items={items} />
      </div>




    </>

  );

}
