import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
          Settings
        </h1>
        <p className="mt-2 text-zinc-500">
          Manage your workspace configuration.
        </p>

        <Card className="mt-10">
          <CardHeader>
            <CardTitle>General</CardTitle>
            <CardDescription>
              Basic workspace information. Contact support to make changes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="company">Company name</Label>
              <Input id="company" defaultValue="Acme Corp" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="domain">Workspace domain</Label>
              <Input id="domain" defaultValue="acme.example.com" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Billing email</Label>
              <Input id="email" defaultValue="billing@acme.co" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan">Plan</Label>
              <Input id="plan" defaultValue="Growth" disabled />
            </div>
            <Button disabled variant="outline">
              Save changes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
