import { useUIStore } from "@/components/store/ui-store";
import { api } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type ReplaceCategoryInput = {
    oldId: string;
    newId?: string;
    title?: string;
}

export const replaceCategory = ({
    taskId,
    data
}: {
    taskId: string,
    data: ReplaceCategoryInput
}) => {
    return api.patch(`/tasks/${taskId}/categories`, data);
}

export const useReplaceCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: replaceCategory,
        onSuccess: (_, variables) => {
            queryClient.refetchQueries({
                queryKey: ["categories"]
            });
            queryClient.refetchQueries({
                queryKey: ["tasks"]
            });
            useUIStore.getState().close(`category-combobox-${variables.data.oldId}-`);
        }
    })
}