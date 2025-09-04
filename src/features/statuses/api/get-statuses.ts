import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { Status } from "@/types/api";

export const getStatuses = (): Promise<Status[]> => {
    return api.get("/statuses");
}

export const useStatuses = () => {
    return useQuery<Status[]>({
        queryKey: ['status'],
        queryFn: getStatuses
    });
}