import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Comment } from "@/types/api"
import { formatDate } from "date-fns"
import { Calendar } from "lucide-react"

export const ViewComment = ({
    comment
}: {
    comment: Comment
}) => {
    const date = formatDate(new Date(comment.createdAt), "PPP p");

    return (
        <Card className="rounded-2xl shadow-sm border p-4">
            <CardHeader className="flex flex-row items-center gap-3 p-0 mb-2">
                <Avatar>
                    <AvatarFallback>
                        {comment.user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="text-sm font-semibold">
                        {comment.user.username}
                    </CardTitle>
                    <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {date}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0 text-sm leading-relaxed">
                {comment.content}
            </CardContent>
        </Card>
    )
}