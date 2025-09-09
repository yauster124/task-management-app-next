"use client"

import { Loader2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { LoginInput, loginInputSchema, useLogin } from "@/lib/auth"
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link"

type LoginFormProps = {
    onSuccess: (token: string) => void;
};

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
    const login = useLogin({
        onSuccess
    })

    const form = useForm<LoginInput>({
        resolver: zodResolver(loginInputSchema),
        defaultValues: {
            username: "",
            password: ""
        }
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Login to your account</CardTitle>
                <CardDescription>
                    Enter your email below to login to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit((values) => { login.mutate(values) })} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {login.isPending ? (
                            <Button className="w-full" disabled>
                                <Loader2Icon className="animate-spin" />
                                Please wait
                            </Button>
                        ) : (
                            <Button type="submit" className="w-full">
                                Login
                            </Button>
                        )}
                    </form>
                </Form>
                <div className="flex justify-center mt-4 ">
                    <Button variant="link" asChild>
                        <Link href="/register">
                            Don&apos;t have an account?
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
