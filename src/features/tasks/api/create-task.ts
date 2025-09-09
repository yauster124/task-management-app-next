import { useUIStore } from "@/components/store/ui-store";
import { api } from "@/lib/api-client";
import { Status } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import z from "zod";

export const createTaskInputSchema = z.object({
    title: z.string().min(1, "Required"),
    description: z.string(),
    doBy: z.date()
});

export type CreateTaskInput = z.infer<typeof createTaskInputSchema>;

export const createTask = ({
    data,
    status
}: {
    data: CreateTaskInput,
    status: Status
}) => {
    const newTask = {
        ...data,
        status: status
    }

    return api.post("/tasks", newTask);
}

export const useCreateTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createTask,
        onSuccess: (_, variables) => {
            queryClient.refetchQueries({
                queryKey: ["tasks"]
            });
            useUIStore.getState().close(`create-task-${variables.status.id}`);
        }
    })
}