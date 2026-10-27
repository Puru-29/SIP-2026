import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BriefcaseBusiness,
  CalendarClock,
  LayoutDashboard,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
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
import { jobs as seedJobs } from "@/data/opportunities";
import { lpa } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/recruiter")({
  head: () => ({
    meta: [
      { title: "Recruiter Workspace — Unified Mentor" },
      {
        name: "description",
        content:
          "Search verified candidates by skill, review readiness scores and manage your hiring pipeline.",
      },
      { property: "og:title", content: "Recruiter Workspace — Unified Mentor" },
      { property: "og:description", content: "Verified candidate search and hiring pipeline." },
    ],
  }),
  component: RecruiterPage,
});

const items: NavGroupItem[] = [
  { label: "Workspace", to: "/recruiter", icon: <LayoutDashboard /> },
  { label: "Job portal", to: "/jobs", icon: <BriefcaseBusiness /> },
  { label: "Talent", to: "/mentors", icon: <Users /> },
];

interface Candidate {
  name: string;
  role: string;
  skills: string[];
  readiness: number;
  certificates: number;
  projects: number;
  location: string;
}

const candidates: Candidate[] = [
  {
    name: "Alex Mehra",
    role: "Frontend Developer",
    skills: ["React", "TypeScript", "Node.js", "MongoDB"],
    readiness: 82,
    certificates: 3,
    projects: 4,
    location: "Bengaluru",
  },
  {
    name: "Priya Raghavan",
    role: "Data Analyst",
    skills: ["Python", "SQL", "Power BI", "Statistics"],
    readiness: 76,
    certificates: 2,
    projects: 3,
    location: "Chennai",
  },
  {
    name: "Dev Sharma",
    role: "Full Stack Engineer",
    skills: ["Node.js", "React", "PostgreSQL", "Docker"],
    readiness: 89,
    certificates: 4,
    projects: 5,
    location: "Pune",
  },
  {
    name: "Nikita Bose",
    role: "Product Designer",
    skills: ["Figma", "User Research", "Design Systems"],
    readiness: 71,
    certificates: 2,
    projects: 4,
    location: "Kolkata",
  },
  {
    name: "Rahul Verma",
    role: "Cloud Engineer",
    skills: ["AWS", "Terraform", "Kubernetes", "CI/CD"],
    readiness: 80,
    certificates: 3,
    projects: 3,
    location: "Hyderabad",
  },
];

const pipeline = [
  { stage: "Sourced", count: 42 },
  { stage: "Screened", count: 26 },
  { stage: "Interview", count: 11 },
  { stage: "Offer", count: 4 },
];

interface Posting {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  notes: string;
}

function RecruiterPage() {
  return (
    <DashboardShell
      allow={["recruiter"]}
      title="Recruiter workspace"
      subtitle="Verified candidates, readiness scores and pipeline"
      items={items}
    >
      <Inner />
    </DashboardShell>
  );
}

