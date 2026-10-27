import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BellRing, Check, Inbox } from "lucide-react";
import { useState } from "react";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { useStudentNav } from "@/components/layout/dashboard-nav";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Unified Mentor" },
      {
        name: "description",
        content:
          "Every learning, application, mentorship and certificate update in one notification centre.",
      },
      { property: "og:title", content: "Notifications — Unified Mentor" },
      { property: "og:description", content: "Your learning and hiring updates in one place." },
    ],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  return (
    <DashboardShell
      allow={["student"]}
      title="Notifications"
      subtitle="Every update from your learning, projects and applications"
      items={useStudentNav()}
    >
      <Inner />
    </DashboardShell>
  );
}

function Inner() {
  const { notifications, markAllRead, markNotificationRead, unreadCount } = useApp();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"All" | "Unread">("All");

  const list = filter === "All" ? notifications : notifications.filter((n) => !n.read);

  return (
    <div className="space-y-6">
      <div className="surface-card flex flex-wrap items-center justify-between gap-3 p-5">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-primary/12 text-primary">
            <BellRing className="size-5" />
          </span>
          <div>
            <p className="font-semibold">{unreadCount} unread</p>
            <p className="text-xs text-muted-foreground">{notifications.length} total updates</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {(["All", "Unread"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs transition-colors",
                filter === f
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:bg-surface-2",
              )}
            >
              {f}
            </button>
          ))}
          <Button size="sm" variant="outline" onClick={markAllRead}>
            <Check className="size-4" /> Mark all read
          </Button>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="surface-card flex flex-col items-center gap-2 p-12 text-center">
          <Inbox className="size-8 text-muted-foreground" />
          <p className="font-display text-lg font-semibold">You&apos;re all caught up</p>
          <p className="text-sm text-muted-foreground">No unread notifications right now.</p>
        </div>
      ) : (
        <div className="surface-card divide-y divide-border overflow-hidden">
          {list.map((n) => (
            <button
              key={n.id}
              onClick={() => {
                markNotificationRead(n.id);
                if (n.href) navigate({ to: n.href });
              }}
              className={cn(
                "flex w-full items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-surface-2",
                !n.read && "bg-primary/5",
              )}
            >
              <span className="text-xl">{n.icon}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">{n.title}</span>
                <span className="mt-0.5 block text-sm text-muted-foreground">{n.body}</span>
                <span className="mt-1 block text-[11px] text-muted-foreground">{n.time}</span>
              </span>
              {!n.read && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
