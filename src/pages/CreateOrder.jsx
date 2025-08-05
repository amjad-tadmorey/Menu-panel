import Button from '../ui/Button'
import { useCreateOrder } from '../hooks/remote/useCreateOrder'

export default function CreateOrder() {
    const { mutate, isPending, isSuccess, data } = useCreateOrder()



    return (
        <div>
            <Button
                onClick={() => mutate({ restaurant_id: 1, table_id: 1 })}
                disabled={isPending}
            >
                {isPending ? 'Creating...' : 'Create Order'}
            </Button>

            {isSuccess && (
                <div>✅ Order #{data.order_number} created</div>
            )}
        </div>
    )
}
