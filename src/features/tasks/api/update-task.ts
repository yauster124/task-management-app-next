import { z } from "zod";

import { api } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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

export const useUpdateTask = () => {
    const queryClient = useQueryClient();

    return useMutation<
        unknown,
        Error,
        { data: UpdateTaskInput; taskId: string; statusId: string }
    >({
        mutationFn: updateTask,
        onSuccess: (_, variables) => {
            queryClient.refetchQueries({
                queryKey: ["tasks", variables.statusId]
            })
        }
    });
}