"use client"

import { useQuery } from "@tanstack/react-query"
import { getTasks } from "@/app/dashboard/tasks/api/actions"
import { Task } from "@/types/api"
import { SkeletonCard } from "@/components/ui/skeleton-card"
import { TaskBoard } from "@/components/ui/task-board"

export default function Tasks() {
    const { isPending: toDoPending, isError: toDoError, data: toDo = [] } = useQuery<Task[]>({
        queryKey: ['To do'],
        queryFn: () => getTasks(1)
    })

    const { isPending: doingPending, isError: doingError, data: doing = [] } = useQuery<Task[]>({
        queryKey: ['Doing'],
        queryFn: () => getTasks(2)
    })

    const { isPending: donePending, isError: doneError, data: done = [] } = useQuery<Task[]>({
        queryKey: ['Done'],
        queryFn: () => getTasks(3)
    })

    return (
        <>
            {
                toDoPending || doingPending || donePending ? (
                    <SkeletonCard />
                ) : toDoError || doingError || doneError ? (
                    <p>Failed to load tasks</p>
                ) : (
                    <TaskBoard tasks={{ "To do": toDo, "Doing": doing, "Done": done }} />
                )
            }
        </>
    )
}