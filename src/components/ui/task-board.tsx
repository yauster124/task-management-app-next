import { DragDropContext, DropResult, OnDragEndResponder } from "@hello-pangea/dnd"
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Task, Tasks } from "@/types/api"
import { TaskColumn } from "./task-column"
import { moveTask } from "@/app/dashboard/tasks/api/actions";
import { mapStatus, reorder } from "@/utils/utils";

type ColumnId = "To do" | "Doing" | "Done";

export const TaskBoard = ({ tasks }: { tasks: Tasks }) => {
    const queryClient = useQueryClient();

    const updateMutation = useMutation({
        mutationFn: ({ sourceTask, destinationTask, updatedTask }: { sourceTask: Task, destinationTask: Task, updatedTask: Task }) =>
            moveTask(updatedTask),
        onMutate: async (variables) => {
            const { sourceTask, destinationTask, updatedTask } = variables as {
                sourceTask: Task;
                destinationTask: Task;
                updatedTask: Task;
            };

            // cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: [sourceTask.status.title] });
            await queryClient.cancelQueries({ queryKey: [destinationTask.status.title] });

            // snapshot previous value
            const prevSource = queryClient.getQueryData<Task[]>([sourceTask.status.title]);
            const prevDest = queryClient.getQueryData<Task[]>([destinationTask.status.title]);

            // optimistically reorder in the cache
            if (sourceTask.status.id === destinationTask.status.id) {
                queryClient.setQueryData<Task[]>([sourceTask.status.title], (old = []) => {
                    // do local reorder here
                    return reorder(old, sourceTask.taskIndex, destinationTask.taskIndex);
                });
            } else {
                queryClient.setQueryData<Task[]>([sourceTask.status.title], (old = []) =>
                    old.filter((t) => t.id !== sourceTask.id)
                );
                queryClient.setQueryData<Task[]>([destinationTask.status.title], (old = []) => [
                    ...(old || []),
                    sourceTask,
                ]);
            }

            return { prevSource, prevDest };
        },
        onError: (err, variables, context) => {
            const { sourceTask, destinationTask } = variables as {
                sourceTask: Task;
                destinationTask: Task;
                updatedTask: Task;
            };
            queryClient.setQueryData([sourceTask.status.id], context?.prevSource);
            queryClient.setQueryData([destinationTask.status.id], context?.prevDest);
        },
        onSettled: (variables) => {
            const { sourceTask, destinationTask } = variables;
            console.log(sourceTask)
            console.log(destinationTask)

            if (sourceTask.status.id === destinationTask.status.id) {
                queryClient.invalidateQueries({ queryKey: [sourceTask.status.title] })
            } else {
                queryClient.invalidateQueries({ queryKey: [sourceTask.status.title] })
                queryClient.invalidateQueries({ queryKey: [destinationTask.status.title] })
            }
        },
    })

    const onDragEnd: OnDragEndResponder = (result: DropResult) => {
        const { source, destination } = result;

        if (!destination) {
            return;
        }

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        const sourceStatus = source.droppableId as ColumnId;
        const destinationStatus = destination.droppableId as ColumnId;
        const sourceTask = tasks[sourceStatus][source.index];
        const destinationTask = tasks[destinationStatus][destination.index] ?? {
            id: null,
            title: null,
            description: null,
            doBy: null,
            taskIndex: destination.index,
            status: {
                id: mapStatus(destinationStatus),
                title: destinationStatus
            }
        };

        const updatedTask = {
            ...sourceTask,
            taskIndex: destination.index,
            status: destinationTask?.status ?? {
                id: mapStatus(destinationStatus),
                title: destinationStatus
            }
        }

        updateMutation.mutate({ sourceTask, destinationTask, updatedTask })
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex justify-center">
                <div className="grid w-[900px] grid-cols-3 gap-4">
                    <TaskColumn status="To do" tasks={tasks["To do"]} />
                    <TaskColumn status="Doing" tasks={tasks["Doing"]} />
                    <TaskColumn status="Done" tasks={tasks["Done"]} />
                </div>
            </div>
        </DragDropContext>
    )
}