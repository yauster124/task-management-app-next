import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export const SkeletonCard = () => {
    return (
        <Card>
            <CardHeader className="relative flex justify-between items-start">
                <CardTitle>
                    <Skeleton className="h-5 w-[150px]" />
                </CardTitle>

                <Button variant="ghost" size="icon" disabled>
                    <Skeleton className="h-5 w-5 rounded-full" />
                </Button>
            </CardHeader>

            <CardContent>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            </CardContent>

            <CardFooter>
                <Skeleton className="h-4 w-[100px]" />
            </CardFooter>
        </Card>
    )
}