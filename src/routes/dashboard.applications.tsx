import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bookmark } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { useStudentNav } from "@/components/layout/dashboard-nav";
import { Button } from "@/components/ui/button";
import { jobs } from "@/data/opportunities";
import { lpa, prettyDate } from "@/lib/format";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { ApplicationStage } from "@/types";

export const Route = createFileRoute("/dashboard/applications")({
  head: () => ({
    meta: [
      { title: "My Applications — Unified Mentor" },
      {
        name: "description",
        content:
          "Track every job and internship application through a clear pipeline, with saved roles in one place.",
      },
      { property: "og:title", content: "My Applications — Unified Mentor" },
      { property: "og:description", content: "Application pipeline and saved roles." },
    ],
  }),
  component: ApplicationsPage,
});

const pipeline: ApplicationStage[] = [
  "Applied",
  "Under Review",
  "Shortlisted",
  "Interview",
  "Selected",
];

function ApplicationsPage() {
  return (
    <DashboardShell
      allow={["student"]}
      title="Applications"
      subtitle="Every application, stage by stage"
      items={useStudentNav()}
    >
      <Inner />
    </DashboardShell>
  );
}

function Inner() {
  const { applications, savedJobs, advanceApplication, toggleSaveJob } = useApp();
  const [filter, setFilter] = useState<"all" | "job" | "internship">("all");
  const list = applications.filter((a) => filter === "all" || a.kind === filter);
  const saved = jobs.filter((j) => savedJobs.includes(j.id));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total", value: applications.length },
          {
            label: "In progress",
            value: applications.filter((a) => !["Selected", "Rejected"].includes(a.stage)).length,
          },
          {
            label: "Interviews",
            value: applications.filter((a) => a.stage === "Interview").length,
          },
          { label: "Saved roles", value: savedJobs.length },
        ].map((s) => (
          <div key={s.label} className="surface-card p-5">
            <p className="font-display text-2xl font-semibold">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-1.5">
        {(["all", "job", "internship"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors",
              filter === f
                ? "bg-primary/12 text-primary"
                : "text-muted-foreground hover:bg-surface-2",
            )}
          >
            {f === "all" ? "All" : `${f}s`}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {list.map((a) => {
          const stageIndex = pipeline.indexOf(a.stage);
          const rejected = a.stage === "Rejected";
          return (
            <div key={a.id} className="surface-card p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{a.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {a.company} · {a.kind} · applied {prettyDate(a.appliedOn)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[11px] font-medium",
                      rejected
                        ? "bg-destructive/10 text-destructive"
                        : a.stage === "Selected"
                          ? "bg-primary/15 text-primary"
                          : "bg-accent/20 text-accent-foreground dark:text-accent",
                    )}
                  >
                    {a.stage}
                  </span>
                  {!rejected && a.stage !== "Selected" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        advanceApplication(a.id);
                        toast.success("Stage updated");
                      }}
                    >
                      Advance <ArrowRight className="size-3.5" />
                    </Button>
                  )}
                </div>
              </div>

              {!rejected && (
                <ol className="mt-5 flex flex-wrap items-center gap-2">
                  {pipeline.map((s, i) => (
                    <li key={s} className="flex items-center gap-2">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[11px] font-medium",
                          i <= stageIndex
                            ? "bg-primary/15 text-primary"
                            : "bg-surface-2 text-muted-foreground",
                        )}
                      >
                        {s}
                      </span>
                      {i < pipeline.length - 1 && (
                        <span
                          className={cn("h-px w-5", i < stageIndex ? "bg-primary" : "bg-border")}
                        />
                      )}
                    </li>
                  ))}
                </ol>
              )}

              {a.note && <p className="mt-4 text-sm text-muted-foreground">{a.note}</p>}
              <p className="mt-3 text-xs text-muted-foreground">Resume used: {a.resumeName}</p>
            </div>
          );
        })}
      </div>

      <div className="surface-card p-6">
        <h3 className="flex items-center gap-2 font-semibold">
          <Bookmark className="size-4 text-primary" /> Saved roles
        </h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {saved.map((j) => (
            <div key={j.id} className="rounded-xl border border-border p-4">
              <Link
                to="/jobs/$jobId"
                params={{ jobId: j.id }}
                className="font-medium hover:text-primary"
              >
                {j.title}
              </Link>
              <p className="text-xs text-muted-foreground">
                {j.company} · {j.location}
              </p>
              <p className="mt-1 text-sm font-medium text-accent-foreground dark:text-accent">
                {lpa(j.salaryMin)} – {lpa(j.salaryMax)}
              </p>
              <Button
                size="sm"
                variant="ghost"
                className="mt-2 h-7 text-xs"
                onClick={() => toggleSaveJob(j.id)}
              >
                Remove
              </Button>
            </div>
          ))}
          {saved.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Nothing saved yet — bookmark roles from the job portal.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
