import type { Metadata } from "next";
import { ProbeTracked } from "@/components/ProbeTracked";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockCustomers } from "@/lib/mocks/customers";
import { formatDate } from "@/lib/utils";
import { Filter, Download, UserPlus, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { CustomerFilters } from "@/components/CustomerFilters";

export const metadata: Metadata = { title: "Customers" };

const planColors: Record<string, string> = {
  Enterprise: "bg-primary/10 text-primary",
  Growth: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Free: "bg-muted text-muted-foreground",
};

const statusColors: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Trialing: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Churned: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function CustomersPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <ProbeTracked changeId="customers-hero">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl tracking-tight leading-tight">Customers</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              1,248 customers · 86 added this month
            </p>
          </div>
          <ProbeTracked changeId="customers-header-actions">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-3.5 w-3.5 mr-1.5" /> Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-3.5 w-3.5 mr-1.5" /> Export
              </Button>
              <Button size="sm">
                <UserPlus className="h-3.5 w-3.5 mr-1.5" /> Add customer
              </Button>
            </div>
          </ProbeTracked>
        </div>
      </ProbeTracked>

      {/* Filters row */}
      <CustomerFilters />

      {/* Table */}
      <ProbeTracked changeId="customers-table">
        <div className="rounded-xl border border-border shadow-[var(--shadow-xs)] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Customer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead className="text-right">MRR</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    <div className="py-12 flex flex-col items-center gap-3 text-center">
                      <div className="h-24 w-24 rounded-xl bg-muted flex items-center justify-center">
                        <UserPlus className="h-10 w-10 text-muted-foreground" strokeWidth={1.25} />
                      </div>
                      <p className="font-medium">No customers yet</p>
                      <p className="text-sm text-muted-foreground">Add your first customer to get started.</p>
                      <Button size="sm">Add customer</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                mockCustomers.map((customer) => (
                  <TableRow key={customer.id} className="hover:bg-muted/40">
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold shrink-0">
                          {customer.initials}
                        </div>
                        <span className="font-medium text-sm">{customer.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{customer.email}</TableCell>
                    <TableCell>
                      <Badge className={`text-xs rounded-full px-2 py-0.5 ${planColors[customer.plan]}`}>
                        {customer.plan}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums text-sm">
                      {customer.mrr === 0 ? "—" : `$${(customer.mrr / 100).toLocaleString()}`}
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-xs rounded-full px-2 py-0.5 ${statusColors[customer.status]}`}>
                        {customer.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(customer.joined)}
                    </TableCell>
                    <TableCell className="pr-4">
                      <Button variant="ghost" size="icon" aria-label="More options">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Footer pagination */}
          <div className="flex items-center justify-between px-6 py-3 border-t border-border bg-muted/20">
            <p className="text-xs text-muted-foreground">Showing 1–12 of 1,248</p>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" disabled aria-label="Previous page">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" aria-label="Next page">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </ProbeTracked>
    </div>
  );
}
