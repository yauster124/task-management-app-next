"use client";

import { useStatuses } from "@/features/statuses/api/get-statuses";

import { TaskColumn } from "./task-column";
import { useTasks } from "../api/get-tasks";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useTasksStore } from "../store/tasks-store";
import { useMoveTask } from "../api/move-task";
import { SkeletonCard } from "@/components/ui/skeleton-card";
import { Task } from "@/types/api";
import _ from "lodash";
import { useEffect } from "react";

export const TaskBoard = () => {
    const statusesQuery = useStatuses();
    const statuses = statusesQuery.data;

    const tasksQuery = useTasks();
    const moveTaskMutation = useMoveTask();

    const columns = useTasksStore((s) => s.columns);
    const setColumns = useTasksStore((state) => state.setColumns);
    useEffect(() => {
        if (tasksQuery.isSuccess) setColumns(tasksQuery.data);
    }, [tasksQuery.data])

    console.log("CYCLE: ", {
        "COLUMNS": columns,
        "FETCHED COLUMNS": tasksQuery.data,
        "QUERY": tasksQuery
    });

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;
        if (source.droppableId === destination?.droppableId && source.index === destination.index) return;

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

    return (
        <>
            {
                tasksQuery.isPending ? (
                    <SkeletonCard />
                ) : tasksQuery.isError ? (
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