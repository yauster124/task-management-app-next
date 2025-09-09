"use client";

import { setCookie } from "cookies-next"
import { useRouter } from "next/navigation";

import { LoginForm } from "@/features/auth/components/login-form"

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm onSuccess={(accessToken) => {
          setCookie('accessToken', accessToken, { maxAge: 60 * 15 });
          router.push("/dashboard/tasks");
        }} />
      </div>
    </div>
  )
}