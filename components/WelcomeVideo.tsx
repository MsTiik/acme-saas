"use client";

import { trackEvent } from "@/lib/acme-events";
import { Play } from "lucide-react";

const chapters = [
  { title: "Setting up your workspace", time: "0:00" },
  { title: "Inviting teammates", time: "0:25" },
  { title: "Connecting integrations", time: "1:08" },
];

export default function WelcomeVideo() {
  return (
    <div className="mt-4 space-y-4">
      {/* Video thumbnail */}
      <button
        className="w-full relative rounded-xl overflow-hidden border border-border aspect-video flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Play welcome video"
        onClick={() => trackEvent("welcome_video_played")}
        style={{
          background: "linear-gradient(135deg, oklch(0.992 0.004 85) 0%, oklch(0.965 0.006 85) 100%)",
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="h-14 w-14 rounded-full bg-white shadow-[var(--shadow-md)] flex items-center justify-center">
            <Play className="h-6 w-6 text-primary fill-primary ml-0.5" strokeWidth={0} />
          </div>
        </div>
        <p className="absolute bottom-3 text-xs text-muted-foreground">
          Acme in 90 seconds · with Maya, Head of Product
        </p>
      </button>

      {/* Chapters */}
      <div className="space-y-2">
        {chapters.map((ch) => (
          <button
            key={ch.title}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border border-border hover:bg-muted/40 transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => trackEvent("welcome_video_chapter_clicked", { chapter: ch.title })}
          >
            <span className="text-sm">{ch.title}</span>
            <span className="font-mono text-xs text-muted-foreground">{ch.time}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
