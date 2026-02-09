"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
    Bell,
    CircleUser,
    Home,
    LineChart,
    Menu,
    Package,
    Package2,
    Search,
    ShoppingCart,
    Users,
    Settings,
    Mail,
    FileText,
    LayoutDashboard
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const navItems = [
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { label: "Inbox", href: "/dashboard/inbox", icon: Mail, badge: "6" },
        { label: "Objednávky", href: "/dashboard/orders", icon: Package },
        { label: "Zákazníci", href: "/dashboard/customers", icon: Users },
        { label: "Audit Log", href: "/dashboard/audit", icon: FileText },
        { label: "Nastavenia", href: "/dashboard/settings", icon: Settings },
    ];


    const isActive = (href: string) => {
        if (href === "/dashboard" && pathname === "/dashboard") return true;
        if (href !== "/dashboard" && pathname === href) return true;
        if (href !== "/dashboard" && href !== "/dashboard/settings" && pathname.startsWith(href)) return true;
        return false;
    };

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                            <Package2 className="h-6 w-6 text-primary" />
                            <span className="text-xl tracking-tight">Mirka AI</span>
                        </Link>
                        <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
                            <Bell className="h-4 w-4" />
                            <span className="sr-only">Toggle notifications</span>
                        </Button>
                    </div>
                    <div className="flex-1">
                        <nav className="grid items-start px-2 text-sm font-medium lg:px-4 space-y-1 mt-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                        isActive(item.href)
                                            ? "bg-primary/10 text-primary font-semibold"
                                            : "text-muted-foreground"
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.label}
                                    {item.badge && (
                                        <span className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="shrink-0 md:hidden"
                            >
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col">
                            <nav className="grid gap-2 text-lg font-medium">
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-2 text-lg font-semibold mb-4"
                                >
                                    <Package2 className="h-6 w-6 text-primary" />
                                    <span>Mirka AI</span>
                                </Link>
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 transition-all hover:text-foreground",
                                            isActive(item.href)
                                                ? "bg-muted text-foreground font-semibold"
                                                : "text-muted-foreground"
                                        )}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        {item.label}
                                        {item.badge && (
                                            <span className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                                                {item.badge}
                                            </span>
                                        )}
                                    </Link>
                                ))}
                            </nav>
                        </SheetContent>
                    </Sheet>
                    <div className="w-full flex-1">
                        <form>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Hľadať v e-mailoch..."
                                    className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                                />
                            </div>
                        </form>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon" className="rounded-full overflow-hidden border">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>M</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Môj účet</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/settings">Nastavenia</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Podpora</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Odhlásiť</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-zinc-50/50">
                    {children}
                </main>
            </div>
        </div>
    );
}

