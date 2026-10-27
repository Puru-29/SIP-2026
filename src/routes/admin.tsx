import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  LayoutDashboard,
  Pencil,
  Plus,
  Search,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Counter, ProgressBar } from "@/components/common/motion-primitives";
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
import { courses } from "@/data/courses";
import { internships, jobs, mentors, seedCertificates } from "@/data/opportunities";
import { demoAccounts } from "@/data/users";
import { compact, inr } from "@/lib/format";
import { programs } from "@/data/programs";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Console — Unified Mentor" },
      {
        name: "description",
        content:
          "Platform analytics for programs, learners, placements and revenue, with catalog and pipeline management.",
      },
      { property: "og:title", content: "Admin Console — Unified Mentor" },
      { property: "og:description", content: "Learner, catalog and placement analytics." },
    ],
  }),
  component: AdminPage,
});

const items: NavGroupItem[] = [
  { label: "Console", to: "/admin", icon: <LayoutDashboard /> },
  { label: "Programs", to: "/programs", icon: <BookOpen /> },
  { label: "Jobs", to: "/jobs", icon: <BriefcaseBusiness /> },
  { label: "Mentors", to: "/mentors", icon: <Users /> },
];

function AdminPage() {
  return (
    <DashboardShell
      allow={["admin"]}
      title="Admin console"
      subtitle="Platform health, catalog and placement pipeline"
      items={items}
    >
      <Inner />
    </DashboardShell>
  );
}

const monthly = [
  { m: "Mar", learners: 3200, placements: 180 },
  { m: "Apr", learners: 4100, placements: 220 },
  { m: "May", learners: 4900, placements: 265 },
  { m: "Jun", learners: 5600, placements: 310 },
  { m: "Jul", learners: 6400, placements: 352 },
  { m: "Aug", learners: 7300, placements: 411 },
];

