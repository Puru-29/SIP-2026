import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark, BookmarkX } from "lucide-react";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { useStudentNav } from "@/components/layout/dashboard-nav";
import { Button } from "@/components/ui/button";
import { courses } from "@/data/courses";
import { internships, jobs } from "@/data/opportunities";
import { programs } from "@/data/programs";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/dashboard/saved")({
  head: () => ({
    meta: [
      { title: "Saved items — Unified Mentor" },
      {
        name: "description",
        content:
          "Every program, course, internship and job you bookmarked on Unified Mentor, saved to your account.",
      },
      { property: "og:title", content: "Saved items — Unified Mentor" },
      {
        property: "og:description",
        content: "Your bookmarked programs, courses, internships and jobs.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SavedPage,
});

function SavedPage() {
  return (
    <DashboardShell
      allow={["student"]}
      title="Saved"
      subtitle="Bookmarked programs, courses, internships and jobs"
      items={useStudentNav()}
    >
      <Inner />
    </DashboardShell>
  );
}

function Inner() {
  const { savedPrograms, savedCourses, savedJobs, savedInternships, toggleSave } = useApp();

  const rows = [
    ...savedPrograms
      .map((id) => programs.find((p) => p.id === id))
      .filter(Boolean)
      .map((p) => ({
        kind: "program" as const,
        id: p!.id,
        title: p!.title,
        meta: `${p!.category} · ${p!.durationWeeks} weeks`,
        link: (
          <Link to="/programs/$slug" params={{ slug: p!.slug }}>
            View program
          </Link>
        ),
      })),
    ...savedCourses
      .map((id) => courses.find((c) => c.id === id))
      .filter(Boolean)
      .map((c) => ({
        kind: "course" as const,
        id: c!.id,
        title: c!.title,
        meta: `${c!.category} · ${c!.hours} hours`,
        link: (
          <Link to="/courses/$courseId" params={{ courseId: c!.id }}>
            View course
          </Link>
        ),
      })),
    ...savedInternships
      .map((id) => internships.find((i) => i.id === id))
      .filter(Boolean)
      .map((i) => ({
        kind: "internship" as const,
        id: i!.id,
        title: i!.title,
        meta: `${i!.company} · ${i!.location}`,
        link: (
          <Link to="/internships/$internshipId" params={{ internshipId: i!.id }}>
            View internship
          </Link>
        ),
      })),
    ...savedJobs
      .map((id) => jobs.find((j) => j.id === id))
      .filter(Boolean)
      .map((j) => ({
        kind: "job" as const,
        id: j!.id,
        title: j!.title,
        meta: `${j!.company} · ${j!.location}`,
        link: (
          <Link to="/jobs/$jobId" params={{ jobId: j!.id }}>
            View job
          </Link>
        ),
      })),
  ];

  if (rows.length === 0) {
    return (
      <div className="surface-card p-10 text-center">
        <Bookmark className="mx-auto size-8 text-muted-foreground" />
        <h2 className="mt-3 font-display text-xl font-semibold">Nothing saved yet</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Tap the bookmark icon on any program, course, internship or job to keep it here.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Button asChild>
            <Link to="/programs">Browse programs</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/jobs">Browse jobs</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{rows.length}</span> saved item
        {rows.length === 1 ? "" : "s"}
      </p>
      {rows.map((r) => (
        <div
          key={`${r.kind}-${r.id}`}
          className="surface-card flex flex-wrap items-center justify-between gap-3 p-4"
        >
          <div className="min-w-0">
            <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase">
              {r.kind}
            </span>
            <p className="mt-1.5 font-medium">{r.title}</p>
            <p className="text-xs text-muted-foreground">{r.meta}</p>
          </div>
          <div className="flex gap-2">
            <Button asChild size="sm" variant="outline">
              {r.link}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => void toggleSave(r.kind, r.id)}>
              <BookmarkX className="size-4" /> Remove
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
