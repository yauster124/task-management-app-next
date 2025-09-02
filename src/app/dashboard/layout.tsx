import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu"
import Link from "next/link"
import { ModeToggle } from "@/components/ui/dark-mode-toggle"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <nav className="sticky top-0 z-50 w-full border-b bg-background">
                <div className="flex items-center justify-between px-4 h-14">
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                    <Link href="/dashboard/tasks">Home</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                    <ModeToggle />
                </div>
            </nav>

            {/* Page content */}
            <main className="flex-1 p-4">
                {children}
            </main>
        </div>
    )
}