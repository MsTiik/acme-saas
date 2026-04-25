"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

export function CustomerFilters() {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input placeholder="Search customers…" className="pl-8" />
      </div>
      <Select defaultValue="all-plans">
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Plan" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all-plans">All plans</SelectItem>
          <SelectItem value="free">Free</SelectItem>
          <SelectItem value="growth">Growth</SelectItem>
          <SelectItem value="enterprise">Enterprise</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue="all-statuses">
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all-statuses">All statuses</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="trialing">Trialing</SelectItem>
          <SelectItem value="churned">Churned</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
