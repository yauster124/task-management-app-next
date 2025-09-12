import { useForm } from "react-hook-form";
import { CreateCommentInput, createCommentInputSchema, useCreateComment } from "../api/create-comments";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const CreateComment = ({
    taskId
}: {
    taskId: string
}) => {
    const form = useForm<CreateCommentInput>({
        resolver: zodResolver(createCommentInputSchema),
        defaultValues: {
            content: ""
        }
    });

    const createComment = useCreateComment();

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit((values) => {
                    createComment.mutate({
                        taskId: taskId,
                        data: values
                    })
                    form.reset();
                })}
                className="space-y-3 w-full"
            >
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Textarea
                                    placeholder="Write your comment..."
                                    className="min-h-[80px] resize-none"
                                    autoComplete="nope"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end">
                    <Button type="submit">Post Comment</Button>
                </div>
            </form>
        </Form>
    )
}