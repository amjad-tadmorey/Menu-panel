import NoData from "../NoData";

/* eslint-disable react/prop-types */
export default function Table({ data }) {
    if (!data || data.length === 0) {
        return <div className="p-4 text-gray-500 mx-auto my-auto w-96">
            <NoData />
        </div>;
    }

    const columns = Object.keys(data[0]);

    return (
        <div className="overflow-auto rounded-lg shadow bg-white px-4">
            <div className="flex flex-col sm:flex-row items-center gap-3 p-4"></div>

            <table className="min-w-full text-sm text-gray-700">
                <thead>
                    <tr className="bg-gray-100 text-left">
                        {columns.map((col) => (
                            <th key={col} className="p-3 capitalize">
                                {col.replace(/_/g, ' ')}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr key={row.id || JSON.stringify(row)} className="border-t border-gray-300 hover:bg-gray-50">
                            {columns.map((col) => (
                                <td key={col} className="p-3">
                                    {formatCell(row[col])}
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
    if (typeof value === 'object' && value !== null) return '[Object]';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    return value?.toString?.() || '';
}