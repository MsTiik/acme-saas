import type { Metadata } from "next";
import { ProbeTracked } from "@/components/ProbeTracked";
import { SettingsTabs } from "@/components/SettingsTabs";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <ProbeTracked changeId="settings-hero">
        <div className="mb-8">
          <h1 className="font-serif text-3xl tracking-tight leading-tight">Settings</h1>
          <p className="mt-2 text-sm text-muted-foreground">Manage your workspace configuration.</p>
        </div>
      </ProbeTracked>
      <SettingsTabs />
    </div>
  );
}
