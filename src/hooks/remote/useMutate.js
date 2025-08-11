import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useMutate(mutateFn, key) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: mutateFn,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [key] })
        },
    })
}