import Spinner from '../ui/Spinner'
import { useGet } from '../hooks/remote/generals/useGet'
import Table from '../ui/tables/Table'

export default function Staff() {

    const { data: staff, isPending } = useGet('staff', 'staff')
    if (isPending) return <Spinner />
    console.log(staff);
    return (
        <div>
            <Table data={staff} />
        </div>
    )
}
