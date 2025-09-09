import { Task } from "@/types/api"
import { useDeleteTask } from "../api/delete-task"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger, AlertDialogAction, AlertDialogFooter, AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";

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
                    {deleteTask.isPending ? (
                        <Button disabled>
                            <Loader2Icon className="animate-spin" />
                            Please wait
                        </Button>
                    ) : (
                        <AlertDialogAction
                            onClick={() => deleteTask.mutate({
                                taskId: task.id
                            })}
                        >
                            Continue
                        </AlertDialogAction>
                    )}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}