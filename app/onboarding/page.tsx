import { ProbeTracked } from "@/components/ProbeTracked";
import ActivationChecklist from "@/components/ActivationChecklist";
import WelcomeVideo from "@/components/WelcomeVideo";
import ProductTour from "@/components/ProductTour";

export default function OnboardingPage() {
  return (
    <ProbeTracked changeId="onboarding-root">
      <div className="min-h-screen bg-zinc-50">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
            Welcome to Acme
          </h1>
          <p className="mt-2 text-zinc-500">
            Complete the steps below to get your workspace set up.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <div className="rounded-lg border border-zinc-200 bg-white p-6">
                <h2 className="text-lg font-medium text-zinc-900">
                  Getting started
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  Follow these steps to configure your account and invite your team.
                </p>
                <ActivationChecklist />
              </div>

              <div className="rounded-lg border border-zinc-200 bg-white p-6">
                <h2 className="text-lg font-medium text-zinc-900">
                  Product tour
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  A quick walkthrough of the key features available in your plan.
                </p>
                <ProductTour />
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-lg border border-zinc-200 bg-white p-6">
                <h2 className="text-lg font-medium text-zinc-900">
                  Overview video
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  A two-minute overview of how teams use Acme day to day.
                </p>
                <WelcomeVideo />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProbeTracked>
  );
}
