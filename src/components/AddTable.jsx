/* eslint-disable react/prop-types */
import toast from "react-hot-toast";
import { useMutate } from "../hooks/remote/useMutate";
import Button from "../ui/Button";
import { createTable } from "../lib/TablesApi";


export default function AddTable({ close }) {
    const { mutate } = useMutate(createTable);
    const handleSubmit = (e) => {
        e.preventDefault();
        mutate();
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
