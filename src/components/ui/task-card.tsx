import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteTask, updateTask } from "@/app/dashboard/tasks/api/actions";
import { Task, TaskForm } from "@/app/dashboard/tasks/api/types";
import UIAlertDialog from "./ui-alert-dialog";
import UIEditTaskDialog from "./ui-edit-task-dialog";
import { Draggable } from "@hello-pangea/dnd";

export const TaskCard = ({ task, index }: { task: Task, index: number }) => {
    const queryClient = useQueryClient();

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: TaskForm }) =>
            updateTask({ id, data }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] })
        },
        onError: (errors) => {
            console.log(errors)
        }
    })

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteTask(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        }
    })

    return (
        <Draggable draggableId={String(task.id)} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}>
                    <Card key={task.id}>
                        <CardHeader className="relative flex justify-between items-start">
                            <CardTitle>{task.title}</CardTitle>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-5 w-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <UIEditTaskDialog trigger={
                                        <DropdownMenuItem onSelect={(e) => {
                                            e.preventDefault()
                                        }}>
                                            Edit
                                        </DropdownMenuItem>} onContinue={(data) => updateMutation.mutate({ id: task.id, data: data })} task={{
                                            title: task.title,
                                            description: task.description,
                                            doBy: new Date(task.doBy)
                                        }} />
                                    <UIAlertDialog trigger={
                                        <DropdownMenuItem onSelect={(e) => {
                                            e.preventDefault()
                                        }}>
                                            Delete
                                        </DropdownMenuItem>} onContinue={() => deleteMutation.mutate(task.id)} />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>{task.description}</CardDescription>
                        </CardContent>
                        <CardFooter>
                            {task.doBy}
                        </CardFooter>
                    </Card>
                </div>
            )}
        </Draggable>
    )
}