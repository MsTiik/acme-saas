"use client";

import { useState, useCallback, useEffect } from "react";
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
import { intercomUsers } from "@/lib/mocks/intercom";
import { notionPages, notionWorkspace } from "@/lib/mocks/notion";
import {
  ArrowUp,
  ArrowDown,
  LayoutGrid,
  LayoutList,
  Eye,
  EyeOff,
  Settings2,
  RotateCcw,
} from "lucide-react";

interface Step {
  id: number;
  title: string;
  description: string;
  action: string;
}

const baseSteps: Step[] = [
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

const enterpriseSteps: Step[] = [
  {
    id: 7,
    title: "Bulk invite employees",
    description:
      "Upload a CSV or connect your directory to add users at scale. Invite links are valid for 30 days.",
    action: "Upload CSV",
  },
  {
    id: 8,
    title: "Verify Intercom user tracking",
    description:
      "Ensure user_signed_up events are firing for each new employee added to the workspace.",
    action: "Verify",
  },
  {
    id: 9,
    title: "Link Notion customer-activities workspace",
    description:
      "Connect your Notion workspace to log onboarding milestones and progress automatically.",
    action: "Connect",
  },
];

type WidgetLayout = "list" | "grid";

async function isFeatureEnabled(flag: string): Promise<boolean> {
  return (
    typeof window !== "undefined" &&
    process.env[`NEXT_PUBLIC_FF_${flag.toUpperCase()}`] === "true"
  );
}

function logNotionActivity(activity: string) {
  trackEvent("notion.customer_activities.log", {
    workspaceId: notionWorkspace.id,
    workspaceName: notionWorkspace.name,
    activity,
    pagesTracked: notionPages.length,
    timestamp: new Date().toISOString(),
  });
}

function trackIntercomSignup(userId: string) {
  const user = intercomUsers.find((u) => u.id === userId);
  trackEvent("intercom.user_signed_up", {
    userId,
    email: user?.email ?? "unknown",
    role: user?.role ?? "member",
    timestamp: new Date().toISOString(),
  });
}

export default function ActivationChecklist({
  enterpriseEnabled = false,
}: {
  enterpriseEnabled?: boolean;
}) {
  const defaultSteps = enterpriseEnabled
    ? [...baseSteps, ...enterpriseSteps]
    : baseSteps;

  const [checked, setChecked] = useState<Record<number, boolean>>({ 1: true, 2: true });
  const [inviteOpen, setInviteOpen] = useState(false);

  // --- Widget customization state (gated by feature flag) ---
  const [widgetCustomizationEnabled, setWidgetCustomizationEnabled] =
    useState(false);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [layout, setLayout] = useState<WidgetLayout>("list");
  const [stepOrder, setStepOrder] = useState<number[]>(() =>
    defaultSteps.map((s) => s.id),
  );
  const [hiddenSteps, setHiddenSteps] = useState<Set<number>>(new Set());

  useEffect(() => {
    let cancelled = false;
    isFeatureEnabled("widget_customization_enabled").then((enabled) => {
      if (!cancelled) setWidgetCustomizationEnabled(enabled);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Keep stepOrder in sync when enterprise mode changes the step list.
  useEffect(() => {
    setStepOrder(defaultSteps.map((s) => s.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enterpriseEnabled]);

  const stepById = new Map(defaultSteps.map((s) => [s.id, s]));

  const visibleSteps: Step[] = stepOrder
    .filter((id) => !hiddenSteps.has(id))
    .map((id) => stepById.get(id))
    .filter((s): s is Step => s !== undefined);

  const completedCount = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((completedCount / defaultSteps.length) * 100);

  const toggle = useCallback(
    (id: number) => {
      const isCompleting = !checked[id];

      setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

      trackEvent("onboarding_step_toggled", { step: id, checked: isCompleting });

      if (isCompleting && enterpriseEnabled) {
        logNotionActivity(`Checklist step completed: step_${id}`);

        if (id === 7) {
          for (const user of intercomUsers) {
            trackIntercomSignup(user.id);
          }
        }
      }
    },
    [checked, enterpriseEnabled],
  );

  // --- Customization handlers ---
  const moveStep = useCallback(
    (stepId: number, direction: "up" | "down") => {
      setStepOrder((prev) => {
        const idx = prev.indexOf(stepId);
        if (idx === -1) return prev;
        const swapIdx = direction === "up" ? idx - 1 : idx + 1;
        if (swapIdx < 0 || swapIdx >= prev.length) return prev;
        const next = [...prev];
        [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
        trackEvent("widget_customization_reorder", {
          stepId,
          direction,
          newIndex: swapIdx,
        });
        return next;
      });
    },
    [],
  );

  const toggleVisibility = useCallback((stepId: number) => {
    setHiddenSteps((prev) => {
      const next = new Set(prev);
      if (next.has(stepId)) {
        next.delete(stepId);
        trackEvent("widget_customization_show", { stepId });
      } else {
        next.add(stepId);
        trackEvent("widget_customization_hide", { stepId });
      }
      return next;
    });
  }, []);

  const resetCustomization = useCallback(() => {
    setStepOrder(defaultSteps.map((s) => s.id));
    setHiddenSteps(new Set());
    setLayout("list");
    trackEvent("widget_customization_reset", {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enterpriseEnabled]);

  const toggleLayout = useCallback(() => {
    setLayout((prev) => {
      const next = prev === "list" ? "grid" : "list";
      trackEvent("widget_customization_layout_change", { layout: next });
      return next;
    });
  }, []);

  // --- Render helpers ---
  function renderStepCard(step: Step) {
    const isGrid = widgetCustomizationEnabled && layout === "grid";
    return (
      <div
        key={step.id}
        className={
          isGrid
            ? "flex flex-col gap-2 p-3 rounded-lg border border-border hover:bg-muted/40 transition-colors"
            : "flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/40 transition-colors"
        }
      >
        <div className={isGrid ? "flex items-start gap-3" : "contents"}>
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
            <p className="text-xs text-muted-foreground mt-0.5">
              {step.description}
            </p>
          </div>
        </div>
        {!checked[step.id] && (
          <Button
            size="sm"
            variant="outline"
            className="shrink-0 text-xs h-7"
            onClick={() =>
              step.id === 1 ? setInviteOpen(true) : toggle(step.id)
            }
          >
            {step.action}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      {/* Progress */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {completedCount} of {defaultSteps.length} complete
          </span>
          <span>{pct}%</span>
        </div>
        <Progress value={pct} className="h-1.5" />
      </div>

      {/* Widget Customization Toolbar — gated behind feature flag */}
      {widgetCustomizationEnabled && (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={customizeOpen ? "default" : "outline"}
            className="text-xs h-7 gap-1.5"
            onClick={() => {
              setCustomizeOpen((prev) => !prev);
              trackEvent("widget_customization_toggle_panel", {
                open: !customizeOpen,
              });
            }}
          >
            <Settings2 className="h-3.5 w-3.5" />
            Customize
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-xs h-7 gap-1.5"
            onClick={toggleLayout}
            title={layout === "list" ? "Switch to grid" : "Switch to list"}
          >
            {layout === "list" ? (
              <LayoutGrid className="h-3.5 w-3.5" />
            ) : (
              <LayoutList className="h-3.5 w-3.5" />
            )}
            {layout === "list" ? "Grid" : "List"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-xs h-7 gap-1.5 ml-auto"
            onClick={resetCustomization}
            title="Reset to defaults"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
        </div>
      )}

      {/* Customization Panel */}
      {widgetCustomizationEnabled && customizeOpen && (
        <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Reorder or hide widgets
          </p>
          {stepOrder.map((id, idx) => {
            const step = stepById.get(id);
            if (!step) return null;
            const isHidden = hiddenSteps.has(id);
            return (
              <div
                key={id}
                className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm ${isHidden ? "opacity-50" : ""}`}
              >
                <div className="flex gap-0.5">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    disabled={idx === 0}
                    onClick={() => moveStep(id, "up")}
                    aria-label={`Move ${step.title} up`}
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    disabled={idx === stepOrder.length - 1}
                    onClick={() => moveStep(id, "down")}
                    aria-label={`Move ${step.title} down`}
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <span className="flex-1 truncate">{step.title}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={() => toggleVisibility(id)}
                  aria-label={
                    isHidden ? `Show ${step.title}` : `Hide ${step.title}`
                  }
                >
                  {isHidden ? (
                    <EyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {/* Steps */}
      <div
        className={
          widgetCustomizationEnabled && layout === "grid"
            ? "grid grid-cols-2 gap-2"
            : "space-y-2"
        }
      >
        {visibleSteps.map((step) => renderStepCard(step))}
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
              <Input
                id="inv-email"
                placeholder="colleague@company.com"
                type="email"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setInviteOpen(false);
                toggle(1);
              }}
            >
              Send invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
