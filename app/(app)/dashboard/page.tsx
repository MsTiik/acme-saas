import type { Metadata } from "next";
import { ProbeTracked } from "@/components/ProbeTracked";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";
import { mockActivityFeed } from "@/lib/mocks/team";
import { ArrowUpRight, Save } from "lucide-react";
import { DashboardDialogs } from "@/components/DashboardDialogs";
import { notionConfig } from "@/lib/mocks/notion";

export const metadata: Metadata = { title: "Dashboard" };

const DEMO_DATE = "Saturday, April 25, 2026";

const kpis = [
  {
    label: "Monthly Recurring Revenue",
    value: "$48,920",
    delta: "+12.4% MoM",
    positive: true,
    sparkline: [32, 35, 33, 38, 40, 37, 42, 44, 43, 46, 45, 49],
  },
  {
    label: "Active Customers",
    value: "1,248",
    delta: "+86 this month",
    positive: true,
    sparkline: [1100, 1120, 1110, 1140, 1160, 1150, 1180, 1190, 1200, 1210, 1230, 1248],
  },
  {
    label: "Trial Conversions",
    value: "23.4%",
    delta: "+3.1pp vs last month",
    positive: true,
    sparkline: [18, 19, 20, 18, 21, 22, 20, 22, 23, 21, 23, 23.4],
  },
  {
    label: "Churn Rate",
    value: "1.8%",
    delta: "-0.3pp vs last month",
    positive: false,
    churnGreen: true,
    sparkline: [2.8, 2.6, 2.5, 2.4, 2.6, 2.3, 2.2, 2.1, 2.0, 2.0, 1.9, 1.8],
  },
];

const revenueMonths = ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];
const revenueData = [28000, 31000, 33000, 35000, 34000, 37000, 39000, 41000, 40000, 44000, 47000, 49000];

const topIntegrations = [
  { name: "Slack", usage: 92, events: "18.2k" },
  { name: "Notion", usage: 74, events: "12.1k" },
  { name: "Stripe", usage: 68, events: "9.8k" },
  { name: "Intercom", usage: 51, events: "6.4k" },
  { name: "GitHub", usage: 39, events: "4.1k" },
];

const categoryColors: Record<string, string> = {
  Billing: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Team: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Security: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Product: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

function Sparkline({ data, positive }: { data: number[]; positive?: boolean }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 60;
  const h = 20;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");
  const color = positive === false ? "oklch(0.65 0.15 145)" : "oklch(0.42 0.08 175)";
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={pts} />
    </svg>
  );
}

function RevenueChart() {
  const maxVal = Math.max(...revenueData);
  const w = 480;
  const h = 160;
  const padL = 0;
  const padB = 24;
  const chartW = w - padL;
  const chartH = h - padB;
  const gridLines = [0.25, 0.5, 0.75, 1];

  const pts = revenueData
    .map((v, i) => {
      const x = padL + (i / (revenueData.length - 1)) * chartW;
      const y = chartH - (v / maxVal) * chartH;
      return `${x},${y}`;
    })
    .join(" ");

  const areaPath = `M${padL},${chartH} ${revenueData
    .map((v, i) => {
      const x = padL + (i / (revenueData.length - 1)) * chartW;
      const y = chartH - (v / maxVal) * chartH;
      return `L${x},${y}`;
    })
    .join(" ")} L${padL + chartW},${chartH} Z`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="w-full"
      style={{ height: h }}
      aria-label="12-month revenue trend"
    >
      <defs>
        <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.42 0.08 175)" stopOpacity="0.12" />
          <stop offset="100%" stopColor="oklch(0.42 0.08 175)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {gridLines.map((ratio) => (
        <line
          key={ratio}
          x1={padL}
          y1={chartH * (1 - ratio)}
          x2={padL + chartW}
          y2={chartH * (1 - ratio)}
          stroke="oklch(0.91 0.008 85)"
          strokeWidth="1"
        />
      ))}
      <path d={areaPath} fill="url(#chartFill)" />
      <polyline fill="none" stroke="oklch(0.42 0.08 175)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={pts} />
      {revenueMonths.map((month, i) => {
        const x = padL + (i / (revenueData.length - 1)) * chartW;
        return (
          <text key={month} x={x} y={h - 4} textAnchor="middle" fontSize="10" fill="oklch(0.50 0.012 70)">
            {month}
          </text>
        );
      })}
    </svg>
  );
}

