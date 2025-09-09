"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useLogout } from "@/lib/auth";

export default function SettingsPage() {
    const logout = useLogout();

    return (
        <div className="max-w-xl mx-auto p-6 space-y-6">
            <h1>Settings</h1>
            <Card className="rounded-2xl shadow-md">
                <CardHeader>
                    <CardTitle className="text-lg">Appearance</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between py-4">
                    
                </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-md">
                <CardHeader>
                    <CardTitle className="text-lg">Account</CardTitle>
                </CardHeader>
                <CardContent className="py-4">
                    <Button variant="destructive" className="w-full flex items-center gap-2" onClick={() => logout.mutate()}>
                        Log Out
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}