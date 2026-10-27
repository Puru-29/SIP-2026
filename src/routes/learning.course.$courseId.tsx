import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Circle, Loader2, PlayCircle, Trophy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { VideoPlayer } from "@/components/common/VideoPlayer";
import { PublicShell } from "@/components/layout/PublicShell";
import { Button } from "@/components/ui/button";
import { getCourse } from "@/data/courses";
import { imageFor } from "@/lib/images";
import { courseLessons, useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/learning/course/$courseId")({
  head: () => ({
    meta: [
      { title: "Course workspace — Unified Mentor" },
      {
        name: "description",
        content:
          "Watch lessons, mark them complete and track your course progress — all saved to your Unified Mentor account.",
      },
      { property: "og:title", content: "Course workspace — Unified Mentor" },
      {
        property: "og:description",
        content:
          "Video lessons with progress saved to your account and a certificate on completion.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CourseLearningPage,
});

function CourseLearningPage() {
  const { courseId } = Route.useParams();
  const navigate = useNavigate();
  const {
    user,
    loading,
    isCourseEnrolled,
    enrollCourse,
    completeCourseLesson,
    isCourseLessonComplete,
    courseProgressOf,
  } = useApp();
  const course = getCourse(courseId);
  const lessons = useMemo(() => courseLessons(courseId), [courseId]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate({
        to: "/auth",
        search: { mode: "login", redirect: `/learning/course/${courseId}` },
        replace: true,
      });
    }
  }, [loading, user, navigate, courseId]);

  useEffect(() => {
    // Wait for account data to hydrate, otherwise every lesson still reads as
    // incomplete and we would open lesson 1 for a returning learner.
    if (loading || activeId || !lessons.length) return;
    const next = lessons.find((l) => !isCourseLessonComplete(courseId, l.id));
    setActiveId((next ?? lessons[0]!).id);
  }, [loading, activeId, lessons, courseId, isCourseLessonComplete]);

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

  if (!course) {
    return (
      <PublicShell>
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <h1 className="font-display text-2xl font-semibold">Course not found</h1>
          <Button asChild className="mt-5">
            <Link to="/courses">Browse the course library</Link>
          </Button>
        </div>
      </PublicShell>
    );
  }

  if (!isCourseEnrolled(courseId)) {
    return (
      <PublicShell>
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <h1 className="font-display text-2xl font-semibold">You're not enrolled yet</h1>
          <p className="mt-3 text-muted-foreground">
            Enroll in {course.title} to unlock all {course.lessonCount} lessons, projects and the
            certificate.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Button
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                await enrollCourse(course.id, course.title);
                setBusy(false);
              }}
            >
              {busy ? <Loader2 className="size-4 animate-spin" /> : "Enroll now"}
            </Button>
            <Button asChild variant="outline">
              <Link to="/courses/$courseId" params={{ courseId: course.id }}>
                Course details
              </Link>
            </Button>
          </div>
        </div>
      </PublicShell>
    );
  }

  const active = lessons.find((l) => l.id === activeId) ?? lessons[0];
  const completedCount = lessons.filter((l) => isCourseLessonComplete(courseId, l.id)).length;
  const progress = courseProgressOf(courseId);
  const nextLesson = lessons.find((l) => !isCourseLessonComplete(courseId, l.id));

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
            <h1 className="font-display text-2xl font-semibold sm:text-3xl">{course.title}</h1>
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
            {course.modules.map((mod, mi) => (
              <div key={mod.title} className="mb-3">
                <p className="px-2 py-1.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  {mod.title}
                </p>
                <div className="space-y-0.5">
                  {mod.lessons.map((title, ii) => {
                    const id = `m${mi}-l${ii}`;
                    const done = isCourseLessonComplete(courseId, id);
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
                        <span className="truncate">{title}</span>
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
                  {active.module}
                </p>
                <h2 className="mt-2 font-display text-xl font-semibold sm:text-2xl">
                  {active.title}
                </h2>

                <VideoPlayer
                  key={active.id}
                  src={course.demoVideo}
                  {...(course.demoVideoFallback ? { srcFallback: course.demoVideoFallback } : {})}
                  poster={imageFor(course.category)}
                  title={active.title}
                  {...(course.demoCredit ? { credit: course.demoCredit } : {})}
                  className="mt-6"
                />

                <div className="mt-6 space-y-3 text-sm leading-relaxed text-muted-foreground">
                  <p>
                    This lesson covers {active.title.toLowerCase()} as part of {active.module}. Work
                    through the walkthrough, then apply it in the practice task before marking the
                    lesson complete — your progress is saved to your account.
                  </p>
                  <ul className="list-inside list-disc space-y-1">
                    <li>Guided walkthrough with checkpoints</li>
                    <li>Practice task and worked solution</li>
                    <li>Mentor notes and interview talking points</li>
                  </ul>
                </div>

                <div className="mt-8 flex flex-wrap gap-2 border-t border-border pt-6">
                  <Button
                    disabled={busy || isCourseLessonComplete(courseId, active.id)}
                    onClick={async () => {
                      setBusy(true);
                      await completeCourseLesson(courseId, active.id, active.title);
                      setBusy(false);
                      const idx = lessons.findIndex((l) => l.id === active.id);
                      const next = lessons[idx + 1];
                      if (next) setActiveId(next.id);
                    }}
                  >
                    {busy ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : isCourseLessonComplete(courseId, active.id) ? (
                      "Completed"
                    ) : (
                      "Mark complete & continue"
                    )}
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/courses/$courseId" params={{ courseId: course.id }}>
                      Course overview
                    </Link>
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
