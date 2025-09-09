"use client";

import { setCookie } from "cookies-next"
import { useRouter } from "next/navigation";

import { RegisterForm } from "@/features/auth/components/register-form"

export default function Page() {
  const router = useRouter();

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <RegisterForm
          onSuccess={(accessToken) => {
            setCookie('accessToken', accessToken, { maxAge: 60 * 15 });
            router.push("/dashboard/tasks");
          }}
        />
      </div>
    </div>
  )
}