import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Task } from "@/types/api"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useForm } from "react-hook-form"
import { UpdateTaskInput, updateTaskInputSchema, useUpdateTask } from "../api/update-task"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/ui/date-picker"
import { Loader2Icon } from "lucide-react"
import { useUIStore } from "@/components/store/ui-store"
import { ViewComment } from "@/features/comments/components/view-comment"
import { CreateComment } from "@/features/comments/components/create-comment"

export const UpdateTask = ({
    trigger,
    task
}: {
    trigger: React.ReactNode,
    task: Task
}) => {
    const isOpen = useUIStore((s) => s.isOpen(`update-task-${task.id}`));
    const { open, close } = useUIStore();
    const updateTask = useUpdateTask();

    const form = useForm<UpdateTaskInput>({
        resolver: zodResolver(updateTaskInputSchema),
        defaultValues: {
            title: task.title,
            description: task.description,
            doBy: new Date(task.doBy)
        }
    });

    return (
        <Dialog open={isOpen} onOpenChange={(openValue) => openValue ? open(`update-task-${task.id}`) : close(`update-task-${task.id}`)}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <Form {...form}>
                    <form
                        onSubmit={
                            form.handleSubmit((values) => updateTask.mutate({
                                data: values,
                                taskId: task.id
                            }))
                        }
                        className="space-y-4"
                    >
                        <DialogHeader>
                            <DialogTitle>Edit task</DialogTitle>
                        </DialogHeader>
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="doBy"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Do by date</FormLabel>
                                    <FormControl>
                                        <DatePicker {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            {updateTask.isPending ? (
                                <Button disabled>
                                    <Loader2Icon className="animate-spin" />
                                    Please wait
                                </Button>
                            ) : (
                                <Button type="submit">Save changes</Button>
                            )}
                        </DialogFooter>
                    </form>
                </Form>
                <CreateComment taskId={task.id} />
                {task.comments?.map((comment) => {
                    return (
                        <ViewComment comment={comment} />
                    )
                })}
            </DialogContent>
        </Dialog>
    )
}