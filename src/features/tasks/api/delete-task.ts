import { api } from "@/lib/api-client"
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const deleteTask = ({
    taskId
}: {
    taskId: string
}) => {
    return api.delete(`/tasks/${taskId}`);
};

export const useDeleteTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteTask,
        onSuccess: () => {
            queryClient.refetchQueries({
                queryKey: ["tasks"]
            })
        }
    });
}