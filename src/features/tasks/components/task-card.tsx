import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react";
import { Task } from "@/types/api"
import { Draggable } from "@hello-pangea/dnd";
import { UpdateTask } from "./update-task";
import { DeleteTask } from "./delete-task";
import { useUIStore } from "@/components/store/ui-store";
import { useCategories } from "@/features/categories/api/get-categories";
import { CategoryBadge } from "@/components/ui/category-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CommentsCard } from "@/features/comments/components/comments-card";

export const TaskCard = ({ task, index }: { task: Task, index: number }) => {
    const isOpen = useUIStore((s) => s.isOpen(`task-menu-${task.id}`));
    const categoriesQuery = useCategories();
    const { open, close } = useUIStore();

    const filteredCategories = (categoriesQuery.data || []).filter(
        c => !new Set(task.categories.map(tc => tc.id)).has(c.id)
    );

    return (
        <Draggable draggableId={String(task.id)} index={index}>
            {(provided, snapshot) => (
                <div
                    className="rounded-lg bg-neutral-50 dark:bg-neutral-800 mb-2 p-4"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <div className="flex w-full justify-between items-center">
                        <h3 className="font-semibold">
                            <CommentsCard
                                task={task}
                                trigger={
                                    <Button variant="link" className="p-0">
                                        {task.title}
                                    </Button>
                                }
                            />
                        </h3>
                        <DropdownMenu
                            open={isOpen}
                            onOpenChange={(openValue) => openValue ? open(`task-menu-${task.id}`) : close(`task-menu-${task.id}`)}
                        >
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="hover:bg-neutral-200 dark:hover:bg-neutral-700">
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
                    </div>
                    <div className="text-muted-foreground text-sm mb-4">
                        Do by: {task.doBy.toString()}
                    </div>
                    <div className="flex w-full flex-wrap gap-2 mb-2">
                        {task.categories.map((taskCategory) => {
                            return (
                                <CategoryBadge
                                    key={taskCategory.id}
                                    taskId={task.id}
                                    categories={filteredCategories}
                                    taskCategory={taskCategory}
                                />
                            )
                        })}
                        <CategoryBadge taskId={task.id} categories={filteredCategories} />
                    </div>
                    <div className="flex justify-end">
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            )}
        </Draggable>
    )
}