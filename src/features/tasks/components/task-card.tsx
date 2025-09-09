import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react";
import { Task } from "@/types/api"
import { Draggable } from "@hello-pangea/dnd";
import { UpdateTask } from "./update-task";
import { DeleteTask } from "./delete-task";
import { useUIStore } from "@/components/store/ui-store";

export const TaskCard = ({ task, index }: { task: Task, index: number }) => {
    const isOpen = useUIStore((s) => s.isOpen(`task-menu-${task.id}`));
    const { open, close } = useUIStore();

    return (
        <Draggable draggableId={String(task.id)} index={index}>
            {(provided, snapshot) => (
                <Card
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <CardHeader className="relative flex justify-between items-start">
                        <CardTitle>{task.title}</CardTitle>
                        <DropdownMenu open={isOpen} onOpenChange={(openValue) => openValue ? open(`task-menu-${task.id}`) : close(`task-menu-${task.id}`)}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-5 w-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <UpdateTask
                                    trigger={
                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                            Edit
                                        </DropdownMenuItem>
                                    }
                                    task={task}
                                />
                                <DeleteTask
                                    trigger={
                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                            Delete
                                        </DropdownMenuItem>
                                    }
                                    task={task}
                                />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>{task.description}</CardDescription>
                    </CardContent>
                    <CardFooter>
                        {task.doBy.toString()}
                    </CardFooter>
                </Card>
            )}
        </Draggable>
    )
}