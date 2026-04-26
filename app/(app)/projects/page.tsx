import type { Metadata } from "next";
import { ProbeTracked } from "@/components/ProbeTracked";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const metadata: Metadata = { title: "Projects" };

const projects = [
  { name: "Website Redesign", status: "Active", owner: "Jamie Lee", tasks: 24, progress: 68, updated: "2 hours ago" },
  { name: "Mobile App v3", status: "Active", owner: "Sam Kim", tasks: 18, progress: 42, updated: "4 hours ago" },
  { name: "API Migration", status: "Active", owner: "Alex Rivera", tasks: 31, progress: 85, updated: "1 day ago" },
  { name: "Analytics Dashboard", status: "Planning", owner: "Morgan Chen", tasks: 12, progress: 15, updated: "1 day ago" },
  { name: "Customer Portal", status: "Active", owner: "Taylor Nguyen", tasks: 9, progress: 55, updated: "2 days ago" },
  { name: "Data Pipeline", status: "Review", owner: "Jordan Patel", tasks: 7, progress: 92, updated: "2 days ago" },
  { name: "Onboarding Flow", status: "Active", owner: "Casey Brooks", tasks: 14, progress: 38, updated: "3 days ago" },
  { name: "Billing Module", status: "Completed", owner: "Riley Torres", tasks: 20, progress: 100, updated: "5 days ago" },
  { name: "Search Indexer", status: "Planning", owner: "Avery Quinn", tasks: 6, progress: 0, updated: "1 week ago" },
  { name: "Email Templates", status: "Active", owner: "Drew Santos", tasks: 11, progress: 72, updated: "1 week ago" },
];

const statusColors: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Completed: "bg-primary/10 text-primary",
  Review: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Planning: "bg-muted text-muted-foreground",
};

export default function ProjectsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <ProbeTracked changeId="projects-hero">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl tracking-tight leading-tight">Projects</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {projects.length} projects across your workspace
            </p>
          </div>
          <Button size="sm">
            <Plus className="h-3.5 w-3.5 mr-1.5" /> New project
          </Button>
        </div>
      </ProbeTracked>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.name} className="shadow-[var(--shadow-xs)]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  {project.name}
                </CardTitle>
                <Badge
                  className={statusColors[project.status] ?? "bg-muted text-muted-foreground"}
                >
                  {project.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{project.owner}</span>
                  <span>{project.tasks} tasks</span>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted">
                    <div
                      className="h-1.5 rounded-full bg-primary transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Updated {project.updated}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
