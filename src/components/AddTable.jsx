import { useCreateTable } from "../hooks/remote/useCreateTable";
import Button from "../ui/Button";


export default function AddTable() {
    const { mutate: insertTable } = useCreateTable();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            insertTable()
        } catch (err) {
            console.error(err);
            alert("Error: " + err.message);
        }
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
