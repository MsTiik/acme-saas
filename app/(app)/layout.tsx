import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/AppSidebar";
import { AppTopbar } from "@/components/AppTopbar";
import { ProbeTracked } from "@/components/ProbeTracked";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider delay={300}>
      <div className="flex h-screen overflow-hidden bg-background">
        <AppSidebar />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <AppTopbar />
          <ProbeTracked changeId="app-main">
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </ProbeTracked>
        </div>
        <Toaster richColors position="bottom-right" />
      </div>
    </TooltipProvider>
  );
}
