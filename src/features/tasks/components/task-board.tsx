"use client";

import { useStatuses } from "@/features/statuses/api/get-statuses";

import { TaskColumn } from "./task-column";
import { useTasks } from "../api/get-tasks";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useTasksStore } from "../store/tasks-store";
import { useMoveTask } from "../api/move-task";
import { SkeletonCard } from "@/components/ui/skeleton-card";
import { Task } from "@/types/api";
import { useEffect } from "react";

export const TaskBoard = () => {
    const statusesQuery = useStatuses();
    const statuses = statusesQuery.data;

    const tasksQueries = useTasks({ statuses });
    const moveTaskMutation = useMoveTask();

    const fetchedColumns: Record<string, Task[]> = {};
    const allSuccess = tasksQueries.every(r => r.isSuccess);

    const setColumns = useTasksStore((state) => state.setColumns);
    useEffect(() => {
        statuses?.forEach((status, index) => {
            const query = tasksQueries[index];
            fetchedColumns[status.id] = query.data ?? [];
        });
        setColumns(fetchedColumns);
    }, [allSuccess])

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;
        if (source.droppableId === destination?.droppableId && source.index === destination.index) return;
        console.log(destination?.index)

        const sourceTask = columns[source.droppableId][source.index]

        if (!destination) return;

        const destStatus = statuses?.find((s) => s.id == destination.droppableId);

        if (!destStatus) return;

        useTasksStore.getState().moveTask(
            sourceTask,
            destStatus,
            destination.index
        )

        const updatedTask = {
            ...sourceTask,
            taskIndex: destination.index,
            status: destStatus
        }

        moveTaskMutation.mutate({
            updatedTask: updatedTask,
            sourceStatusId: source.droppableId,
            destStatusId: destination.droppableId
        })
    }

    const columns = useTasksStore((s) => s.columns);

    return (
        <>
            {
                !tasksQueries.every(r => r.isSuccess) ? (
                    <SkeletonCard />
                ) : tasksQueries.some(r => r.isError) ? (
                    <p>Failed to load tasks</p>
                ) : (
                    <DragDropContext onDragEnd={onDragEnd}>
                        <div className="flex justify-center">
                            <div className="grid w-[900px] grid-cols-3 gap-4">
                                {statuses?.map((status) => {
                                    return (
                                        <TaskColumn
                                            key={status.id}
                                            status={status}
                                            tasks={columns[status.id]}
                                        />
                                    )
                                })}
                            </div>
                        </div>
                    </DragDropContext>
                )
            }
        </>
    )
}