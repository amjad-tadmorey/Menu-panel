import { useQuery } from '@tanstack/react-query'

export function useGet(fetchFn, key) {
    return useQuery({
        queryKey: [key],
        queryFn: fetchFn,
    })
}