function Inner() {
  const [query, setQuery] = useState("");
  const [shortlisted, setShortlisted] = useState<string[]>([]);
  const [rejected, setRejected] = useState<string[]>([]);
  const [viewing, setViewing] = useState<Candidate | null>(null);
  const [interviewFor, setInterviewFor] = useState<Candidate | null>(null);

  const [postings, setPostings] = useState<Posting[]>(
    seedJobs.slice(0, 4).map((j) => ({
      id: j.id,
      title: j.title,
      company: j.company,
      location: `${j.location} · ${j.mode}`,
      salary: `${lpa(j.salaryMin)} – ${lpa(j.salaryMax)}`,
      notes: j.description,
    })),
  );
  const [editing, setEditing] = useState<Posting | null>(null);
  const [postOpen, setPostOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return candidates;
    return candidates.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q) ||
        c.skills.some((s) => s.toLowerCase().includes(q)),
    );
  }, [query]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {pipeline.map((p) => (
          <div key={p.stage} className="surface-card p-5">
            <p className="font-display text-2xl font-semibold">
              {p.stage === "Interview" ? p.count + shortlisted.length : p.count}
            </p>
            <p className="text-xs text-muted-foreground">{p.stage}</p>
          </div>
        ))}
      </div>

      <div className="surface-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-semibold">Candidate search</h3>
          <div className="relative w-full max-w-sm">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by skill, role or name"
              className="pl-9"
            />
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {filtered.map((c) => {
            const isShort = shortlisted.includes(c.name);
            const isRejected = rejected.includes(c.name);
            return (
              <div
                key={c.name}
                className={cn("rounded-xl border border-border p-4", isRejected && "opacity-60")}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.role} · {c.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-lg font-semibold text-primary">
                      {c.readiness}%
                    </p>
                    <p className="text-[10px] text-muted-foreground">readiness</p>
                  </div>
                </div>
                <ProgressBar value={c.readiness} className="mt-3" />
                <div className="mt-3 flex flex-wrap gap-1">
                  {c.skills.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {c.certificates} verified certificates · {c.projects} reviewed projects
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Button size="sm" variant="outline" onClick={() => setViewing(c)}>
                    View applicant
                  </Button>
                  <Button
                    size="sm"
                    variant={isShort ? "secondary" : "default"}
                    onClick={() => {
                      setShortlisted((prev) =>
                        isShort ? prev.filter((n) => n !== c.name) : [...prev, c.name],
                      );
                      setRejected((prev) => prev.filter((n) => n !== c.name));
                      toast.success(isShort ? "Removed from shortlist" : `${c.name} shortlisted`);
                    }}
                  >
                    {isShort ? "Shortlisted" : "Shortlist"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setInterviewFor(c)}>
                    <CalendarClock className="size-4" /> Interview
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setRejected((prev) =>
                        isRejected ? prev.filter((n) => n !== c.name) : [...prev, c.name],
                      );
                      setShortlisted((prev) => prev.filter((n) => n !== c.name));
                      toast.success(isRejected ? "Rejection undone" : `${c.name} rejected`);
                    }}
                  >
                    <X className="size-4" /> {isRejected ? "Undo" : "Reject"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="surface-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-semibold">Your open roles</h3>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => {
                setEditing({ id: "", title: "", company: "", location: "", salary: "", notes: "" });
                setPostOpen(true);
              }}
            >
              <Plus className="size-4" /> Post job
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link to="/jobs">View portal</Link>
            </Button>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {postings.map((j) => (
            <div key={j.id} className="rounded-xl border border-border p-4">
              <p className="text-sm font-medium">{j.title}</p>
              <p className="text-xs text-muted-foreground">
                {j.company} · {j.location}
              </p>
              <p className="mt-1 text-sm font-medium text-accent-foreground dark:text-accent">
                {j.salary}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {seedJobs.some((s) => s.id === j.id) && (
                  <Button asChild size="sm" variant="ghost" className="h-7 px-2 text-xs">
                    <Link to="/jobs/$jobId" params={{ jobId: j.id }}>
                      Open
                    </Link>
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-xs"
                  onClick={() => {
                    setEditing(j);
                    setPostOpen(true);
                  }}
                >
                  <Pencil className="size-3.5" /> Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-xs text-destructive"
                  onClick={() => {
                    setPostings((prev) => prev.filter((p) => p.id !== j.id));
                    toast.success("Role removed", { description: j.title });
                  }}
                >
                  <Trash2 className="size-3.5" /> Delete
                </Button>
              </div>
            </div>
          ))}
          {postings.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No open roles yet — post your first job.
            </p>
          )}
        </div>
      </div>

      {/* Applicant profile */}
      <Dialog open={!!viewing} onOpenChange={(v) => !v && setViewing(null)}>
        <DialogContent className="sm:max-w-md">
          {viewing && (
            <>
              <DialogHeader>
                <DialogTitle>{viewing.name}</DialogTitle>
              </DialogHeader>
              <p className="-mt-2 text-sm text-muted-foreground">
                {viewing.role} · {viewing.location}
              </p>
              <div className="mt-2 grid gap-3">
                <div>
                  <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    Readiness
                  </p>
                  <ProgressBar value={viewing.readiness} className="mt-2" />
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    Skills
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {viewing.skills.map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {viewing.certificates} verified certificates and {viewing.projects}{" "}
                  mentor-reviewed projects on the platform.
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setViewing(null)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setInterviewFor(viewing);
                    setViewing(null);
                  }}
                >
                  <CalendarClock className="size-4" /> Schedule interview
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Interview scheduling */}
      <InterviewDialog
        candidate={interviewFor}
        onClose={() => setInterviewFor(null)}
        onScheduled={(name) =>
          setShortlisted((prev) => (prev.includes(name) ? prev : [...prev, name]))
        }
      />

      {/* Post / edit job */}
      <Dialog
        open={postOpen}
        onOpenChange={(v) => {
          setPostOpen(v);
          if (!v) setEditing(null);
        }}
      >
        <DialogContent className="sm:max-w-lg">
          {editing && (
            <>
              <DialogHeader>
                <DialogTitle>{editing.id ? "Edit role" : "Post a new role"}</DialogTitle>
              </DialogHeader>
              <div className="mt-2 grid gap-3">
                <Field label="Job title">
                  <Input
                    value={editing.title}
                    onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  />
                </Field>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Company">
                    <Input
                      value={editing.company}
                      onChange={(e) => setEditing({ ...editing, company: e.target.value })}
                    />
                  </Field>
                  <Field label="Location & mode">
                    <Input
                      value={editing.location}
                      onChange={(e) => setEditing({ ...editing, location: e.target.value })}
                      placeholder="Bengaluru · Hybrid"
                    />
                  </Field>
                </div>
                <Field label="Compensation">
                  <Input
                    value={editing.salary}
                    onChange={(e) => setEditing({ ...editing, salary: e.target.value })}
                    placeholder="₹12L – ₹18L"
                  />
                </Field>
                <Field label="Role summary">
                  <Textarea
                    rows={3}
                    value={editing.notes}
                    onChange={(e) => setEditing({ ...editing, notes: e.target.value })}
                  />
                </Field>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setPostOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (editing.title.trim().length < 3 || editing.company.trim().length < 2) {
                      toast.error("Add at least a job title and company");
                      return;
                    }
                    if (editing.id) {
                      setPostings((prev) => prev.map((p) => (p.id === editing.id ? editing : p)));
                      toast.success("Role updated", { description: editing.title });
                    } else {
                      const created = { ...editing, id: `new-${Date.now()}` };
                      setPostings((prev) => [created, ...prev]);
                      toast.success("Role published", { description: created.title });
                    }
                    setPostOpen(false);
                    setEditing(null);
                  }}
                >
                  {editing.id ? "Save changes" : "Publish role"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InterviewDialog({
  candidate,
  onClose,
  onScheduled,
}: {
  candidate: Candidate | null;
  onClose: () => void;
  onScheduled: (name: string) => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [time, setTime] = useState("11:00");
  const [round, setRound] = useState("Technical screen");

  return (
    <Dialog open={!!candidate} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        {candidate && (
          <>
            <DialogHeader>
              <DialogTitle>Schedule interview — {candidate.name}</DialogTitle>
            </DialogHeader>
            <div className="mt-2 grid gap-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Date">
                  <Input
                    type="date"
                    min={today}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </Field>
                <Field label="Time">
                  <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                </Field>
              </div>
              <Field label="Round">
                <select
                  value={round}
                  onChange={(e) => setRound(e.target.value)}
                  className="h-9 rounded-lg border border-input bg-card px-3 text-sm"
                >
                  {["Intro call", "Technical screen", "System design", "Hiring manager"].map(
                    (r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ),
                  )}
                </select>
              </Field>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  onScheduled(candidate.name);
                  toast.success("Interview scheduled", {
                    description: `${candidate.name} · ${round} · ${new Date(date).toDateString()} ${time}`,
                  });
                  onClose();
                }}
              >
                Confirm interview
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-xs font-medium">{label}</Label>
      {children}
    </div>
  );
}
