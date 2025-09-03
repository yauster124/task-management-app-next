import { Task } from "@/app/dashboard/tasks/api/types"
import { Droppable } from "@hello-pangea/dnd"
import { Card } from "./card"
import { TaskCard } from "./task-card"

export const TaskColumn = ({ status, tasks }: { status: string, tasks: Task[] }) => {
    return (
        <Droppable droppableId={status}>
            {(droppableProvided, snapshot) => (
                <Card
                    ref={droppableProvided.innerRef}
                    {...droppableProvided.droppableProps}
                    className={snapshot.isDraggingOver ? " isDraggingOver" : ""}
                >
                    {tasks.map((task, index) => (
                        <TaskCard key={task.id} task={task} index={index} />
                    ))}
                    {droppableProvided.placeholder}
                </Card>
            )}
        </Droppable>
    )
}