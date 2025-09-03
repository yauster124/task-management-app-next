import { DragDropContext, DropResult, OnDragEndResponder } from "@hello-pangea/dnd"
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Task, Tasks } from "@/app/dashboard/tasks/api/types"
import { TaskColumn } from "./task-column"
import { moveTask } from "@/app/dashboard/tasks/api/actions";

type ColumnId = "To do" | "Doing" | "Done";

export const TaskBoard = ({ tasks }: { tasks: Tasks }) => {
    const queryClient = useQueryClient();

    const updateMutation = useMutation({
        mutationFn: ({ sourceTask, destinationTask }: { sourceTask: Task; destinationTask: Task }) =>
            moveTask({ sourceTask, destinationTask }),
        onSuccess: (data, variables) => {
            const { sourceTask, destinationTask } = variables;

            if (sourceTask.status.id === destinationTask.status.id) {
                queryClient.invalidateQueries({ queryKey: [sourceTask.status.title] })
            } else {
                queryClient.invalidateQueries({ queryKey: [sourceTask.status.title] })
                queryClient.invalidateQueries({ queryKey: [destinationTask.status.title] })
            }
        },
        onError: (errors) => {
            console.log(errors)
        }
    })

    const onDragEnd: OnDragEndResponder = (result: DropResult) => {
        const { source, destination } = result;
        console.log(source.index);
        console.log(destination?.index);

        if (!destination) {
            return;
        }

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        const sourceStatus = source.droppableId as ColumnId;
        const destinationStatus = destination.droppableId as ColumnId;
        const sourceTask = tasks[sourceStatus][source.index];
        const destinationTask = tasks[destinationStatus][destination.index];

        updateMutation.mutate({sourceTask, destinationTask})
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <TaskColumn status="To do" tasks={tasks["To do"]} />
            <TaskColumn status="Doing" tasks={tasks["Doing"]} />
            <TaskColumn status="Done" tasks={tasks["Done"]} />
        </DragDropContext>
    )
}