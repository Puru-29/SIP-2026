import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ExternalLink, Github, MessageSquare } from "lucide-react";
import { toast } from "sonner";

import { ProgressBar } from "@/components/common/motion-primitives";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useStudentNav } from "@/components/layout/dashboard-nav";
import { Button } from "@/components/ui/button";
import { prettyDate } from "@/lib/format";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { ProjectStage } from "@/types";

export const Route = createFileRoute("/dashboard/projects/")({
  head: () => ({
    meta: [
      { title: "Project Board — Unified Mentor" },
      {
        name: "description",
        content:
          "A kanban board of your capstone projects with stages, mentor feedback, repos and live demos.",
      },
      { property: "og:title", content: "Project Board — Unified Mentor" },
      { property: "og:description", content: "Kanban board of capstone projects and reviews." },
    ],
  }),
  component: ProjectsPage,
});

const stages: ProjectStage[] = ["Assigned", "Planning", "Development", "Review", "Completed"];

function ProjectsPage() {
  return (
    <DashboardShell
      allow={["student"]}
      title="Projects"
      subtitle="Move work across stages and collect mentor reviews"
      items={useStudentNav()}
    >
      <Inner />
    </DashboardShell>
  );
}

function Inner() {
  const { projects, updateProject } = useApp();

  const advance = (id: string, stage: ProjectStage) => {
    const next = stages[Math.min(stages.length - 1, stages.indexOf(stage) + 1)]!;
    updateProject(id, {
      stage: next,
      progress:
        next === "Completed" ? 100 : Math.min(95, Math.max(20, 20 * (stages.indexOf(next) + 1))),
    });
    toast.success(`Moved to ${next}`);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
        {stages.map((stage) => {
          const items = projects.filter((p) => p.stage === stage);
          return (
            <div key={stage} className="rounded-2xl border border-border bg-surface p-3">
              <div className="flex items-center justify-between px-1">
                <p className="text-xs font-semibold tracking-wider uppercase">{stage}</p>
                <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px]">
                  {items.length}
                </span>
              </div>
              <div className="mt-3 space-y-2.5">
                {items.map((p) => (
                  <motion.div
                    layout
                    key={p.id}
                    className="rounded-xl border border-border bg-card p-3"
                  >
                    <p className="text-sm font-medium">{p.title}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{p.program}</p>
                    <ProgressBar value={p.progress} className="mt-2.5" />
                    <div className="mt-2 flex flex-wrap gap-1">
                      {p.stack.slice(0, 3).map((s) => (
                        <span
                          key={s}
                          className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                    <p className="mt-2 text-[11px] text-muted-foreground">
                      Due {prettyDate(p.dueDate)}
                    </p>
                    {stage !== "Completed" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="mt-1.5 h-7 w-full text-xs"
                        onClick={() => advance(p.id, p.stage)}
                      >
                        Advance stage
                      </Button>
                    )}
                  </motion.div>
                ))}
                {items.length === 0 && (
                  <p className="px-1 py-4 text-center text-[11px] text-muted-foreground">
                    Nothing here
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {projects.map((p) => (
          <div key={p.id} className="surface-card p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-lg font-semibold">{p.title}</h3>
                <p className="text-xs text-muted-foreground">{p.program}</p>
              </div>
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-[11px] font-medium",
                  p.stage === "Completed"
                    ? "bg-primary/15 text-primary"
                    : p.stage === "Review"
                      ? "bg-accent/20 text-accent-foreground dark:text-accent"
                      : "bg-surface-2 text-muted-foreground",
                )}
              >
                {p.stage}
              </span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{p.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {p.repoUrl && (
                <Button asChild size="sm" variant="outline">
                  <a href={p.repoUrl} target="_blank" rel="noreferrer">
                    <Github className="size-4" /> Repo
                  </a>
                </Button>
              )}
              {p.demoUrl && (
                <Button asChild size="sm" variant="outline">
                  <a href={p.demoUrl} target="_blank" rel="noreferrer">
                    <ExternalLink className="size-4" /> Live demo
                  </a>
                </Button>
              )}
            </div>
            {p.feedback?.length ? (
              <div className="mt-4 space-y-2.5">
                {p.feedback.map((f) => (
                  <div key={f.date} className="rounded-xl bg-surface-2 p-3">
                    <p className="flex items-center gap-1.5 text-xs font-medium">
                      <MessageSquare className="size-3.5 text-primary" /> {f.mentor}
                      <span className="ml-auto text-muted-foreground">{prettyDate(f.date)}</span>
                    </p>
                    <p className="mt-1.5 text-sm text-muted-foreground">{f.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-xs text-muted-foreground">
                No mentor feedback yet — submit for review to get one.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
