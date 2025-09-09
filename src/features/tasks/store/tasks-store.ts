import { Status, Task } from '@/types/api';
import { create } from 'zustand';

type TasksStore = {
    columns: Record<string, Task[]>;
    setColumns: (columns: Record<string, Task[]>) => void;
    moveTask: (task: Task, newStatus: Status, newIndex: number) => void;
}

export const useTasksStore = create<TasksStore>((set) => ({
    columns: {},
    setColumns: (columns) => set({ columns }),
    moveTask: (task, newStatus, newIndex) =>
        set((state) => {
            if (task.status.id != newStatus.id) {
                const sourceTasks = [...(state.columns[task.status.id] ?? [])];
                const destTasks = [...(state.columns[newStatus.id] ?? [])];

                const taskIndex = sourceTasks.findIndex((t) => t.id === task.id);
                if (taskIndex == -1) return state;
                const [movedTask] = sourceTasks.splice(taskIndex, 1);

                destTasks.splice(newIndex, 0, { ...movedTask, status: newStatus });

                const reindexedSource = sourceTasks.map((t, i) => ({ ...t, position: i }));
                const reindexedDest = destTasks.map((t, i) => ({ ...t, position: i }));

                return {
                    columns: {
                        ...state.columns,
                        [task.status.id]: reindexedSource,
                        [newStatus.id]: reindexedDest,
                    },
                };
            } else {
                const tasks = [...(state.columns[newStatus.id] ?? [])];
                const taskIndex = tasks.findIndex((t) => t.id === task.id);
                if (taskIndex == -1) return state;
                const [movedTask] = tasks.splice(taskIndex, 1);
                tasks.splice(newIndex, 0, { ...movedTask, status: newStatus });
                const reindexedtasks = tasks.map((t, i) => ({ ...t, position: i }));

                return {
                    columns: {
                        ...state.columns,
                        [newStatus.id]: reindexedtasks,
                    },
                };
            }
        })
}))