import type { Metadata } from "next";
import { ProbeTracked } from "@/components/ProbeTracked";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { stripeCustomer, stripeInvoices } from "@/lib/mocks/stripe";
import { formatDate } from "@/lib/utils";
import { Download, ArrowUpRight, CreditCard } from "lucide-react";

export const metadata: Metadata = { title: "Billing" };

function UsageBar({ used, limit }: { used: number; limit: number }) {
  const pct = Math.round((used / limit) * 100);
  const warn = pct >= 80;
  return (
    <div className="space-y-1.5">
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${warn ? "bg-amber-500" : "bg-primary"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground">{pct}% used</p>
    </div>
  );
}

function fmtNum(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return String(n);
}

export default function BillingPage() {
  const { seats, apiCalls, storage, paymentMethod, planLabel } = stripeCustomer;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <ProbeTracked changeId="billing-hero">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl tracking-tight leading-tight">Billing</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your plan, usage, and invoices.
            </p>
          </div>
          <Button variant="outline" size="sm">
            <CreditCard className="h-3.5 w-3.5 mr-1.5" /> Manage payment
          </Button>
        </div>
      </ProbeTracked>

      {/* Plan card */}
      <ProbeTracked changeId="billing-plan">
        <Card className="border shadow-[var(--shadow-xs)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Current plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{planLabel}</span>
                  <Badge className="rounded-full text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    Active
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  $499/mo · Renews May 25, 2026
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5 px-3 py-2 border rounded-lg">
                  <div className="h-8 w-12 rounded border bg-muted flex items-center justify-center text-xs font-mono font-semibold">
                    VISA
                  </div>
                  <div>
                    <p className="text-sm font-medium">Visa ···· {paymentMethod.last4}</p>
                    <p className="text-xs text-muted-foreground">
                      Exp {paymentMethod.expMonth}/{paymentMethod.expYear}
                    </p>
                  </div>
                </div>
                <Button size="sm">
                  <ArrowUpRight className="h-3.5 w-3.5 mr-1.5" /> Upgrade
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </ProbeTracked>

      {/* Usage */}
      <ProbeTracked changeId="billing-usage">
        <section className="space-y-3">
          <h2 className="text-base font-semibold">Usage this period</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Seats */}
            <Card className="border shadow-[var(--shadow-xs)]">
              <CardContent className="pt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Seats</p>
                  <p className="text-sm font-mono tabular-nums">
                    {seats.used} / {seats.limit}
                  </p>
                </div>
                <UsageBar used={seats.used} limit={seats.limit} />
              </CardContent>
            </Card>

            {/* API calls */}
            <Card className="border shadow-[var(--shadow-xs)]">
              <CardContent className="pt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">API calls</p>
                  <p className="text-sm font-mono tabular-nums">
                    {fmtNum(apiCalls.used)} / {fmtNum(apiCalls.limit)}
                  </p>
                </div>
                <UsageBar used={apiCalls.used} limit={apiCalls.limit} />
              </CardContent>
            </Card>

            {/* Storage */}
            <Card className="border shadow-[var(--shadow-xs)]">
              <CardContent className="pt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Storage</p>
                  <p className="text-sm font-mono tabular-nums">
                    {storage.usedGb} GB / {storage.limitGb} GB
                  </p>
                </div>
                <UsageBar used={storage.usedGb} limit={storage.limitGb} />
              </CardContent>
            </Card>
          </div>
        </section>
      </ProbeTracked>

      {/* Invoices */}
      <ProbeTracked changeId="billing-invoices">
        <section className="space-y-3">
          <h2 className="text-base font-semibold">Invoice history</h2>
          <Card className="border shadow-[var(--shadow-xs)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {stripeInvoices.map((inv) => (
                  <TableRow key={inv.id} className="hover:bg-muted/40">
                    <TableCell className="pl-6 text-sm">{formatDate(inv.date)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {planLabel} plan — monthly
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums text-sm">
                      ${(inv.amount / 100).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge className="text-xs rounded-full px-2 py-0.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                        Paid
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-4 text-right">
                      <Button variant="ghost" size="icon" aria-label="Download invoice">
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </section>
      </ProbeTracked>

      {/* Upsell */}
      <ProbeTracked changeId="billing-upsell">
        <Card className="border border-primary/20 bg-primary/5 shadow-[var(--shadow-xs)]">
          <CardContent className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-semibold">Ready for Enterprise?</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Unlimited seats, SLA, SSO, and dedicated support — starting at $999/mo.
              </p>
            </div>
            <Button variant="outline" size="sm" className="shrink-0">
              Talk to sales <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </ProbeTracked>
    </div>
  );
}
