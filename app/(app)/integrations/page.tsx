import type { Metadata } from "next";
import { ProbeTracked } from "@/components/ProbeTracked";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ExternalLink, Plus } from "lucide-react";
import { intercomConfig } from "@/lib/mocks/intercom";
import { notionConfig } from "@/lib/mocks/notion";

export const metadata: Metadata = { title: "Integrations" };

const connectedIntegrations = [
  {
    id: "stripe",
    name: "Stripe",
    description: "Payments, subscriptions, and invoicing",
    logo: "/logos/stripe.svg",
    connectedAs: "acme_corp",
    connectedAt: "2025-02-14",
    docsUrl: "#",
  },
  {
    id: "intercom",
    name: "Intercom",
    description: "Customer messaging and support",
    logo: "/logos/intercom.svg",
    connectedAs: intercomConfig.connectedUser,
    connectedAt: "2025-03-05",
    docsUrl: "#",
  },
  {
    id: "notion",
    name: "Notion",
    description: "Docs and wikis for your team",
    logo: "/logos/notion.svg",
    connectedAs: notionConfig.connectedUser,
    connectedAt: "2025-04-01",
    docsUrl: "#",
  },
];

const availableIntegrations = [
  { id: "slack", name: "Slack", description: "Send alerts and updates to Slack channels", category: "Messaging" },
  { id: "hubspot", name: "HubSpot", description: "Sync contacts and deals with your CRM", category: "CRM" },
  { id: "salesforce", name: "Salesforce", description: "Enterprise CRM and sales pipeline", category: "CRM" },
  { id: "jira", name: "Jira", description: "Link issues to customer accounts", category: "Project management" },
  { id: "zendesk", name: "Zendesk", description: "Customer support tickets and SLAs", category: "Support" },
  { id: "datadog", name: "Datadog", description: "Infrastructure and application monitoring", category: "Monitoring" },
  { id: "segment", name: "Segment", description: "Customer data platform and analytics", category: "Analytics" },
  { id: "mixpanel", name: "Mixpanel", description: "Product analytics and funnels", category: "Analytics" },
  { id: "brevo", name: "Brevo", description: "Email marketing and automation", category: "Email" },
];

const categories = [...new Set(availableIntegrations.map((i) => i.category))];

function InitialAvatar({ name }: { name: string }) {
  return (
    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-sm font-semibold">
      {name.slice(0, 2)}
    </div>
  );
}

export default function IntegrationsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
      {/* Header */}
      <ProbeTracked changeId="integrations-hero">
        <div>
          <h1 className="font-serif text-3xl tracking-tight leading-tight">Integrations</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Connect your stack to unlock automation and deeper insights.
          </p>
        </div>
      </ProbeTracked>

      {/* Connected */}
      <ProbeTracked changeId="integrations-connected">
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Connected</h2>
            <Badge className="rounded-full text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              {connectedIntegrations.length} active
            </Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {connectedIntegrations.map((integration) => (
              <div
                key={integration.id}
                className="rounded-xl border border-border bg-card shadow-[var(--shadow-xs)] p-5 flex flex-col gap-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <InitialAvatar name={integration.name} />
                    <div>
                      <p className="font-medium text-sm">{integration.name}</p>
                      <p className="text-xs text-muted-foreground">{integration.description}</p>
                    </div>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                </div>
                <div className="text-xs text-muted-foreground space-y-0.5">
                  <p>Connected as <span className="font-mono">{integration.connectedAs}</span></p>
                  <p>Since {integration.connectedAt}</p>
                </div>
                <div className="flex items-center gap-2 mt-auto">
                  <Button variant="outline" size="sm" className="flex-1">Configure</Button>
                  <Button variant="outline" size="icon" aria-label="Docs">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </ProbeTracked>

      {/* Available */}
      <ProbeTracked changeId="integrations-available">
        <section className="space-y-6">
          <h2 className="text-lg font-semibold">Available integrations</h2>
          {categories.map((category) => (
            <div key={category} className="space-y-3">
              <h3 className="text-xs font-semibold text-muted-foreground tracking-widest uppercase">{category}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableIntegrations.filter((i) => i.category === category).map((integration) => (
                  <div
                    key={integration.id}
                    className="rounded-xl border border-border bg-card shadow-[var(--shadow-xs)] p-5 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <InitialAvatar name={integration.name} />
                      <div className="min-w-0">
                        <p className="font-medium text-sm">{integration.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{integration.description}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="shrink-0">
                      <Plus className="h-3.5 w-3.5 mr-1" /> Connect
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      </ProbeTracked>
    </div>
  );
}
