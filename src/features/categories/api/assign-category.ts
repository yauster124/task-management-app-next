import { useUIStore } from "@/components/store/ui-store";
import { api } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type AssignCategoryInput = {
    id?: string;
    title?: string;
}

export const assignCategory = ({
    taskId,
    data
}: {
    taskId: string,
    data: AssignCategoryInput
}) => {
    return api.post(`/tasks/${taskId}/categories`, data);
}

export const useAssignCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: assignCategory,
        onSuccess: (_, variables) => {
            queryClient.refetchQueries({
                queryKey: ["categories"]
            });
            queryClient.refetchQueries({
                queryKey: ["tasks"]
            });
            useUIStore.getState().close(`category-combobox-${variables.taskId}-`);
        }
    })
}