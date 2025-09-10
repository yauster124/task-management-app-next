import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { Category } from "@/types/api";

export const getCategories = (): Promise<Category[]> => {
    return api.get("/categories");
}

export const useCategories = () => {
    return useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: getCategories
    });
}