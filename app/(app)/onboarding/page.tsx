import type { Metadata } from "next";
import { ProbeTracked } from "@/components/ProbeTracked";
import ActivationChecklist from "@/components/ActivationChecklist";
import WelcomeVideo from "@/components/WelcomeVideo";
import ProductTour from "@/components/ProductTour";

export const metadata: Metadata = { title: "Onboarding" };

async function isFeatureEnabled(flag: string): Promise<boolean> {
  return process.env[`FF_${flag.toUpperCase()}`] === "true";
}

export default async function OnboardingPage() {
  const enterpriseOnboarding = await isFeatureEnabled(
    "enterprise_onboarding_optimization",
  );

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
          <div>
            <ProbeTracked changeId="onboarding-video">
              <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-xs)]">
                <h2 className="text-lg font-medium">Overview video</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  A two-minute overview of how teams use Acme day to day.
                </p>
                <WelcomeVideo />
              </div>
            </ProbeTracked>
          </div>
        </div>
      </div>
    </ProbeTracked>
  );
}
