import { api } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const unassignCategory = ({
    taskId,
    categoryId
}: {
    taskId: string,
    categoryId: string
}) => {
    return api.delete(`/tasks/${taskId}/categories/${categoryId}`);
}

export const useUnassignCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: unassignCategory,
        onSuccess: () => {
            queryClient.refetchQueries({
                queryKey: ["categories"]
            });
            queryClient.refetchQueries({
                queryKey: ["tasks"]
            });
        }
    })
}