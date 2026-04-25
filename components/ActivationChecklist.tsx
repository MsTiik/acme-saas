"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trackEvent } from "@/lib/acme-events";

const steps = [
  {
    id: 1,
    title: "Invite your team",
    description: "Add teammates to collaborate in your workspace.",
    action: "Invite",
  },
  {
    id: 2,
    title: "Connect Slack",
    description: "Get real-time notifications in your Slack channels.",
    action: "Connect",
  },
  {
    id: 3,
    title: "Import customers from your CRM",
    description: "Bring in your existing customer data to get started.",
    action: "Import",
  },
  {
    id: 4,
    title: "Set up SSO",
    description: "Enable single sign-on with your identity provider.",
    action: "Configure",
  },
  {
    id: 5,
    title: "Configure your billing details",
    description: "Add a payment method to keep your account active.",
    action: "Add billing",
  },
  {
    id: 6,
    title: "Install the browser extension",
    description: "Access Acme directly from any tab with one click.",
    action: "Install",
  },
];

export default function ActivationChecklist() {
  const [checked, setChecked] = useState<Record<number, boolean>>({ 1: true, 2: true });
  const [inviteOpen, setInviteOpen] = useState(false);

  const completedCount = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((completedCount / steps.length) * 100);

  function toggle(id: number) {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      trackEvent("onboarding_step_toggled", { step: id, checked: next[id] });
      return next;
    });
  }

  return (
    <div className="mt-4 space-y-4">
      {/* Progress */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{completedCount} of {steps.length} complete</span>
          <span>{pct}%</span>
        </div>
        <Progress value={pct} className="h-1.5" />
      </div>

      {/* Steps */}
      <div className="space-y-2">
        {steps.map((step) => (
          <div
            key={step.id}
            className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/40 transition-colors"
          >
            <Checkbox
              id={`step-${step.id}`}
              checked={!!checked[step.id]}
              onCheckedChange={() => toggle(step.id)}
              className="mt-0.5"
            />
            <div className="flex-1 min-w-0">
              <label
                htmlFor={`step-${step.id}`}
                className={`text-sm font-medium cursor-pointer ${checked[step.id] ? "line-through text-muted-foreground" : ""}`}
              >
                {step.title}
              </label>
              <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
            </div>
            {!checked[step.id] && (
              <Button
                size="sm"
                variant="outline"
                className="shrink-0 text-xs h-7"
                onClick={() => step.id === 1 ? setInviteOpen(true) : toggle(step.id)}
              >
                {step.action}
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Invite Dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Invite your team</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-2">
              <Label htmlFor="inv-email">Email address</Label>
              <Input id="inv-email" placeholder="colleague@company.com" type="email" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>Cancel</Button>
            <Button onClick={() => { setInviteOpen(false); toggle(1); }}>Send invite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
