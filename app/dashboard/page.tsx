import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const stats = [
  { title: "Active users", value: "1,248" },
  { title: "Revenue (MRR)", value: "$48.9k" },
  { title: "Open tickets", value: "23" },
];

const recentActivity = [
  { id: 1, description: "Jamie Lee updated the billing address", timestamp: "2 hours ago" },
  { id: 2, description: "Sam Kim invited 3 new team members", timestamp: "5 hours ago" },
  { id: 3, description: "Alex Rivera closed ticket #1042", timestamp: "1 day ago" },
  { id: 4, description: "Morgan Chen exported the Q1 report", timestamp: "2 days ago" },
  { id: 5, description: "Taylor Nguyen enabled SSO for the workspace", timestamp: "3 days ago" },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
          Dashboard
        </h1>
        <p className="mt-2 text-zinc-500">
          Overview of your workspace activity and key metrics.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-500">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold text-zinc-900">
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10">
          <h2 className="text-lg font-medium text-zinc-900">Recent activity</h2>
          <div className="mt-4 divide-y divide-zinc-200 rounded-lg border border-zinc-200 bg-white">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-zinc-700">{item.description}</span>
                <span className="text-xs text-zinc-400">{item.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
