"use client";

import { useStatuses } from "@/features/statuses/api/get-statuses";

import { TaskColumn } from "./task-column";
import { useTasks } from "../api/get-tasks";
import { DragDropContext } from "@hello-pangea/dnd";

export const TaskBoard = () => {
    const statusesQuery = useStatuses();
    const statuses = statusesQuery.data;

    const tasksQueries = useTasks({ statuses });

    const onDragEnd = () => {
        
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex justify-center">
                <div className="grid w-[900px] grid-cols-3 gap-4">
                    {tasksQueries.map((query, index) => {
                        const status = statuses?.[index];
                        if (!status) {
                            return null;
                        }

                        const tasks = query.data || [];

                        return (
                            <TaskColumn
                                key={status.id}
                                status={status}
                                tasks={tasks}
                            />
                        )
                    })}
                </div>
            </div>
        </DragDropContext>
    )
}