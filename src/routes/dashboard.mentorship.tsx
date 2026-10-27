import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarClock, MessageSquare, Video } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { useStudentNav } from "@/components/layout/dashboard-nav";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { mentors } from "@/data/opportunities";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/mentorship")({
  head: () => ({
    meta: [
      { title: "Mentorship — Unified Mentor" },
      {
        name: "description",
        content:
          "Book 1:1 mentor sessions, review upcoming calls and ask questions between sessions.",
      },
      { property: "og:title", content: "Mentorship — Unified Mentor" },
      { property: "og:description", content: "1:1 sessions, upcoming calls and mentor Q&A." },
    ],
  }),
  component: MentorshipPage,
});

function MentorshipPage() {
  return (
    <DashboardShell
      allow={["student"]}
      title="Mentorship"
      subtitle="1:1 sessions, upcoming calls and questions"
      items={useStudentNav()}
    >
      <Inner />
    </DashboardShell>
  );
}

function Inner() {
  const { pushNotification, bookings } = useApp();
  const upcoming = bookings.map((b) => ({
    mentor: b.mentorName,
    topic: b.topic,
    when: b.slot,
  }));
  const [question, setQuestion] = useState("");
  const [selected, setSelected] = useState(mentors[0]?.id ?? "");

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="surface-card p-6">
          <h3 className="flex items-center gap-2 font-semibold">
            <CalendarClock className="size-4 text-primary" /> Upcoming sessions
          </h3>
          <div className="mt-4 space-y-3">
            {upcoming.length === 0 && (
              <div className="rounded-xl border border-dashed border-border p-6 text-center">
                <p className="text-sm font-medium">No sessions booked yet</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Pick a mentor and book a 1:1 — it will show up here instantly.
                </p>
                <Button asChild size="sm" className="mt-4">
                  <Link to="/mentors">Find a mentor</Link>
                </Button>
              </div>
            )}
            {upcoming.map((u) => (
              <div
                key={u.topic}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-4"
              >
                <div>
                  <p className="font-medium">{u.topic}</p>
                  <p className="text-xs text-muted-foreground">
                    {u.mentor} · {u.when}
                  </p>
                </div>
                <Button size="sm" onClick={() => toast.success("Session link copied")}>
                  <Video className="size-4" /> Join
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="surface-card p-6">
          <h3 className="flex items-center gap-2 font-semibold">
            <MessageSquare className="size-4 text-primary" /> Ask your mentor
          </h3>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {mentors.slice(0, 4).map((m) => (
              <button
                key={m.id}
                onClick={() => setSelected(m.id)}
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                  selected === m.id
                    ? "bg-primary/12 text-primary"
                    : "bg-surface-2 text-muted-foreground",
                )}
              >
                {m.name}
              </button>
            ))}
          </div>
          <Textarea
            rows={4}
            className="mt-3"
            placeholder="Describe what you're stuck on — include the repo link if relevant."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <Button
            className="mt-3 w-full"
            disabled={!question.trim()}
            onClick={() => {
              const mentor = mentors.find((m) => m.id === selected);
              pushNotification({
                icon: "👨‍🏫",
                title: `Question sent to ${mentor?.name ?? "your mentor"}`,
                body: question.slice(0, 90),
                href: "/dashboard/mentorship",
              });
              setQuestion("");
              toast.success("Question sent — usually answered within 12 hours");
            }}
          >
            Send question
          </Button>
        </div>
      </div>

      <div className="surface-card p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Your mentor pod</h3>
          <Button asChild size="sm" variant="outline">
            <Link to="/mentors">Find more mentors</Link>
          </Button>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {mentors.slice(0, 3).map((m) => (
            <div key={m.id} className="rounded-xl border border-border p-4">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-full bg-primary/12 text-sm font-semibold text-primary">
                  {m.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-sm font-medium">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.company}</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{m.bio}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {m.expertise.slice(0, 3).map((e) => (
                  <span
                    key={e}
                    className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-medium"
                  >
                    {e}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
