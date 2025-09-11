import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Task } from "@/types/api"
import { DialogTitle } from "@radix-ui/react-dialog"
import { ViewComment } from "./view-comment"
import { CreateComment } from "./create-comment"
import { useUIStore } from "@/components/store/ui-store"

export const CommentsCard = ({
    task,
    trigger
}: {
    task: Task
    trigger: React.ReactNode
}) => {
    const isOpen = useUIStore((s) => s.isOpen(`comments-${task.id}`));
    const { open, close } = useUIStore();

    return (
        <Dialog open={isOpen} onOpenChange={(openValue) => openValue ? open(`comments-${task.id}`) : close(`comments-${task.id}`)}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Comments for {task.title}</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-64 pr-4">
                    <div className="space-y-3">
                        {task.comments.length > 0 ? (
                            task.comments.map((comment) => (
                                <ViewComment key={comment.id} comment={comment} />
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">No comments yet.</p>
                        )}
                    </div>
                </ScrollArea>

                <div className="pt-3 border-t">
                    <CreateComment taskId={task.id} />
                </div>
            </DialogContent>
        </Dialog>
    )
}