function Inner() {
  const totalLearners = programs.reduce((a, p) => a + p.learners, 0);
  const revenue = programs.reduce((a, p) => a + p.price * (p.learners / 40), 0);
  const maxLearners = Math.max(...monthly.map((m) => m.learners));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={<Users />} label="Total learners" value={totalLearners} format="compact" />
        <Stat icon={<BookOpen />} label="Live programs" value={programs.length} />
        <Stat
          icon={<BriefcaseBusiness />}
          label="Open roles"
          value={jobs.length + internships.length}
        />
        <Stat icon={<TrendingUp />} label="Est. revenue" value={revenue} format="inr" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="surface-card p-6">
          <h3 className="flex items-center gap-2 font-semibold">
            <BarChart3 className="size-4 text-primary" /> Growth (last 6 months)
          </h3>
          <div className="mt-6 flex h-52 items-end gap-3">
            {monthly.map((m) => (
              <div key={m.m} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-full w-full items-end gap-1">
                  <div
                    className="flex-1 rounded-t-md bg-primary/70"
                    style={{ height: `${(m.learners / maxLearners) * 100}%` }}
                    title={`${m.learners} learners`}
                  />
                  <div
                    className="flex-1 rounded-t-md bg-accent/80"
                    style={{ height: `${(m.placements / 450) * 100}%` }}
                    title={`${m.placements} placements`}
                  />
                </div>
                <span className="text-[11px] text-muted-foreground">{m.m}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-primary/70" /> New learners
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-accent/80" /> Placements
            </span>
          </div>
        </div>

        <div className="surface-card p-6">
          <h3 className="font-semibold">Top programs by enrolment</h3>
          <div className="mt-4 space-y-3">
            {[...programs]
              .sort((a, b) => b.learners - a.learners)
              .slice(0, 6)
              .map((p) => (
                <div key={p.id}>
                  <div className="flex justify-between text-sm">
                    <span className="truncate">{p.title}</span>
                    <span className="text-muted-foreground">{compact(p.learners)}</span>
                  </div>
                  <ProgressBar
                    value={(p.learners / programs[0]!.learners) * 100}
                    className="mt-1.5"
                  />
                </div>
              ))}
          </div>
        </div>
      </div>

      <Manager />
    </div>
  );
}

interface Row {
  id: string;
  name: string;
  meta: string;
  extra: string;
}

const tabs = [
  "Users",
  "Programs",
  "Courses",
  "Jobs",
  "Internships",
  "Applications",
  "Certificates",
  "Mentors",
] as const;
type Tab = (typeof tabs)[number];

function seedRows(): Record<Tab, Row[]> {
  return {
    Users: demoAccounts.map((a) => ({
      id: a.user.id,
      name: a.user.name,
      meta: a.user.role,
      extra: a.user.email,
    })),
    Programs: programs.map((p) => ({
      id: p.id,
      name: p.title,
      meta: `${p.category} · ${p.level}`,
      extra: `${compact(p.learners)} learners · ${inr(p.price)}`,
    })),
    Courses: courses.map((c) => ({
      id: c.id,
      name: c.title,
      meta: `${c.category} · ${c.level}`,
      extra: `${c.hours} hrs · ${inr(c.price)}`,
    })),
    Jobs: jobs.map((j) => ({
      id: j.id,
      name: j.title,
      meta: `${j.company} · ${j.mode}`,
      extra: j.location,
    })),
    Internships: internships.map((i) => ({
      id: i.id,
      name: i.title,
      meta: `${i.company} · ${i.mode}`,
      extra: `${i.durationMonths} months · ${inr(i.stipend)}/mo`,
    })),
    Applications: [
      { id: "a1", name: "React Developer", meta: "Alex Mehra", extra: "Interview" },
      { id: "a2", name: "Data Analyst", meta: "Priya Raghavan", extra: "Shortlisted" },
      { id: "a3", name: "Frontend Engineering Intern", meta: "Dev Sharma", extra: "Under Review" },
    ],
    Certificates: seedCertificates.map((c) => ({
      id: c.id,
      name: c.title,
      meta: c.code,
      extra: c.grade,
    })),
    Mentors: mentors.map((m) => ({
      id: m.id,
      name: m.name,
      meta: m.company,
      extra: m.expertise.join(", "),
    })),
  };
}

function Manager() {
  const [tab, setTab] = useState<Tab>("Programs");
  const [data, setData] = useState<Record<Tab, Row[]>>(() => seedRows());
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Row | null>(null);
  const [open, setOpen] = useState(false);

  const rows = (data[tab] ?? []).filter((r) =>
    !query.trim()
      ? true
      : `${r.name} ${r.meta} ${r.extra}`.toLowerCase().includes(query.trim().toLowerCase()),
  );

  function save() {
    if (!editing) return;
    if (editing.name.trim().length < 2) {
      toast.error("Add a name first");
      return;
    }
    setData((prev) => {
      const list = prev[tab] ?? [];
      return {
        ...prev,
        [tab]: editing.id
          ? list.map((r) => (r.id === editing.id ? editing : r))
          : [{ ...editing, id: `new-${Date.now()}` }, ...list],
      };
    });
    toast.success(editing.id ? `${tab} entry updated` : `${tab} entry created`, {
      description: editing.name,
    });
    setOpen(false);
    setEditing(null);
  }

  return (
    <div className="surface-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-semibold">Platform management</h3>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${tab.toLowerCase()}`}
              className="w-56 pl-9"
            />
          </div>
          <Button
            size="sm"
            onClick={() => {
              setEditing({ id: "", name: "", meta: "", extra: "" });
              setOpen(true);
            }}
          >
            <Plus className="size-4" /> Add {tab.replace(/s$/, "").toLowerCase()}
          </Button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs transition-colors",
              tab === t
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:bg-surface-2",
            )}
          >
            {t}
            <span className="ml-1 text-[10px]">{(data[t] ?? []).length}</span>
          </button>
        ))}
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs tracking-wider text-muted-foreground uppercase">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Detail</th>
              <th className="py-2 pr-4">Meta</th>
              <th className="py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-border/60">
                <td className="py-2.5 pr-4 font-medium">{r.name}</td>
                <td className="py-2.5 pr-4 text-muted-foreground">{r.meta}</td>
                <td className="py-2.5 pr-4 text-muted-foreground">{r.extra}</td>
                <td className="py-2.5 text-right whitespace-nowrap">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-xs"
                    onClick={() => {
                      setEditing(r);
                      setOpen(true);
                    }}
                  >
                    <Pencil className="size-3.5" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-xs text-destructive"
                    onClick={() => {
                      setData((prev) => ({
                        ...prev,
                        [tab]: (prev[tab] ?? []).filter((x) => x.id !== r.id),
                      }));
                      toast.success("Entry deleted", { description: r.name });
                    }}
                  >
                    <Trash2 className="size-3.5" /> Delete
                  </Button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-sm text-muted-foreground">
                  Nothing here yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setEditing(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          {editing && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {editing.id ? `Edit ${tab.toLowerCase()} entry` : `Add to ${tab.toLowerCase()}`}
                </DialogTitle>
              </DialogHeader>
              <div className="mt-2 grid gap-3">
                <div className="grid gap-1.5">
                  <Label className="text-xs font-medium">Name</Label>
                  <Input
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-xs font-medium">Detail</Label>
                  <Input
                    value={editing.meta}
                    onChange={(e) => setEditing({ ...editing, meta: e.target.value })}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-xs font-medium">Meta</Label>
                  <Input
                    value={editing.extra}
                    onChange={(e) => setEditing({ ...editing, extra: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={save}>{editing.id ? "Save changes" : "Create"}</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  format,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  format?: "compact" | "inr";
}) {
  return (
    <div className="surface-card p-5">
      <div className="flex size-9 items-center justify-center rounded-xl bg-primary/12 text-primary [&_svg]:size-4">
        {icon}
      </div>
      <p className="mt-3 font-display text-2xl font-semibold">
        {format === "inr" ? (
          inr(Math.round(value))
        ) : format === "compact" ? (
          compact(value)
        ) : (
          <Counter value={value} />
        )}
      </p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
