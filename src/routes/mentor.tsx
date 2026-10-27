import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, LayoutDashboard, MessageSquare, Plus, Star, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { ProgressBar } from "@/components/common/motion-primitives";
import { DashboardShell, type NavGroupItem } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { prettyDate } from "@/lib/format";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/mentor")({
  head: () => ({
    meta: [
      { title: "Mentor Workspace — Unified Mentor" },
      {
        name: "description",
        content:
          "Review mentee submissions, manage sessions and leave structured project feedback in one workspace.",
      },
      { property: "og:title", content: "Mentor Workspace — Unified Mentor" },
      { property: "og:description", content: "Reviews, sessions and mentee progress." },
    ],
  }),
  component: MentorPage,
});

const items: NavGroupItem[] = [
  { label: "Workspace", to: "/mentor", icon: <LayoutDashboard /> },
  { label: "Mentors", to: "/mentors", icon: <Users /> },
  { label: "Profile", to: "/dashboard/profile", icon: <Star /> },
];

const mentees = [
  { name: "Alex Mehra", program: "Full Stack Development", progress: 64, pending: 2 },
  { name: "Priya Raghavan", program: "Data Science Career Track", progress: 41, pending: 1 },
  { name: "Dev Sharma", program: "Full Stack Development", progress: 82, pending: 0 },
  { name: "Nikita Bose", program: "UI/UX Product Design", progress: 55, pending: 1 },
];

type Mentee = (typeof mentees)[number];

const initialSessions = [
  { mentee: "Alex Mehra", topic: "Dashboard code review", when: "Thu, 12 Sep · 6:30 PM" },
  {
    mentee: "Priya Raghavan",
    topic: "Feature engineering walkthrough",
    when: "Fri, 13 Sep · 7:00 PM",
  },
  { mentee: "Nikita Bose", topic: "Portfolio critique", when: "Sat, 14 Sep · 11:00 AM" },
];

function MentorPage() {
  return (
    <DashboardShell
      allow={["mentor"]}
      title="Mentor workspace"
      subtitle="Reviews, sessions and mentee progress"
      items={items}
    >
      <Inner />
    </DashboardShell>
  );
}

