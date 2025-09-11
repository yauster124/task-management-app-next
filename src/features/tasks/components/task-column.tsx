import { Status, Task } from "@/types/api"
import { Droppable } from "@hello-pangea/dnd"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TaskCard } from "./task-card"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { CreateTask } from "./create-task"

export const TaskColumn = ({
    status,
    tasks
}: {
    status: Status,
    tasks: Task[]
}) => {
    return (
        <div className="rounded-lg bg-neutral-100 dark:bg-neutral-900 p-4">
            <div className="mb-4">
                <h3 className="font-semibold leading-none tracking-tight">
                    {status.title}
                </h3>
            </div>
            <Droppable droppableId={String(status.id)}>
                {(droppableProvided, snapshot) => (
                    <div
                        ref={droppableProvided.innerRef}
                        {...droppableProvided.droppableProps}
                        className={snapshot.isDraggingOver ? "bg-neutral-200 dark:bg-neutral-700" : ""}
                    >
                        {(tasks ?? []).map((task, index) => (
                            <TaskCard key={task.id} task={task} index={index} />
                        ))}
                        {droppableProvided.placeholder}
                    </div>
                )}
            </Droppable>
            <CreateTask
                key={status.id}
                trigger={
                    <Button
                        variant="ghost"
                        size="icon"
                        className="w-full hover:bg-neutral-200"
                    >
                        <PlusIcon />
                        <span className="font-normal text-muted-foreground">Add another task</span>
                    </Button>
                }
                status={status}
            />
        </div>
    )
}