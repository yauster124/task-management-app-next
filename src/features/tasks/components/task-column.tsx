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
        <Card>
            <CardHeader className="relative flex justify-between items-start">
                <CardTitle>{status.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <Droppable droppableId={String(status.id)}>
                    {(droppableProvided, snapshot) => (
                        <div
                            ref={droppableProvided.innerRef}
                            {...droppableProvided.droppableProps}
                            className={snapshot.isDraggingOver ? "bg-neutral-800" : ""}
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
                            variant="secondary"
                            size="icon"
                            className="w-full"
                        >
                            <PlusIcon />
                        </Button>
                    }
                    status={status}
                />
            </CardContent>
        </Card >
    )
}