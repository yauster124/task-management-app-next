import { Task } from "@/types/api"
import { useDeleteTask } from "../api/delete-task"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger, AlertDialogAction, AlertDialogFooter, AlertDialogHeader } from "@/components/ui/alert-dialog";

export const DeleteTask = ({
    trigger,
    task
}: {
    trigger: React.ReactNode,
    task: Task
}) => {
    const deleteTask = useDeleteTask();

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {trigger}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this task.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => deleteTask.mutate({
                            taskId: task.id,
                            statusId: task.status.id
                        })}
                    >
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}