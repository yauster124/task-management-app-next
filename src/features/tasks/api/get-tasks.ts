import { useQueries, useQuery, UseQueryResult } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { Status, Task } from "@/types/api";
import { useTasksStore } from "../store/tasks-store";

export const getTasksByStatus = ({ statusId }: { statusId: string }) => {
    return api.get("/tasks", {
        params: {
            statusId: statusId
        }
    })
}

export const useTasks = ({ statuses }: { statuses?: Status[] }): UseQueryResult<Task[], unknown>[] => {
    const setColumns = useTasksStore((state) => state.setColumns);

    return useQueries({
        queries: (statuses || []).map((status) => ({
            queryKey: ["tasks", status.id],
            queryFn: () => getTasksByStatus({ statusId: status.id }),
            enabled: !!statuses
        }))
    })
}