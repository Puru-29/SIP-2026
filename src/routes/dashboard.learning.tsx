import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Circle, Clock, PlayCircle } from "lucide-react";
import { useState } from "react";

import { ProgressBar } from "@/components/common/motion-primitives";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useStudentNav } from "@/components/layout/dashboard-nav";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/cards/CourseCard";
import { getCourse, recommendedCourses } from "@/data/courses";
import { programs } from "@/data/programs";
import { prettyDate } from "@/lib/format";
import { lessonKey, programLessons, useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/learning")({
  head: () => ({
    meta: [
      { title: "My Learning — Unified Mentor" },
      {
        name: "description",
        content: "Your enrolled programs, module-by-module progress and next lesson to complete.",
      },
      { property: "og:title", content: "My Learning — Unified Mentor" },
      { property: "og:description", content: "Enrolled programs and lesson-level progress." },
    ],
  }),
  component: LearningPage,
});

function LearningPage() {
  return (
    <DashboardShell
      allow={["student"]}
      title="My Learning"
      subtitle="Enrolled programs, modules and progress"
      items={useStudentNav()}
    >
      <Inner />
    </DashboardShell>
  );
}

function Inner() {
  return (
    <div className="space-y-8">
      <ProgramLearning />
      <MyCourses />
      <RecommendedForYou />
    </div>
  );
}

function MyCourses() {
  const { enrolledCourses, courseProgressOf } = useApp();
  const list = enrolledCourses
    .map((id) => getCourse(id))
    .filter((c): c is NonNullable<ReturnType<typeof getCourse>> => Boolean(c));

  return (
    <section className="surface-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold">My courses</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {list.length
              ? `${list.length} enrolled course${list.length === 1 ? "" : "s"}`
              : "Standalone courses you enroll in appear here"}
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link to="/courses">Browse course library</Link>
        </Button>
      </div>

      {list.length === 0 ? (
        <p className="mt-5 text-sm text-muted-foreground">
          Nothing here yet — every course opens with a free demo lecture, so you can try one before
          enrolling.
        </p>
      ) : (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {list.map((c) => {
            const progress = courseProgressOf(c.id);
            return (
              <div key={c.id} className="rounded-xl border border-border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold tracking-wide text-primary uppercase">
                      {c.group}
                    </p>
                    <Link
                      to="/courses/$courseId"
                      params={{ courseId: c.id }}
                      className="mt-0.5 block truncate font-medium hover:text-primary"
                    >
                      {c.title}
                    </Link>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {c.lessonCount} lessons · {c.hours}h · {c.level}
                    </p>
                  </div>
                  {progress === 100 && (
                    <span className="rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-semibold text-success">
                      Completed
                    </span>
                  )}
                </div>
                <ProgressBar value={progress} className="mt-3" />
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button asChild size="sm">
                    <Link to="/learning/course/$courseId" params={{ courseId: c.id }}>
                      <PlayCircle className="size-4" /> {progress > 0 ? "Continue" : "Start"}{" "}
                      learning
                    </Link>
                  </Button>
                  {progress === 100 && (
                    <Button asChild size="sm" variant="outline">
                      <Link to="/dashboard/certificates">Certificate</Link>
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function RecommendedForYou() {
  const { enrolledCourses, savedCourses } = useApp();
  const picks = recommendedCourses(enrolledCourses, savedCourses, 3);
  if (!picks.length) return null;
  return (
    <section>
      <h2 className="font-display text-xl font-semibold">Recommended for you</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Based on what you have enrolled in and saved.
      </p>
      <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {picks.map((c) => (
          <CourseCard key={c.id} course={c} />
        ))}
      </div>
    </section>
  );
}

function ProgramLearning() {
  const { enrollments, completeLesson, isLessonComplete } = useApp();
  const enrolled = enrollments
    .map((e) => ({ enrollment: e, program: programs.find((p) => p.id === e.programId) }))
    .filter((x) => x.program);
  const [activeId, setActiveId] = useState(enrolled[0]?.program?.id ?? "");
  const active = enrolled.find((x) => x.program?.id === activeId) ?? enrolled[0];

  if (!active?.program) {
    return (
      <div className="surface-card p-10 text-center">
        <h2 className="font-display text-xl font-semibold">No programs yet</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Enroll in a program to start tracking progress here.
        </p>
        <Button asChild className="mt-5">
          <Link to="/programs">Browse programs</Link>
        </Button>
      </div>
    );
  }

  const program = active.program;
  const enrollment = active.enrollment;
  const lessons = programLessons(program.id);
  const totalItems = lessons.length;
  const completedCount = enrollment.completedLessons.length;
  const nextLesson = lessons.find((l) => !enrollment.completedLessons.includes(l.id));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {enrolled.map((x) => (
          <button
            key={x.program!.id}
            onClick={() => setActiveId(x.program!.id)}
            className={cn(
              "rounded-xl border px-4 py-2.5 text-left text-sm transition-colors",
              x.program!.id === program.id
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:bg-surface-2",
            )}
          >
            <span className="block font-medium">{x.program!.title}</span>
            <span className="text-xs">{x.enrollment.progress}% complete</span>
          </button>
        ))}
      </div>

      <div className="surface-card p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold">{program.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Enrolled {prettyDate(enrollment.enrolledOn)} · {program.lessons} lessons ·{" "}
              {program.projects} projects
            </p>
          </div>
          <div className="w-full max-w-xs">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{enrollment.progress}%</span>
            </div>
            <ProgressBar value={enrollment.progress} className="mt-1.5" />
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-primary/30 bg-primary/8 p-4">
          <p className="text-xs font-semibold tracking-wider text-primary uppercase">Next up</p>
          <p className="mt-1.5 font-medium">{enrollment.currentLesson}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button asChild size="sm">
              <Link to="/learning/$programId" params={{ programId: program.id }}>
                <PlayCircle className="size-4" /> Continue learning
              </Link>
            </Button>
            {nextLesson && (
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  void completeLesson(
                    program.id,
                    nextLesson.id,
                    `${nextLesson.module} · ${nextLesson.title}`,
                  )
                }
              >
                <CheckCircle2 className="size-4" /> Mark lesson complete
              </Button>
            )}
            <Button asChild size="sm" variant="outline">
              <Link to="/programs/$slug" params={{ slug: program.slug }}>
                Program page
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="surface-card p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Curriculum</h3>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="size-3.5" /> {completedCount}/{totalItems} items done
          </span>
        </div>
        <div className="mt-4 space-y-4">
          {program.curriculum.map((mod, mi) => {
            return (
              <div key={mod.module} className="rounded-xl border border-border p-4">
                <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  {mod.module}
                </p>
                <p className="mt-1 font-medium">{mod.title}</p>
                <ul className="mt-3 space-y-1.5">
                  {mod.items.map((item, ii) => {
                    const done = isLessonComplete(program.id, lessonKey(mi, ii));
                    return (
                      <li
                        key={item.title}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        {done ? (
                          <CheckCircle2 className="size-4 shrink-0 text-primary" />
                        ) : (
                          <Circle className="size-4 shrink-0" />
                        )}
                        <span className={cn(done && "text-foreground")}>{item.title}</span>
                        <span className="ml-auto rounded-full bg-surface-2 px-2 py-0.5 text-[10px] tracking-wide uppercase">
                          {item.type}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
