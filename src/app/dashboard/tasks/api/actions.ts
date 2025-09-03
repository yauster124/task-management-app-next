"use server"

import { fetchWithAuth } from "@/lib/utilsServer"
import { Task, TaskForm } from "./types"
import { Description } from "@radix-ui/react-dialog"

const API_URL = process.env.API_URL

export async function getTasks(statusId: number) {
    try {
        const res = await fetchWithAuth(`${API_URL}/tasks?statusId=${statusId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            cache: "no-store",
        })

        if (!res.ok) {
            throw new Error("Failed to fetch tasks")
        }

        const data = await res.json()
        return data
    } catch (error) {
        console.error("Error fetching tasks:", error)
        throw new Error("Failed to fetch tasks")
    }
}

export async function getStatuses() {
    try {
        const res = await fetchWithAuth(`${API_URL}/statuses`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-store",
        })

        if (!res.ok) {
            throw new Error("Failed to fetch statuses")
        }

        const data = await res.json()
        return data
    } catch (error) {
        console.error("Error fetching statuses:", error)
        throw new Error("Failed to fetch statuses")
    }
}

export async function updateTask({ id, data }: { id: string; data: TaskForm }) {
    try {
        const res = await fetchWithAuth(`${API_URL}/tasks/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data), // 👈 send TaskForm as JSON
            cache: "no-store",
        });

        if (!res.ok) {
            throw new Error(`Failed to update task: ${res.status} ${res.statusText}`);
        }

        return await res.json(); // 👈 return updated task from backend if available
    } catch (error) {
        console.error("Error updating task:", error);
        throw new Error("Failed to update task");
    }
}

export async function deleteTask(id: string) {
    try {
        const res = await fetchWithAuth(`${API_URL}/tasks/${id}`, {
            method: "DELETE"
        })

        if (!res.ok) {
            throw new Error("Failed to delete tasks")
        }
    } catch (error) {
        console.error("Error deleting tasks:", error)
        throw new Error("Failed to delete tasks")
    }
}

export async function moveTask({ sourceTask, destinationTask }: { sourceTask: Task, destinationTask: Task }) {
    try {
        const updatedTask = {
            id: sourceTask.id,
            title: null,
            description: null,
            doBy: null,
            taskIndex: destinationTask.taskIndex,
            status: destinationTask.status
        }

        const res = await fetchWithAuth(`${API_URL}/tasks/${sourceTask.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedTask),
            cache: "no-store",
        });

        if (!res.ok) {
            throw new Error(`Failed to update task: ${res.status} ${res.statusText}`);
        }

        return await res.json();
    } catch (error) {
        console.error("Error updating task:", error);
        throw new Error("Failed to update task");
    }
}