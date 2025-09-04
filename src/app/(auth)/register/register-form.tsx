"use client"

import { Loader2Icon } from "lucide-react"
import { cn } from "@/utils/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm, SubmitHandler } from "react-hook-form"
import { RegisterFormData } from "@/types/api"
import { useMutation } from "@tanstack/react-query"
import { registerUser } from "./api/actions"
import { useRouter } from "next/navigation"
import { setCookie } from "cookies-next"

export function RegisterForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const router = useRouter()

    const registerMutation = useMutation({
        mutationFn: registerUser,
        onSuccess: (token) => {
            setCookie('token', token, { maxAge: 60 * 60 * 24 });
            router.push("/dashboard/tasks")
        }
    })

    const { register, handleSubmit } = useForm<RegisterFormData>()

    const onFormSubmit: SubmitHandler<RegisterFormData> = (data) => {
        registerMutation.mutate(data);
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Create an account</CardTitle>
                    <CardDescription>
                        Enter your email below
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onFormSubmit)}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    {...register("username")}
                                />
                            </div>
                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <Input id="password" type="password" required {...register("password")} />
                            </div>
                            <div className="flex flex-col gap-3">
                                {registerMutation.isPending ? (
                                    <Button className="w-full" disabled>
                                        <Loader2Icon className="animate-spin" />
                                        Please wait
                                    </Button>
                                ) : (
                                    <Button type="submit" className="w-full">
                                        Create account
                                    </Button>
                                )}
                            </div>

                        </div>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Button variant="link" onClick={() => router.push("/login")}>Sign in</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
