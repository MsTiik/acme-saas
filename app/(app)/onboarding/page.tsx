import type { Metadata } from "next";
import { ProbeTracked } from "@/components/ProbeTracked";
import ActivationChecklist from "@/components/ActivationChecklist";
import WelcomeVideo from "@/components/WelcomeVideo";
import ProductTour from "@/components/ProductTour";
import {
  AcmeEventError,
  trackIntercomEvent,
  reportError,
  registerWebhook,
  type WebhookRegistrationResult,
} from "@/lib/acme-events";
import { AlertTriangle, CheckCircle2, Webhook, FileText } from "lucide-react";

export const metadata: Metadata = { title: "Onboarding" };

let _trialCache: { trialEndsAt: string } | null = null;
let _webhookCache: WebhookRegistrationResult | null | undefined;

async function isFeatureEnabled(flag: string): Promise<boolean> {
  return process.env[`FF_${flag.toUpperCase()}`] === "true";
}

/** Fire the `trial_started` Intercom event once per server lifecycle. */
function emitTrialStarted(): { trialEndsAt: string } {
  if (_trialCache) return _trialCache;

  const trialEnd = new Date();
  trialEnd.setDate(trialEnd.getDate() + 14);
  const trialEndsAt = trialEnd.toISOString();

  trackIntercomEvent("trial_started", {
    trialEndsAt,
    source: "onboarding_page",
  });

  _trialCache = { trialEndsAt };
  return _trialCache;
}

/** Attempt to register the onboarding webhook once; return null on failure. */
function tryRegisterWebhook(): WebhookRegistrationResult | null {
  if (_webhookCache !== undefined) return _webhookCache;

  try {
    _webhookCache = registerWebhook({
      url: "https://hooks.acme.co/onboarding",
      events: [
        "trial_started",
        "onboarding_step_completed",
        "onboarding_completed",
      ],
    });
    return _webhookCache;
  } catch (err) {
    if (!(err instanceof AcmeEventError)) {
      reportError(
        "Failed to register onboarding webhook",
        "ONBOARDING_WEBHOOK_FAILED",
        { originalError: err instanceof Error ? err.message : String(err) },
      );
    }
    _webhookCache = null;
    return null;
  }
}

export default async function OnboardingPage() {
  const enterpriseOnboarding = await isFeatureEnabled(
    "enterprise_onboarding_optimization",
  );
  const enhancedErrorHandling = await isFeatureEnabled(
    "enhanced_error_handling_and_docs",
  );

  let trialEndsAt: string | null = null;
  let webhook: WebhookRegistrationResult | null = null;

  if (enhancedErrorHandling) {
    const trial = emitTrialStarted();
    trialEndsAt = trial.trialEndsAt;
    webhook = tryRegisterWebhook();
  }

  return (
    <ProbeTracked changeId="onboarding-root">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <ProbeTracked changeId="onboarding-hero">
          <div className="mb-8">
            <h1 className="font-serif text-3xl tracking-tight leading-tight">Welcome to Acme</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Complete the steps below to get your workspace set up and your team onboarded.
            </p>
            {enterpriseOnboarding && (
              <div className="mt-4 rounded-xl border border-border bg-[oklch(0.42_0.08_175/0.06)] p-4">
                <p className="text-sm font-medium text-[var(--primary)]">
                  Enterprise onboarding is active. Invite links are extended to
                  30 days, bulk user additions are tracked via Intercom, and
                  progress is logged to your Notion workspace.
                </p>
              </div>
            )}

            {enhancedErrorHandling && trialEndsAt && (
              <div className="mt-4 rounded-xl border border-border bg-card p-4 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Trial activated</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Your 14-day trial is active. A <code className="text-xs font-mono bg-muted px-1 rounded">trial_started</code> event
                    has been sent to Intercom for personalized onboarding guidance.
                  </p>
                </div>
              </div>
            )}
          </div>
        </ProbeTracked>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Left column */}
          <div className="space-y-6">
            <ProbeTracked changeId="onboarding-checklist">
              <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-xs)]">
                <h2 className="text-lg font-medium">Getting started</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Follow these steps to configure your account and invite your team.
                </p>
                <ActivationChecklist enterpriseEnabled={enterpriseOnboarding} />
              </div>
            </ProbeTracked>

            <ProbeTracked changeId="onboarding-tour">
              <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-xs)]">
                <h2 className="text-lg font-medium">Product tour</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  A quick walkthrough of the key features available in your plan.
                </p>
                <ProductTour />
              </div>
            </ProbeTracked>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <ProbeTracked changeId="onboarding-video">
              <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-xs)]">
                <h2 className="text-lg font-medium">Overview video</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  A two-minute overview of how teams use Acme day to day.
                </p>
                <WelcomeVideo />
              </div>
            </ProbeTracked>

            {enhancedErrorHandling && (
              <ProbeTracked changeId="onboarding-webhook-status">
                <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-xs)]">
                  <div className="flex items-center gap-2">
                    <Webhook className="h-5 w-5 text-muted-foreground" />
                    <h2 className="text-lg font-medium">Webhook delivery</h2>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Real-time event delivery replaces API polling for faster,
                    more reliable updates.
                  </p>
                  <div className="mt-4 space-y-3">
                    {webhook ? (
                      <div className="flex items-start gap-3 rounded-lg border border-border p-3 bg-emerald-50/50 dark:bg-emerald-900/10">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium">Webhook active</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Listening for{" "}
                            {webhook.events.map((e, i) => (
                              <span key={e}>
                                <code className="text-xs font-mono bg-muted px-1 rounded">{e}</code>
                                {i < webhook.events.length - 1 ? ", " : ""}
                              </span>
                            ))}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3 rounded-lg border border-border p-3 bg-amber-50/50 dark:bg-amber-900/10">
                        <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium">Webhook registration failed</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Falling back to periodic polling. Check the integration
                            settings or contact support if this persists.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </ProbeTracked>
            )}

            {enhancedErrorHandling && (
              <ProbeTracked changeId="onboarding-api-docs">
                <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-xs)]">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <h2 className="text-lg font-medium">API documentation</h2>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Keep your integration in sync with the latest API references.
                  </p>
                  <ul className="mt-4 space-y-2 text-sm">
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      Intercom Track Events API – send <code className="text-xs font-mono bg-muted px-1 rounded">trial_started</code> and lifecycle events
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      Webhook Subscriptions – replace polling with push delivery
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      Notion <code className="text-xs font-mono bg-muted px-1 rounded">product-specs</code> workspace – canonical spec reference
                    </li>
                  </ul>
                </div>
              </ProbeTracked>
            )}
          </div>
        </div>
      </div>
    </ProbeTracked>
  );
}
