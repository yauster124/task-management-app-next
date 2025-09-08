import { api } from "@/lib/api-client";
import { Task } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const moveTask = ({
    updatedTask
}: {
    updatedTask: Task
}) => {
    const data: Omit<Task, "id"> = updatedTask;
    return api.patch(`/tasks/${updatedTask.id}`, data);
}

export const useMoveTask = () => {
    const queryClient = useQueryClient();

    return useMutation<
        unknown,
        Error,
        { updatedTask: Task; sourceStatusId: string; destStatusId: string }
    >({
        mutationFn: moveTask,
        onSuccess: () => {
            queryClient.refetchQueries({ queryKey: ["tasks"] });
        }
    });
}