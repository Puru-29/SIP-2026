import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  FileCode2,
  Loader2,
  PlayCircle,
  Trophy,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { VideoPlayer } from "@/components/common/VideoPlayer";
import { PublicShell } from "@/components/layout/PublicShell";
import { Button } from "@/components/ui/button";
import { programs } from "@/data/programs";
import { programDemoVideo } from "@/lib/demo-videos";
import { imageFor } from "@/lib/images";
import { programLessons, useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/learning/$programId")({
  head: () => ({
    meta: [
      { title: "Learning workspace — Unified Mentor" },
      {
        name: "description",
        content:
          "Work through your Unified Mentor program lesson by lesson with saved progress and project checkpoints.",
      },
      { property: "og:title", content: "Learning workspace — Unified Mentor" },
      {
        property: "og:description",
        content: "Lesson-by-lesson learning with progress saved to your account.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LearningPage,
});

function LearningPage() {
  const { programId } = Route.useParams();
  const navigate = useNavigate();
  const { user, loading, enrollments, completeLesson, isLessonComplete, enroll } = useApp();
  const program = programs.find((p) => p.id === programId || p.slug === programId);
  const enrollment = enrollments.find((e) => e.programId === program?.id);
  const lessons = useMemo(() => (program ? programLessons(program.id) : []), [program]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate({
        to: "/auth",
        search: { mode: "login", redirect: `/learning/${programId}` },
        replace: true,
      });
    }
  }, [loading, user, navigate, programId]);

  useEffect(() => {
    if (!activeId && lessons.length && enrollment) {
      const next = lessons.find((l) => !enrollment.completedLessons.includes(l.id));
      setActiveId((next ?? lessons[0]!).id);
    }
  }, [activeId, lessons, enrollment]);

  if (loading) {
    return (
      <PublicShell>
        <div className="mx-auto max-w-5xl px-4 py-24">
          <div className="h-8 w-64 animate-pulse rounded-lg bg-surface-2" />
          <div className="mt-6 h-64 animate-pulse rounded-2xl bg-surface-2" />
        </div>
      </PublicShell>
    );
  }

  if (!program) {
    return (
      <PublicShell>
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <h1 className="font-display text-2xl font-semibold">Program not found</h1>
          <Button asChild className="mt-5">
            <Link to="/programs">Browse programs</Link>
          </Button>
        </div>
      </PublicShell>
    );
  }

  if (!enrollment) {
    return (
      <PublicShell>
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <h1 className="font-display text-2xl font-semibold">You're not enrolled yet</h1>
          <p className="mt-3 text-muted-foreground">
            Enroll in {program.title} to unlock the lesson workspace, projects and certificate.
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <Button
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                await enroll(program.id);
                setBusy(false);
              }}
            >
              {busy ? <Loader2 className="size-4 animate-spin" /> : "Enroll now"}
            </Button>
            <Button asChild variant="outline">
              <Link to="/programs/$slug" params={{ slug: program.slug }}>
                Program details
              </Link>
            </Button>
          </div>
        </div>
      </PublicShell>
    );
  }

  const active = lessons.find((l) => l.id === activeId) ?? lessons[0];
  const demo = programDemoVideo(program);
  const isDemoLesson = !!active && !!lessons[0] && active.id === lessons[0].id;
  const completedCount = enrollment.completedLessons.length;
  const total = lessons.length || 1;
  const progress = Math.round((completedCount / total) * 100);
  const nextLesson = lessons.find((l) => !enrollment.completedLessons.includes(l.id));

  return (
    <PublicShell>
      <div className="mx-auto max-w-[1400px] px-4 pt-24 pb-16 sm:px-6 lg:px-8">
        <Link
          to="/dashboard/learning"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="size-4" /> My learning
        </Link>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-semibold sm:text-3xl">{program.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {completedCount} of {lessons.length} lessons complete · {progress}%
            </p>
          </div>
          {progress === 100 ? (
            <Button asChild>
              <Link to="/dashboard/certificates">
                <Trophy className="size-4" /> View certificate
              </Link>
            </Button>
          ) : nextLesson ? (
            <Button onClick={() => setActiveId(nextLesson.id)}>
              <PlayCircle className="size-4" /> Continue: {nextLesson.title}
            </Button>
          ) : null}
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="surface-card max-h-[70vh] overflow-y-auto p-3">
            {program.curriculum.map((mod, mi) => (
              <div key={mod.title} className="mb-3">
                <p className="px-2 py-1.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  {mod.title}
                </p>
                <div className="space-y-0.5">
                  {mod.items.map((item, ii) => {
                    const id = `m${mi}-l${ii}`;
                    const done = isLessonComplete(program.id, id);
                    return (
                      <button
                        key={id}
                        onClick={() => setActiveId(id)}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                          id === activeId
                            ? "bg-primary/12 text-primary"
                            : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
                        )}
                      >
                        {done ? (
                          <CheckCircle2 className="size-4 shrink-0 text-success" />
                        ) : (
                          <Circle className="size-4 shrink-0" />
                        )}
                        <span className="truncate">{item.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </aside>

          <section className="surface-card p-6 sm:p-8">
            {active ? (
              <>
                <p className="text-xs font-semibold tracking-widest text-primary uppercase">
                  {isDemoLesson ? "Free demo" : `${active.module} · ${active.type}`}
                </p>
                <h2 className="mt-2 font-display text-xl font-semibold sm:text-2xl">
                  {active.title}
                </h2>

                {isDemoLesson ? (
                  demo ? (
                    <VideoPlayer
                      key={active.id}
                      src={demo.src}
                      srcFallback={demo.srcFallback}
                      poster={imageFor(program.category)}
                      title={active.title}
                      credit={demo.credit}
                      className="mt-6"
                    />
                  ) : (
                    <div className="mt-6 grid aspect-video place-items-center rounded-xl border border-border bg-surface-2">
                      <div className="text-center">
                        <PlayCircle className="mx-auto size-10 text-primary" />
                        <p className="mt-3 text-sm text-muted-foreground">Demo video coming soon</p>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="mt-6 grid aspect-video place-items-center rounded-xl border border-border bg-surface-2">
                    <div className="text-center">
                      {active.type === "project" ? (
                        <FileCode2 className="mx-auto size-10 text-primary" />
                      ) : (
                        <PlayCircle className="mx-auto size-10 text-primary" />
                      )}
                      <p className="mt-3 text-sm text-muted-foreground">
                        {active.type === "project"
                          ? "Project brief, starter repo and review rubric"
                          : "Lesson walkthrough with guided practice"}
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-6 space-y-3 text-sm leading-relaxed text-muted-foreground">
                  <p>
                    In this {active.type}, you'll work through {active.title.toLowerCase()} with
                    hands-on exercises reviewed by a mentor. Everything you complete is saved to
                    your account, so you can pick up on any device.
                  </p>
                  <ul className="list-inside list-disc space-y-1">
                    <li>Guided walkthrough with checkpoints</li>
                    <li>Practice exercises and solutions</li>
                    <li>Mentor notes and interview-ready talking points</li>
                  </ul>
                </div>

                <div className="mt-8 flex flex-wrap gap-2 border-t border-border pt-6">
                  <Button
                    disabled={busy || isLessonComplete(program.id, active.id)}
                    onClick={async () => {
                      setBusy(true);
                      await completeLesson(
                        program.id,
                        active.id,
                        `${active.module} · ${active.title}`,
                      );
                      setBusy(false);
                      const idx = lessons.findIndex((l) => l.id === active.id);
                      const next = lessons[idx + 1];
                      if (next) setActiveId(next.id);
                    }}
                  >
                    {busy ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : isLessonComplete(program.id, active.id) ? (
                      "Completed"
                    ) : (
                      "Mark complete & continue"
                    )}
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/dashboard/projects">Project workspace</Link>
                  </Button>
                  <Button asChild variant="ghost">
                    <Link to="/mentors">Ask a mentor</Link>
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No lessons available yet.</p>
            )}
          </section>
        </div>
      </div>
    </PublicShell>
  );
}
