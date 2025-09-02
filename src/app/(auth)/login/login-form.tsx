"use client"

import { Loader2Icon } from "lucide-react"
import { cn } from "@/lib/utils"
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
import { LoginFormData } from "./api/types"
import { useMutation } from "@tanstack/react-query"
import { loginUser } from "./api/actions"
import { useRouter } from "next/navigation"
import { setCookie } from "cookies-next"

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const router = useRouter()

    const loginMutation = useMutation({
        mutationFn: loginUser,
        onSuccess: (token) => {
            setCookie('token', token, { maxAge: 60 * 60 * 24 });
            router.push("/dashboard/tasks")
        }
    })

    const { register, handleSubmit } = useForm<LoginFormData>()

    const onFormSubmit: SubmitHandler<LoginFormData> = (data) => {
        loginMutation.mutate(data);
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
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
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input id="password" type="password" required {...register("password")} />
                            </div>
                            <div className="flex flex-col gap-3">
                                {loginMutation.isPending ? (
                                    <Button className="w-full" disabled>
                                        <Loader2Icon className="animate-spin" />
                                        Please wait
                                    </Button>
                                ) : (
                                    <Button type="submit" className="w-full">
                                        Login
                                    </Button>
                                )}
                            </div>

                        </div>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Button variant="link" onClick={() => router.push("/register")}>Sign up</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
