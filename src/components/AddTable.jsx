/* eslint-disable react/prop-types */
import toast from "react-hot-toast";
import { useCreateTable } from "../hooks/remote/useCreateTable";
import Button from "../ui/Button";


export default function AddTable({ close }) {
    const { mutate: createTable } = useCreateTable();
    const handleSubmit = (e) => {
        e.preventDefault();
        createTable();
        toast.success('done')
        close()
    };



    return (
        <div className="mx-auto p-6 bg-white rounded-lg shadow-md space-y-5">
            <h1>Are you sure you want to create a new table ? </h1>
            <Button onClick={handleSubmit} className="mx-auto block" variant="lg">
                Ok
            </Button>
        </div>
    );
}
