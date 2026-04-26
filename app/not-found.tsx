import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center bg-background">
      <div className="space-y-2">
        <p className="text-sm font-mono text-muted-foreground">404</p>
        <h1 className="font-serif text-4xl tracking-tight">Page not found</h1>
        <p className="text-muted-foreground max-w-sm mx-auto text-sm">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <Link href="/dashboard" className={buttonVariants()}>
        Back to dashboard
      </Link>
    </div>
  );
}
