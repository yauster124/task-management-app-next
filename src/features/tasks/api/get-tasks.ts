import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { Task } from "@/types/api";

export const getTasksByStatus = (): Promise<Record<string, Task[]>> => {
    return api.get("/tasks");
}

export const useTasks = () => {
    return useQuery<Record<string, Task[]>>({
        queryKey: ["tasks"],
        queryFn: getTasksByStatus
    })
}