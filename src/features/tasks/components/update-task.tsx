import { DialogFooter, DialogHeader } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Task } from "@/types/api"
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog"
import { useForm } from "react-hook-form"
import { UpdateTaskInput, updateTaskInputSchema, useUpdateTask } from "../api/update-task"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/utils/utils"
import { format } from "date-fns"

export const UpdateTask = ({
    trigger,
    task
}: {
    trigger: React.ReactNode,
    task: Task
}) => {
    const updateTask = useUpdateTask();

    const form = useForm<UpdateTaskInput>({
        resolver: zodResolver(updateTaskInputSchema),
        defaultValues: {
            title: task.title,
            description: task.description,
            doBy: task.doBy
        }
    });

    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <Form {...form}>
                    <form
                        onSubmit={
                            form.handleSubmit((values) => updateTask.mutate({
                                data: values,
                                taskId: task.id,
                                statusId: task.status.id
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
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[240px] pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                captionLayout="dropdown"
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Save changes</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>

        </Dialog>
    )
}