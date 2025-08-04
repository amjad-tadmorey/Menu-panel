import { useQuery } from '@tanstack/react-query'
import { supaQuery } from '../../lib/supaQuery'


export function useGet(table, options = {}) {
    return useQuery({
        queryKey: [table, options],
        queryFn: () => supaQuery(table, options),
    })
}