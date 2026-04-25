"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Plug,
  Rocket,
  Settings,
  ChevronDown,
  ChevronRight,
  LogOut,
  User,
  Keyboard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/integrations", label: "Integrations", icon: Plug },
  { href: "/onboarding", label: "Onboarding", icon: Rocket },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 bg-sidebar border-r border-sidebar-border h-screen sticky top-0 z-30">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-sidebar-border">
        {/* Teal rounded-square mark */}
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect width="28" height="28" rx="7" fill="oklch(0.42 0.08 175)" />
          <path d="M9 14.5L12.5 18L19 10" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="font-serif italic text-xl tracking-tight text-sidebar-foreground">Acme</span>
      </div>

      {/* Workspace switcher */}
      <div className="px-3 pt-3 pb-1">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full flex items-center justify-between px-2 py-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring">
            <span className="font-medium truncate">Acme Corp · Growth</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-52">
            <DropdownMenuItem className="font-medium">
              Acme Corp · Growth
              <span className="ml-auto text-xs text-primary">Current</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Acme Labs · Free</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-muted-foreground">
              + Create workspace
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-2 py-2 rounded-md text-sm transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" strokeWidth={1.5} />
              {label}
              {isActive && <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-50" />}
            </Link>
          );
        })}
      </nav>

      {/* User pill */}
      <div className="px-3 py-3 border-t border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full flex items-center gap-2.5 px-2 py-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold shrink-0 text-foreground">
              JL
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium truncate text-sidebar-foreground">Jamie Lee</p>
              <p className="text-xs text-muted-foreground">Admin</p>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <User className="h-4 w-4 mr-2" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Keyboard className="h-4 w-4 mr-2" /> Keyboard shortcuts
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <LogOut className="h-4 w-4 mr-2" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
