"use client";

import { usePathname } from "next/navigation";
import { Search, Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AppSidebar } from "@/components/AppSidebar";

const routeLabels: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/customers": "Customers",
  "/billing": "Billing",
  "/integrations": "Integrations",
  "/onboarding": "Onboarding",
  "/settings": "Settings",
};

export function AppTopbar() {
  const pathname = usePathname();
  const routeLabel = routeLabels[pathname] ?? "Dashboard";

  return (
    <header className="sticky top-0 z-20 h-14 flex items-center gap-4 border-b border-border bg-background/95 px-4 md:px-6">
      {/* Mobile menu */}
      <Sheet>
        <SheetTrigger
          className="md:hidden inline-flex items-center justify-center h-8 w-8 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-60">
          <AppSidebar />
        </SheetContent>
      </Sheet>

      {/* Breadcrumbs */}
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard" className="text-muted-foreground">Workspace</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{routeLabel}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      <div className="relative hidden sm:flex items-center">
        <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search..."
          className="pl-8 pr-12 h-8 w-56 text-sm bg-muted/40 border-border/60"
          readOnly
        />
        <kbd className="absolute right-2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          ⌘K
        </kbd>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="hidden sm:flex">
          Help
        </Button>
        <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}
