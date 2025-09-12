import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Task } from "@/types/api"
import { DialogTitle } from "@radix-ui/react-dialog"
import { ViewComment } from "./view-comment"
import { CreateComment } from "./create-comment"
import { useUIStore } from "@/components/store/ui-store"
import { Separator } from "@/components/ui/separator"

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
                    <DialogTitle className="font-semibold">{task.title}</DialogTitle>
                </DialogHeader>
                <div className="text-sm">
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p>{task.description}</p>
                </div>
                <Separator />
                <h3 className="text-sm font-semibold">Comments</h3>
                <ScrollArea className="h-80 pr-4">
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
                <Separator />
                <CreateComment taskId={task.id} />
            </DialogContent>
        </Dialog>
    )
}