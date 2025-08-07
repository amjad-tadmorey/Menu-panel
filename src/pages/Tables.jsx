import { Modal } from "../ui/Modal";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";
import AddTable from "../components/AddTable";
import { useTables } from "../hooks/remote/useTables";
import { fetchTablesWithOrders } from "../lib/TablesApi";
import Table from "../ui/tables/Table";

export default function Tables() {

  const { data: tables, isPending } = useTables(fetchTablesWithOrders, 'tables')

  if (isPending) return <Spinner />



  return (

    <>
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen rounded-2xl shadow-xl">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Tables Managment</h1>
          <Modal>
            <Modal.Open>
              <Button className="btn">
                + Add Table
              </Button>
            </Modal.Open>
            <Modal.Content>
              <AddTable />
            </Modal.Content>

          </Modal>
        </div>
        <Table data={tables} />
      </div>




    </>

  );

}
