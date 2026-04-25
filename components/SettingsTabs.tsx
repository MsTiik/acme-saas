"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ProbeTracked } from "@/components/ProbeTracked";
import { mockTeamMembers, mockApiKeys } from "@/lib/mocks/team";
import { stripeInvoices, stripeCustomer } from "@/lib/mocks/stripe";
import { formatRelativeTime, formatDate } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Key, UserPlus, Upload } from "lucide-react";

const roleColors: Record<string, string> = {
  Admin: "bg-primary/10 text-primary",
  Editor: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Viewer: "bg-muted text-muted-foreground",
};

const notifPrefs = [
  { id: "n1", label: "New customer signed up", group: "Customers", default: true },
  { id: "n2", label: "Customer churned", group: "Customers", default: true },
  { id: "n3", label: "Invoice paid", group: "Billing", default: true },
  { id: "n4", label: "Payment failed", group: "Billing", default: true },
  { id: "n5", label: "New team member joined", group: "Team", default: false },
  { id: "n6", label: "Integration connected", group: "Integrations", default: false },
  { id: "n7", label: "Security alert", group: "Security", default: true },
  { id: "n8", label: "Weekly summary digest", group: "Reports", default: false },
];

export function SettingsTabs() {
  const [general, setGeneral] = useState({
    company: "Acme Corp",
    domain: "acme.example.com",
    email: "billing@acme.co",
    timezone: "America/New_York",
  });
  const [dirty, setDirty] = useState(false);
  const [notifs, setNotifs] = useState<Record<string, boolean>>(
    Object.fromEntries(notifPrefs.map((p) => [p.id, p.default]))
  );

  function handleGeneral(field: string, value: string) {
    setGeneral((prev) => ({ ...prev, [field]: value }));
    setDirty(true);
  }

  return (
    <Tabs defaultValue="general">
      <TabsList className="mb-6">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="members">Members</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="api">API keys</TabsTrigger>
      </TabsList>

      {/* General */}
      <TabsContent value="general">
        <ProbeTracked changeId="settings-general">
          <div className="max-w-2xl space-y-6">
            <Card className="border shadow-[var(--shadow-xs)]">
              <CardHeader>
                <CardTitle>General</CardTitle>
                <CardDescription>Basic workspace information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="s-company">Company name</Label>
                  <Input id="s-company" value={general.company} onChange={(e) => handleGeneral("company", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="s-domain">Workspace domain</Label>
                  <Input id="s-domain" value={general.domain} onChange={(e) => handleGeneral("domain", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="s-email">Billing email</Label>
                  <Input id="s-email" type="email" value={general.email} onChange={(e) => handleGeneral("email", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="s-tz">Timezone</Label>
                  <Input id="s-tz" value={general.timezone} onChange={(e) => handleGeneral("timezone", e.target.value)} />
                </div>
                <Button disabled={!dirty} onClick={() => setDirty(false)}>
                  Save changes
                </Button>
              </CardContent>
            </Card>

            {/* Logo upload */}
            <Card className="border shadow-[var(--shadow-xs)]">
              <CardHeader>
                <CardTitle>Workspace logo</CardTitle>
                <CardDescription>Appears in emails and shared pages.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center gap-3 text-center">
                  <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Drop your logo here</p>
                    <p className="text-xs text-muted-foreground">PNG or SVG, up to 1 MB</p>
                  </div>
                  <Button variant="outline" size="sm">Browse files</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </ProbeTracked>
      </TabsContent>

      {/* Members */}
      <TabsContent value="members">
        <ProbeTracked changeId="settings-members">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{mockTeamMembers.length} members</p>
              <Button size="sm">
                <UserPlus className="h-3.5 w-3.5 mr-1.5" /> Invite member
              </Button>
            </div>
            <Card className="border shadow-[var(--shadow-xs)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Last active</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTeamMembers.map((member) => (
                    <TableRow key={member.id} className="hover:bg-muted/40">
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold shrink-0">
                            {member.initials}
                          </div>
                          <span className="font-medium text-sm">{member.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{member.email}</TableCell>
                      <TableCell>
                        <Badge className={`text-xs rounded-full px-2 py-0.5 ${roleColors[member.role]}`}>
                          {member.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatRelativeTime(member.lastActive)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        </ProbeTracked>
      </TabsContent>

      {/* Billing */}
      <TabsContent value="billing">
        <ProbeTracked changeId="settings-billing">
          <div className="max-w-2xl space-y-6">
            {/* Current plan */}
            <Card className="border shadow-[var(--shadow-xs)]">
              <CardHeader>
                <CardTitle>Current plan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border">
                  <div>
                    <p className="font-medium">{stripeCustomer.planLabel}</p>
                    <p className="text-sm text-muted-foreground">$499/mo · Renews May 25, 2026</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm">Upgrade</Button>
                    <Button size="sm" variant="outline">Manage plan</Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Payment method</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="h-8 w-12 rounded border bg-muted flex items-center justify-center text-xs font-mono font-medium">VISA</div>
                    <span className="text-sm">Visa ending in {stripeCustomer.paymentMethod.last4}</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      Expires {stripeCustomer.paymentMethod.expMonth}/{stripeCustomer.paymentMethod.expYear}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Invoices */}
            <Card className="border shadow-[var(--shadow-xs)]">
              <CardHeader>
                <CardTitle>Invoices</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-6">Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stripeInvoices.slice(0, 6).map((inv) => (
                      <TableRow key={inv.id} className="hover:bg-muted/40">
                        <TableCell className="pl-6 text-sm">{formatDate(inv.date)}</TableCell>
                        <TableCell className="font-mono tabular-nums text-sm">
                          ${(inv.amount / 100).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge className="text-xs rounded-full px-2 py-0.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                            Paid
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <Button variant="ghost" size="icon" aria-label="Download invoice">
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </ProbeTracked>
      </TabsContent>

      {/* Notifications */}
      <TabsContent value="notifications">
        <ProbeTracked changeId="settings-notifications">
          <div className="max-w-2xl">
            <Card className="border shadow-[var(--shadow-xs)]">
              <CardHeader>
                <CardTitle>Notification preferences</CardTitle>
                <CardDescription>Choose which events trigger email notifications.</CardDescription>
              </CardHeader>
              <CardContent className="divide-y divide-border">
                {notifPrefs.map((pref) => (
                  <div key={pref.id} className="flex items-center justify-between py-4">
                    <div>
                      <p className="text-sm font-medium">{pref.label}</p>
                      <p className="text-xs text-muted-foreground">{pref.group}</p>
                    </div>
                    <Switch
                      checked={notifs[pref.id]}
                      onCheckedChange={(v) => setNotifs((p) => ({ ...p, [pref.id]: v }))}
                      aria-label={pref.label}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </ProbeTracked>
      </TabsContent>

      {/* API Keys */}
      <TabsContent value="api">
        <ProbeTracked changeId="settings-api">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{mockApiKeys.length} active keys</p>
              <Button size="sm">
                <Key className="h-3.5 w-3.5 mr-1.5" /> Generate new key
              </Button>
            </div>
            <Card className="border shadow-[var(--shadow-xs)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Name</TableHead>
                    <TableHead>Key</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last used</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockApiKeys.map((key) => (
                    <TableRow key={key.id} className="hover:bg-muted/40">
                      <TableCell className="pl-6 font-medium text-sm">{key.name}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{key.prefix}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{formatDate(key.created)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{formatRelativeTime(key.lastUsed)}</TableCell>
                      <TableCell>
                        <Badge className="text-xs rounded-full px-2 py-0.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                          {key.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        </ProbeTracked>
      </TabsContent>
    </Tabs>
  );
}
