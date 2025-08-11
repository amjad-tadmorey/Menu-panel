import { useGetTable } from '../hooks/main/useGetTable';
import Spinner from '../ui/Spinner'
import Table from '../ui/tables/Table'

export default function Staff() {

    const { data: staff, isPending } = useGetTable('staff', 'staff')
    if (isPending) return <Spinner />
    console.log(staff);
    return (
        <div>
            <Table data={staff} />
        </div>
    )
}
