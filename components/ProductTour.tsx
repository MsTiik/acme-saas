"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, Plug, CreditCard, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const tourSteps = [
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    description: "Get a real-time overview of your key metrics, revenue trends, and team activity.",
  },
  {
    icon: Users,
    title: "Customers",
    description: "Manage your customer list, track plan status, and view MRR at a glance.",
  },
  {
    icon: Plug,
    title: "Integrations",
    description: "Connect Stripe, Notion, Intercom, and more to power your workflows.",
  },
  {
    icon: CreditCard,
    title: "Billing",
    description: "View your current plan, usage meters, invoices, and upgrade options.",
  },
  {
    icon: Settings,
    title: "Settings",
    description: "Manage workspace details, team members, notifications, and API access.",
  },
];

export default function ProductTour() {
  const [active, setActive] = useState(0);

  return (
    <div className="mt-4 space-y-4">
      {/* Steps */}
      <div className="flex gap-2">
        {tourSteps.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={cn(
              "flex-1 h-1 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              i === active ? "bg-primary" : "bg-border"
            )}
            aria-label={`Step ${i + 1}`}
          />
        ))}
      </div>

      {/* Active step card */}
      {tourSteps.map((step, i) => {
        if (i !== active) return null;
        const Icon = step.icon;
        return (
          <div
            key={step.title}
            className="rounded-xl border-2 border-primary/20 bg-primary/[0.03] p-5 scale-[1.02] transition-transform"
          >
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-medium">{step.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
              </div>
            </div>
          </div>
        );
      })}

      {/* Prev / Next */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          disabled={active === 0}
          onClick={() => setActive((p) => p - 1)}
        >
          Previous
        </Button>
        <span className="text-xs text-muted-foreground">{active + 1} of {tourSteps.length}</span>
        <Button
          size="sm"
          disabled={active === tourSteps.length - 1}
          onClick={() => setActive((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
