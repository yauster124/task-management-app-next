import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/ui/date-picker"
import { TaskForm } from "@/app/dashboard/tasks/api/types"
import { useForm, SubmitHandler, Controller } from "react-hook-form"

export default function UIEditTaskDialog({ onContinue, trigger, task }: { onContinue: (data: TaskForm) => void, trigger: React.ReactNode, task: TaskForm }) {
    const { control, register, handleSubmit } = useForm<TaskForm>({
        defaultValues: task
    })

    const onFormSubmit: SubmitHandler<TaskForm> = (data) => {
        onContinue(data)
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit(onFormSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Edit task</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" {...register("title")} />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" {...register("description")} />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="doBy">Do by date</Label>
                            <Controller
                                name="doBy"
                                control={control}
                                render={({ field }) => (
                                    <DatePicker
                                        id="doBy"
                                        value={
                                            field.value && typeof field.value === "string"
                                                ? new Date(field.value)
                                                : undefined
                                        }
                                        onChange={(date) =>
                                            field.onChange(date ? date.toISOString() : "")
                                        }
                                    />
                                )}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>

        </Dialog>
    )
}