function Inner() {
  const { projects, updateProject } = useApp();
  const queue = projects.filter((p) => p.stage === "Review" || p.stage === "Development");
  const [sessions, setSessions] = useState(initialSessions);
  const [viewing, setViewing] = useState<Mentee | null>(null);
  const [scheduleFor, setScheduleFor] = useState<Mentee | null>(null);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState("19:00");
  const [topic, setTopic] = useState("");

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Active mentees", value: mentees.length },
          { label: "Reviews pending", value: queue.length },
          { label: "Sessions this week", value: sessions.length },
          { label: "Avg. rating", value: "4.9" },
        ].map((s) => (
          <div key={s.label} className="surface-card p-5">
            <p className="font-display text-2xl font-semibold">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="surface-card p-6">
          <h3 className="flex items-center gap-2 font-semibold">
            <MessageSquare className="size-4 text-primary" /> Review queue
          </h3>
          <div className="mt-4 space-y-4">
            {queue.map((p) => (
              <div key={p.id} className="rounded-xl border border-border p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium">{p.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.program} · due {prettyDate(p.dueDate)}
                    </p>
                  </div>
                  <span className="rounded-full bg-accent/20 px-2.5 py-1 text-[11px] font-medium text-accent-foreground dark:text-accent">
                    {p.stage}
                  </span>
                </div>
                <ProgressBar value={p.progress} className="mt-3" />
                <Textarea
                  rows={3}
                  className="mt-3"
                  placeholder="Leave specific, actionable feedback…"
                  id={`fb-${p.id}`}
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      const el = document.getElementById(
                        `fb-${p.id}`,
                      ) as HTMLTextAreaElement | null;
                      const text = el?.value.trim();
                      if (!text) {
                        toast.error("Add feedback before submitting");
                        return;
                      }
                      updateProject(p.id, {
                        feedback: [
                          ...(p.feedback ?? []),
                          {
                            mentor: "You",
                            text,
                            date: new Date().toISOString().slice(0, 10),
                          },
                        ],
                      });
                      if (el) el.value = "";
                      toast.success("Feedback sent to mentee");
                    }}
                  >
                    Send feedback
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      updateProject(p.id, { stage: "Completed", progress: 100 });
                      toast.success("Project approved");
                    }}
                  >
                    Approve project
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="surface-card p-6">
            <div className="flex items-center justify-between gap-2">
              <h3 className="flex items-center gap-2 font-semibold">
                <CalendarClock className="size-4 text-primary" /> Upcoming sessions
              </h3>
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-2 text-xs"
                onClick={() => {
                  setScheduleFor(mentees[0]!);
                  setTopic("");
                }}
              >
                <Plus className="size-3.5" /> Schedule
              </Button>
            </div>
            <div className="mt-4 space-y-3">
              {sessions.map((s) => (
                <div key={s.topic} className="rounded-xl border border-border p-3">
                  <p className="text-sm font-medium">{s.topic}</p>
                  <p className="text-xs text-muted-foreground">
                    {s.mentee} · {s.when}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card p-6">
            <h3 className="font-semibold">Mentees</h3>
            <div className="mt-4 space-y-3">
              {mentees.map((m) => (
                <div key={m.name} className="rounded-xl border border-border p-3">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{m.name}</span>
                    <span className="text-muted-foreground">{m.progress}%</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{m.program}</p>
                  <ProgressBar value={m.progress} className="mt-1.5" />
                  <div className="mt-2.5 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 flex-1 text-xs"
                      onClick={() => setViewing(m)}
                    >
                      View student
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 flex-1 text-xs"
                      onClick={() => {
                        setScheduleFor(m);
                        setTopic("");
                      }}
                    >
                      Schedule
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={!!viewing} onOpenChange={(v) => !v && setViewing(null)}>
        <DialogContent className="sm:max-w-md">
          {viewing && (
            <>
              <DialogHeader>
                <DialogTitle>{viewing.name}</DialogTitle>
              </DialogHeader>
              <p className="-mt-2 text-sm text-muted-foreground">{viewing.program}</p>
              <div className="mt-2 grid gap-3">
                <div>
                  <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    Program progress
                  </p>
                  <ProgressBar value={viewing.progress} className="mt-2" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {viewing.pending} submission{viewing.pending === 1 ? "" : "s"} awaiting your
                  review.
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setViewing(null)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setScheduleFor(viewing);
                    setTopic("");
                    setViewing(null);
                  }}
                >
                  <CalendarClock className="size-4" /> Schedule session
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!scheduleFor} onOpenChange={(v) => !v && setScheduleFor(null)}>
        <DialogContent className="sm:max-w-md">
          {scheduleFor && (
            <>
              <DialogHeader>
                <DialogTitle>Schedule session — {scheduleFor.name}</DialogTitle>
              </DialogHeader>
              <div className="mt-2 grid gap-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="grid gap-1.5">
                    <Label className="text-xs font-medium">Date</Label>
                    <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                  </div>
                  <div className="grid gap-1.5">
                    <Label className="text-xs font-medium">Time</Label>
                    <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-xs font-medium">Topic</Label>
                  <Input
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Code review · dashboard project"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setScheduleFor(null)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (topic.trim().length < 4) {
                      toast.error("Add a session topic");
                      return;
                    }
                    const when = `${new Date(date).toDateString()} · ${time}`;
                    setSessions((prev) => [
                      { mentee: scheduleFor.name, topic: topic.trim(), when },
                      ...prev,
                    ]);
                    toast.success("Session scheduled", {
                      description: `${scheduleFor.name} · ${when}`,
                    });
                    setScheduleFor(null);
                  }}
                >
                  Confirm session
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
