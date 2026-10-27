import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink, Github, MessageSquare, Send, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { ProgressBar } from "@/components/common/motion-primitives";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useStudentNav } from "@/components/layout/dashboard-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { prettyDate } from "@/lib/format";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/projects/$projectId")({
  head: () => ({
    meta: [
      { title: "Project details — Unified Mentor" },
      {
        name: "description",
        content:
          "Track a capstone project: stack, progress, deadline, repository, live demo and mentor feedback.",
      },
      { property: "og:title", content: "Project details — Unified Mentor" },
      { property: "og:description", content: "Capstone project progress and mentor reviews." },
    ],
  }),
  component: ProjectDetailPage,
});

function ProjectDetailPage() {
  return (
    <DashboardShell
      allow={["student"]}
      title="Project"
      subtitle="Submission, review status and mentor feedback"
      items={useStudentNav()}
    >
      <Inner />
    </DashboardShell>
  );
}

function Inner() {
  const { projectId } = useParams({ from: "/dashboard/projects/$projectId" });
  const { projects, updateProject } = useApp();
  const project = projects.find((p) => p.id === projectId);
  const [repo, setRepo] = useState(project?.repoUrl ?? "");
  const [demo, setDemo] = useState(project?.demoUrl ?? "");

  if (!project) {
    return (
      <div className="surface-card p-12 text-center">
        <p className="font-display text-lg font-semibold">Project not found</p>
        <p className="mt-2 text-sm text-muted-foreground">
          It may have been archived. Head back to the board.
        </p>
        <Button asChild className="mt-5" variant="outline">
          <Link to="/dashboard/projects">Back to project board</Link>
        </Button>
      </div>
    );
  }

  function submitForReview() {
    if (!repo.trim()) {
      toast.error("Add a repository link before submitting");
      return;
    }
    updateProject(project!.id, {
      repoUrl: repo.trim(),
      ...(demo.trim() ? { demoUrl: demo.trim() } : {}),
      stage: "Review",
      progress: Math.max(project!.progress, 90),
    });
    toast.success("Submitted for mentor review", {
      description: "Your mentor will leave feedback within 48 hours.",
    });
  }

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/dashboard/projects">
          <ArrowLeft className="size-4" /> Project board
        </Link>
      </Button>

      <div className="surface-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-semibold">{project.title}</h2>
            <p className="text-sm text-muted-foreground">{project.program}</p>
          </div>
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium",
              project.stage === "Completed"
                ? "bg-primary/15 text-primary"
                : project.stage === "Review"
                  ? "bg-accent/20 text-accent-foreground dark:text-accent"
                  : "bg-surface-2 text-muted-foreground",
            )}
          >
            {project.stage}
          </span>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{project.summary}</p>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-surface-2 p-3">
            <p className="text-xs text-muted-foreground">Progress</p>
            <p className="font-display text-xl font-semibold">{project.progress}%</p>
            <ProgressBar value={project.progress} className="mt-1.5" />
          </div>
          <div className="rounded-xl border border-border bg-surface-2 p-3">
            <p className="text-xs text-muted-foreground">Deadline</p>
            <p className="font-display text-xl font-semibold">{prettyDate(project.dueDate)}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface-2 p-3">
            <p className="text-xs text-muted-foreground">Technologies</p>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {project.stack.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="surface-card p-6">
        <h3 className="flex items-center gap-2 font-semibold">
          <Upload className="size-4 text-primary" /> Submission
        </h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label className="text-xs font-medium">GitHub repository</Label>
            <Input
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              placeholder="https://github.com/you/project"
            />
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs font-medium">Live demo (optional)</Label>
            <Input
              value={demo}
              onChange={(e) => setDemo(e.target.value)}
              placeholder="https://project.vercel.app"
            />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={submitForReview} disabled={project.stage === "Completed"}>
            <Send className="size-4" />
            {project.stage === "Review" ? "Resubmit for review" : "Submit project"}
          </Button>
          {project.repoUrl && (
            <Button asChild variant="outline">
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                <Github className="size-4" /> Open GitHub
              </a>
            </Button>
          )}
          {project.demoUrl && (
            <Button asChild variant="outline">
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-4" /> Open demo
              </a>
            </Button>
          )}
        </div>
      </div>

      <div className="surface-card p-6">
        <h3 className="flex items-center gap-2 font-semibold">
          <MessageSquare className="size-4 text-primary" /> Mentor feedback
        </h3>
        {project.feedback?.length ? (
          <div className="mt-4 space-y-3">
            {project.feedback.map((f) => (
              <div key={`${f.mentor}-${f.date}`} className="rounded-xl bg-surface-2 p-4">
                <p className="flex items-center gap-2 text-xs font-medium">
                  {f.mentor}
                  <span className="ml-auto text-muted-foreground">{prettyDate(f.date)}</span>
                </p>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.text}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            No feedback yet — submit your repository to enter the mentor review queue.
          </p>
        )}
      </div>
    </div>
  );
}
