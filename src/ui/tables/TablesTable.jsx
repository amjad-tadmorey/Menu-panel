import { useState } from "react";
import NoData from "../NoData";
import Button from "../Button";

/* eslint-disable react/prop-types */
export default function Table({ data }) {
    const [selectedRows, setSelectedRows] = useState([]);

    if (!data || data.length === 0) {
        return (
            <div className="p-4 text-gray-500 mx-auto my-auto w-96">
                <NoData />
            </div>
        );
    }

    const columns = ["select", "qr_image", "qr_url", "table_number", "is_active", "orders"];

    const toggleRow = (id) => {
        setSelectedRows((prev) =>
            prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
        );
    };

    const handleSaveQR = () => {
        const selectedData = data.filter((row) => selectedRows.includes(row.id));

        selectedData.forEach((row, index) => {
            if (row.qr_image) {
                fetch(row.qr_image)
                    .then((res) => res.blob())
                    .then((blob) => {
                        const link = document.createElement("a");
                        link.href = URL.createObjectURL(blob);
                        link.download = `qr_table_${row.table_number || index + 1}.png`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    });
            }
        });
    };

    return (
        <div className="overflow-auto rounded-lg shadow bg-white">
            {selectedRows.length > 0 && (
                <div className="p-4 flex justify-end">
                    <Button
                        onClick={handleSaveQR}
                        variant="secondary"
                    >
                        Save QR ({selectedRows.length})
                    </Button>
                </div>
            )}

            <table className="min-w-full text-sm text-gray-700">
                <thead>
                    <tr className="bg-gray-100 text-left">
                        {columns.map((col) => (
                            <th key={col} className="p-3 capitalize">
                                {col === "select" ? "" : col.replace(/_/g, " ")}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr
                            key={row.id || JSON.stringify(row)}
                            className="border-t border-gray-300 hover:bg-gray-50"
                        >
                            {columns.map((col) => (
                                <td key={col} className="p-3">
                                    {col === "select" ? (
                                        <input
                                            type="checkbox"
                                            checked={selectedRows.includes(row.id)}
                                            onChange={() => toggleRow(row.id)}
                                            className="w-5 h-5 accent-blue-400 cursor-pointer rounded border-gray-300 focus:ring-2 focus:ring-blue-400"
                                        />
                                    ) : col === "qr_image" ? (
                                        row[col] ? (
                                            <img
                                                src={row[col]}
                                                alt="QR"
                                                className="w-16 h-16 object-contain"
                                            />
                                        ) : (
                                            "-"
                                        )
                                    ) : (
                                        formatCell(row[col])
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function formatCell(value) {
    if (Array.isArray(value)) return `${value.length}`;
    if (typeof value === "object" && value !== null) return "[Object]";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    return value?.toString?.() || "";
}
