import Spinner from "../ui/Spinner";
import ItemsTable from "../ui/tables/ItemsTable";
import { useGet } from "../hooks/remote/useGet";
import { fetchProducts } from "../lib/productsApi";

export default function Products() {

  const { data: items, isPending } = useGet(fetchProducts, 'menu')

  if (isPending) return <Spinner />

  return (
    <div className="overflow-x-auto">
      <ItemsTable items={items} />
    </div>
  );

}
