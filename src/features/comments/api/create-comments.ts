import { api } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import z from "zod";

export const createCommentInputSchema = z.object({
    content: z.string().min(1, "Required")
});

export type CreateCommentInput = z.infer<typeof createCommentInputSchema>;

export const createComment = ({
    taskId,
    data
}: {
    taskId: string,
    data: CreateCommentInput
}) => {
    return api.post(`/comments/${taskId}`, data);
}

export const useCreateComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createComment,
        onSuccess: () => {
            queryClient.refetchQueries({
                queryKey: ["tasks"]
            });
        }
    })
}