import { z } from "zod";

import { api } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUIStore } from "@/components/store/ui-store";

export const updateTaskInputSchema = z.object({
    title: z.string().min(1, "Required"),
    description: z.string(),
    doBy: z.date()
});

export type UpdateTaskInput = z.infer<typeof updateTaskInputSchema>;

export const updateTask = ({
    data,
    taskId
}: {
    data: UpdateTaskInput;
    taskId: string
}) => {
    return api.patch(`/tasks/${taskId}`, data);
}

export const useUpdateTask = (onSuccess?: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateTask,
        onSuccess: (_, variables) => {
            queryClient.refetchQueries({
                queryKey: ["tasks"]
            });
            useUIStore.getState().close(`update-task-${variables.taskId}`);
            useUIStore.getState().close(`task-menu-${variables.taskId}`);
            onSuccess?.();
        }
    });
}