async function isFeatureEnabled(flag: string): Promise<boolean> {
  return process.env[`FF_${flag.toUpperCase()}`] === "true";
}

async function saveFilterToNotion(formData: FormData) {
  "use server";

  const filterState = formData.get("filterState") as string;
  const timestamp = new Date().toISOString();

  const note = {
    parent: { database_id: "customer-activities" },
    properties: {
      title: `Dashboard filter snapshot – ${new Date().toLocaleDateString()}`,
      filters: JSON.parse(filterState),
      workspace: notionConfig.workspaceId,
      createdAt: timestamp,
      createdBy: notionConfig.connectedEmail,
    },
  };

  console.log("[Notion] Saved filter view:", JSON.stringify(note));
}

export default async function DashboardPage() {
  const notionFilterSave = await isFeatureEnabled("notion_filter_save_minimal");

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-10">
      {/* Hero */}
      <ProbeTracked changeId="dashboard-hero">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl tracking-tight leading-tight">Good morning, Jamie</h1>
            <p className="mt-1 text-sm text-muted-foreground">{DEMO_DATE}</p>
          </div>
          <div className="flex items-center gap-2">
            {notionFilterSave && (
              <form action={saveFilterToNotion}>
                <input
                  type="hidden"
                  name="filterState"
                  value={JSON.stringify({
                    view: "dashboard",
                    kpis: kpis.map((k) => k.label),
                    date: DEMO_DATE,
                  })}
                />
                <Button type="submit" variant="outline" size="sm">
                  <Save className="h-3.5 w-3.5 mr-1.5" />
                  Save to Notion
                </Button>
              </form>
            )}
            <DashboardDialogs />
          </div>
        </div>
      </ProbeTracked>

      {/* KPI Strip */}
      <ProbeTracked changeId="dashboard-kpis">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <Card key={kpi.label} className="border shadow-[var(--shadow-xs)] hover:shadow-[var(--shadow-sm)] transition-shadow">
              <CardContent className="p-5">
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
                <p className="mt-1 font-mono tabular-nums text-2xl font-semibold">{kpi.value}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-xs">
                    <span
                      className="inline-block h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: kpi.churnGreen ? "oklch(0.65 0.15 145)" : kpi.positive ? "oklch(0.65 0.15 145)" : "oklch(0.55 0.20 25)" }}
                    />
                    <span className="text-muted-foreground">{kpi.delta}</span>
                  </span>
                  <Sparkline data={kpi.sparkline} positive={!kpi.churnGreen && kpi.positive} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ProbeTracked>

      {/* Revenue Chart + Top Integrations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border shadow-[var(--shadow-xs)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Revenue trend</CardTitle>
            <p className="text-xs text-muted-foreground">Last 12 months · USD</p>
          </CardHeader>
          <CardContent className="pt-0">
            <RevenueChart />
          </CardContent>
        </Card>

        <Card className="border shadow-[var(--shadow-xs)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Top integrations</CardTitle>
            <p className="text-xs text-muted-foreground">By usage this month</p>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {topIntegrations.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.name}</span>
                  <span className="font-mono tabular-nums text-xs text-muted-foreground">{item.events} events</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${item.usage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      <ProbeTracked changeId="dashboard-activity">
        <Card className="border shadow-[var(--shadow-xs)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 divide-y divide-border">
            {mockActivityFeed.map((item) => (
              <div key={item.id} className="flex items-start gap-3 py-3 hover:bg-muted/40 px-1 rounded-sm transition-colors">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold shrink-0">
                  {item.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{item.user}</span>{" "}
                    <span className="text-muted-foreground">{item.action}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{formatRelativeTime(item.timestamp)}</p>
                </div>
                <Badge className={`text-xs rounded-full px-2 py-0.5 font-medium shrink-0 ${categoryColors[item.category]}`}>
                  {item.category}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </ProbeTracked>

      {/* Upsell Banner */}
      <ProbeTracked changeId="dashboard-upsell">
        <div className="rounded-2xl border border-border bg-muted/50 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-medium text-base">Connect your data warehouse</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Unlock cohort analytics, retention curves, and revenue attribution by syncing your data warehouse.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button size="sm">
              <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
              Get started
            </Button>
            <Button variant="outline" size="sm">Learn more</Button>
          </div>
        </div>
      </ProbeTracked>
    </div>
  );
}
