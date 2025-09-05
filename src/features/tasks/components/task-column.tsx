import { Status, Task } from "@/types/api"
import { Droppable } from "@hello-pangea/dnd"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TaskCard } from "./task-card"

export const TaskColumn = ({ status, tasks }: { status: Status, tasks: Task[] }) => {
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
            </CardContent>
        </Card >
    )
}