import { useState } from "react";

export default function MultipleInputs() {
    const [rows, setRows] = useState([{ select: "", input: "" }]);

    const handleChange = (index, field, value) => {
        const updated = [...rows];
        updated[index][field] = value;
        setRows(updated);
    };

    const handleAdd = () => {
        setRows([...rows, { select: "", input: "" }]);
    };

    return (
        <div>
            {rows.map((row, index) => (
                <div key={index} className="flex gap-2 mb-2">
                    <select
                        value={row.select}
                        onChange={(e) => handleChange(index, "select", e.target.value)}
                        className="border p-2 rounded"
                    >
                        <option value="">Select</option>
                        <option value="Facebook">Facebook</option>
                        <option value="Instagram">Instagram</option>
                        <option value="Twitter">Twitter</option>
                    </select>

                    <input
                        type="text"
                        value={row.input}
                        onChange={(e) => handleChange(index, "input", e.target.value)}
                        className="border p-2 rounded"
                        placeholder="Link"
                    />
                </div>
            ))}
            <button onClick={handleAdd} className="mt-2 text-blue-500">+ Add</button>
        </div>
    );
}
