import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Status } from "@/types/api"
import { CreateTaskInput, createTaskInputSchema, useCreateTask } from "../api/create-task";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { useUIStore } from "@/components/store/ui-store";
import z from "zod";

export const CreateTask = ({
    trigger,
    status
}: {
    trigger: React.ReactNode,
    status: Status
}) => {
    const isOpen = useUIStore((s) => s.isOpen(`create-task-${status.id}`));
    const { open, close } = useUIStore();
    const createTask = useCreateTask();

    const form = useForm<CreateTaskInput>({
        resolver: zodResolver(createTaskInputSchema),
        defaultValues: {
            title: "",
            description: "",
            doBy: new Date()
        }
    });

    return (
        <Dialog open={isOpen} onOpenChange={(openValue) => openValue ? open(`create-task-${status.id}`) : close(`create-task-${status.id}`)}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <Form {...form}>
                    <form
                        onSubmit={
                            form.handleSubmit((values) => {
                                createTask.mutate({
                                    data: values,
                                    status: status
                                });
                                form.reset();
                            })
                        }
                        className="space-y-4"
                    >
                        <DialogHeader>
                            <DialogTitle>{status.title}</DialogTitle>
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
                            {createTask.isPending ? (
                                <Button disabled>
                                    <Loader2Icon className="animate-spin" />
                                    Please wait
                                </Button>
                            ) : (
                                <Button type="submit">Create task</Button>
                            )}
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}