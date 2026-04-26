import type { Metadata } from "next";
import { ProbeTracked } from "@/components/ProbeTracked";

export const metadata: Metadata = { title: "Activity" };

const activityItems = [
  { id: 1, user: "Jamie Lee", initials: "JL", action: "deployed v2.4.1 to production", time: "12 min ago", category: "Deploy" },
  { id: 2, user: "Sam Kim", initials: "SK", action: "invited 3 new team members to the workspace", time: "1 hour ago", category: "Team" },
  { id: 3, user: "Alex Rivera", initials: "AR", action: "closed ticket #1042 — customer billing issue", time: "2 hours ago", category: "Support" },
  { id: 4, user: "Morgan Chen", initials: "MC", action: "exported the Q1 revenue report", time: "3 hours ago", category: "Reports" },
  { id: 5, user: "Taylor Nguyen", initials: "TN", action: "enabled SSO for the workspace", time: "5 hours ago", category: "Security" },
  { id: 6, user: "Jordan Patel", initials: "JP", action: "updated the billing address for Acme Corp", time: "6 hours ago", category: "Billing" },
  { id: 7, user: "Casey Brooks", initials: "CB", action: "merged PR #287 into main — API pagination fix", time: "8 hours ago", category: "Code" },
  { id: 8, user: "Riley Torres", initials: "RT", action: "created project Alpha-3 with 14 initial tasks", time: "1 day ago", category: "Projects" },
  { id: 9, user: "Avery Quinn", initials: "AQ", action: "archived project Legacy CRM after migration", time: "1 day ago", category: "Projects" },
  { id: 10, user: "Drew Santos", initials: "DS", action: "connected the Notion integration", time: "2 days ago", category: "Integrations" },
  { id: 11, user: "Jamie Lee", initials: "JL", action: "updated the onboarding checklist configuration", time: "2 days ago", category: "Settings" },
  { id: 12, user: "Sam Kim", initials: "SK", action: "resolved 5 open support tickets in batch", time: "3 days ago", category: "Support" },
];

const categoryColors: Record<string, string> = {
  Deploy: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Team: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Support: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Reports: "bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  Security: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Billing: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Code: "bg-primary/10 text-primary",
  Projects: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Integrations: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Settings: "bg-muted text-muted-foreground",
};

export default function ActivityPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <ProbeTracked changeId="activity-hero">
        <div>
          <h1 className="font-serif text-3xl tracking-tight leading-tight">Activity</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            A log of recent actions across your workspace.
          </p>
        </div>
      </ProbeTracked>

      <div className="rounded-xl border border-border bg-card shadow-[var(--shadow-xs)]">
        {activityItems.map((item, index) => (
          <div
            key={item.id}
            className={`flex items-start gap-3 px-4 py-3 ${index !== activityItems.length - 1 ? "border-b border-border" : ""}`}
          >
            <div className="mt-0.5 h-7 w-7 shrink-0 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold text-foreground">
              {item.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">
                <span className="font-medium">{item.user}</span>{" "}
                {item.action}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{item.time}</span>
                <span className="text-xs text-muted-foreground">&middot;</span>
                <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${categoryColors[item.category] ?? "bg-muted text-muted-foreground"}`}>
                  {item.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
