"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { deleteTask, getTasks, updateTask } from "@/app/dashboard/tasks/api/actions"
import { Task } from "@/app/dashboard/tasks/api/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { MoreHorizontal } from "lucide-react"
import UIAlertDialog from "@/components/ui/ui-alert-dialog"
import UIEditTaskDialog from "@/components/ui/ui-edit-task-dialog"
import { TaskForm } from "@/app/dashboard/tasks/api/types"
import { DragDropContext } from '@hello-pangea/dnd';

export default function Tasks() {
    const queryClient = useQueryClient();

    const { isPending: taskPending, isError: tasksError, data: tasks = [] } = useQuery<Task[]>({
        queryKey: ['tasks'],
        queryFn: () => getTasks()
    })

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteTask(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        }
    })

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

    const updateCallback = (id: string, data: TaskForm) => {
        updateMutation.mutate({ id: id, data: data});
    }

    return (
        <>
            {
                taskPending ? (
                    <Card>
                        <CardHeader className="relative flex justify-between items-start">
                            <CardTitle>
                                <Skeleton className="h-5 w-[150px]" />
                            </CardTitle>

                            <Button variant="ghost" size="icon" disabled>
                                <Skeleton className="h-5 w-5 rounded-full" />
                            </Button>
                        </CardHeader>

                        <CardContent>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        </CardContent>

                        <CardFooter>
                            <Skeleton className="h-4 w-[100px]" />
                        </CardFooter>
                    </Card>
                ) : tasksError ? (
                    <p>Failed to load tasks</p>
                ) : (
                    <div className="flex flex-col gap-y-2">
                        {tasks.map(task => (
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
                                                </DropdownMenuItem>} onContinue={(data) => updateCallback(task.id, data)} task={{
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
                        ))}
                    </div>
                )
            }
        </>
    )
}