import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BriefcaseBusiness,
  FileText,
  Flame,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

import { Counter, ProgressBar, Reveal } from "@/components/common/motion-primitives";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useStudentNav } from "@/components/layout/dashboard-nav";
import { Button } from "@/components/ui/button";
import { programs } from "@/data/programs";
import { greeting, prettyDate } from "@/lib/format";
import { careerReadiness, matchJobs, recommendedPrograms } from "@/lib/insights";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [
      { title: "Student Dashboard — Unified Mentor" },
      {
        name: "description",
        content:
          "Track course progress, project reviews, applications, career readiness and job matches in one workspace.",
      },
      { property: "og:title", content: "Student Dashboard — Unified Mentor" },
      {
        property: "og:description",
        content: "Progress, projects, applications and readiness in one place.",
      },
    ],
  }),
  component: DashboardHome,
});

function DashboardHome() {
  return (
    <DashboardShell
      allow={["student"]}
      title="Overview"
      subtitle="Your learning and hiring progress at a glance"
      items={useStudentNav()}
    >
      <Inner />
    </DashboardShell>
  );
}

function Inner() {
  const {
    user,
    enrollments,
    enrolledCourses,
    courseProgress,
    courseLessonsDone,
    applications,
    projects,
    ats,
    resume,
    hasResume,
    certificates,
  } = useApp();
  if (!user) return null;

  const progressValues = [
    ...enrollments.map((e) => e.progress),
    ...enrolledCourses.map((c) => courseProgress[c] ?? 0),
  ];
  const avgProgress = progressValues.length
    ? Math.round(progressValues.reduce((a, b) => a + b, 0) / progressValues.length)
    : 0;
  const lessonsCompleted =
    enrollments.reduce((a, e) => a + e.completedLessons.length, 0) +
    Object.values(courseLessonsDone).reduce((a, l) => a + l.length, 0);

  // Resume score is only real once the learner has actually built or checked one.
  const resumeCompleteness = hasResume
    ? Math.min(
        100,
        (resume.personal.name ? 15 : 0) +
          (resume.personal.email ? 10 : 0) +
          (resume.personal.summary ? 15 : 0) +
          Math.min(20, resume.skills.length * 4) +
          Math.min(20, resume.experience.length * 20) +
          Math.min(20, resume.projects.length * 10),
      )
    : 0;
  const resumeScore = ats?.total ?? resumeCompleteness;
  const readiness = careerReadiness({
    progress: avgProgress,
    projects: projects.filter((p) => p.stage === "Completed" || p.progress > 50).length,
    skillCount: user.skills.length,
    experienceCount: user.experience.length,
    resumeScore,
    applications: applications.length,
  });
  const matches = matchJobs(user.skills, Math.max(0, user.experience.length)).slice(0, 3);
  const suggested = recommendedPrograms(user.skills).slice(0, 2);
  const activeStages = applications.filter((a) => a.stage !== "Rejected").length;

  return (
    <div className="space-y-6">
      <Reveal>
        <div className="surface-card relative overflow-hidden p-6 sm:p-8">
          <div className="absolute -top-24 -right-16 size-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-sm text-muted-foreground">
                {greeting()}, {user.name.split(" ")[0]}
              </p>
              <h2 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">
                You're {readiness.total}% job ready
              </h2>
              <p className="mt-2 max-w-lg text-sm text-muted-foreground">
                {readiness.total === 0
                  ? "Nothing tracked yet. Complete your profile, add your skills and experience, then enrol in a program to start building readiness."
                  : "Keep shipping reviewed projects and strengthening your resume to cross the 85% threshold recruiters filter on."}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button asChild>
                  <Link to="/dashboard/learning">
                    Continue learning <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/career-tools/ats-checker">Improve resume</Link>
                </Button>
              </div>
            </div>
            <div className="grid w-full max-w-sm gap-3 sm:grid-cols-2">
              {readiness.pillars.map((p) => (
                <div key={p.label} className="rounded-xl border border-border bg-surface-2 p-3">
                  <p className="text-xs text-muted-foreground">{p.label}</p>
                  <p className="font-display text-xl font-semibold">{p.value}%</p>
                  <ProgressBar value={p.value} className="mt-1.5" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={<TrendingUp />} label="Avg. course progress" value={avgProgress} suffix="%" />
        <Stat icon={<BriefcaseBusiness />} label="Active applications" value={activeStages} />
        <Stat icon={<FileText />} label="Resume score" value={resumeScore} suffix="%" />
        <Stat icon={<Flame />} label="Lessons completed" value={lessonsCompleted} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="surface-card p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Continue where you left off</h3>
            <Link to="/dashboard/learning" className="text-xs font-medium text-primary">
              All courses
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {enrollments.length === 0 && (
              <div className="rounded-xl border border-dashed border-border p-6 text-center">
                <p className="text-sm font-medium">You haven't enrolled in a program yet</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Pick a career track and your lessons, projects and certificate unlock here.
                </p>
                <Button asChild size="sm" className="mt-4">
                  <Link to="/programs">Browse programs</Link>
                </Button>
              </div>
            )}
            {enrollments.map((e) => {
              const found = programs.find((x) => x.id === e.programId);
              const p = { title: found?.title ?? "Program", slug: found?.slug ?? "" };
              return (
                <div key={e.programId} className="rounded-xl border border-border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium">{p.title}</p>
                    <span className="text-xs text-muted-foreground">{e.progress}%</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{e.currentLesson}</p>
                  <ProgressBar value={e.progress} className="mt-3" />
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Enrolled {prettyDate(e.enrolledOn)}
                    </span>
                    <Button asChild size="sm" variant="ghost">
                      <Link to="/learning/$programId" params={{ programId: e.programId }}>
                        Resume <ArrowRight className="size-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="surface-card p-6">
            <div className="flex items-center gap-2">
              <Target className="size-4 text-primary" />
              <h3 className="font-semibold">Top job matches</h3>
            </div>
            <div className="mt-4 space-y-3">
              {matches.map((m) => (
                <Link
                  key={m.job.id}
                  to="/jobs/$jobId"
                  params={{ jobId: m.job.id }}
                  className="block rounded-xl border border-border p-3 transition-colors hover:border-primary"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">{m.job.title}</p>
                      <p className="text-xs text-muted-foreground">{m.job.company}</p>
                    </div>
                    <span className="font-display text-lg font-semibold text-primary">
                      {m.score}%
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <Button asChild variant="outline" size="sm" className="mt-4 w-full">
              <Link to="/career-tools/job-match">Open match engine</Link>
            </Button>
          </div>

          <div className="surface-card p-6">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-accent" />
              <h3 className="font-semibold">Recommended next</h3>
            </div>
            <div className="mt-4 space-y-3">
              {suggested.map((p) => (
                <Link
                  key={p.id}
                  to="/programs/$slug"
                  params={{ slug: p.slug }}
                  className="block rounded-xl border border-border p-3 transition-colors hover:border-primary"
                >
                  <p className="text-sm font-medium">{p.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.durationWeeks} weeks · {p.level}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="surface-card p-6">
        <h3 className="font-semibold">Quick actions</h3>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Continue learning", to: "/dashboard/learning" as const },
            { label: "Improve resume", to: "/career-tools/resume-builder" as const },
            { label: "Check ATS score", to: "/career-tools/ats-checker" as const },
            { label: "Find career path", to: "/career-tools/career-path" as const },
            { label: "Browse internships", to: "/internships" as const },
            { label: "Application tracker", to: "/dashboard/applications" as const },
            { label: "Notifications", to: "/dashboard/notifications" as const },
            { label: "Complete profile", to: "/dashboard/profile" as const },
          ].map((a) => (
            <Button key={a.to} asChild variant="outline" size="sm" className="justify-between">
              <Link to={a.to}>
                {a.label} <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="surface-card p-6">
          <h3 className="font-semibold">Projects in flight</h3>
          <div className="mt-4 space-y-3">
            {projects.slice(0, 3).map((p) => (
              <div key={p.id} className="rounded-xl border border-border p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">{p.title}</p>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                    {p.stage}
                  </span>
                </div>
                <ProgressBar value={p.progress} className="mt-2.5" />
              </div>
            ))}
          </div>
          <Button asChild variant="outline" size="sm" className="mt-4 w-full">
            <Link to="/dashboard/projects">Open project board</Link>
          </Button>
        </div>

        <div className="surface-card p-6">
          <h3 className="font-semibold">Latest certificates</h3>
          <div className="mt-4 space-y-3">
            {certificates.slice(0, 3).map((c) => (
              <div key={c.id} className="rounded-xl border border-border p-3">
                <p className="text-sm font-medium">{c.title}</p>
                <p className="text-xs text-muted-foreground">
                  {c.grade} · {c.code}
                </p>
              </div>
            ))}
          </div>
          <Button asChild variant="outline" size="sm" className="mt-4 w-full">
            <Link to="/dashboard/certificates">All certificates</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  suffix,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix?: string;
}) {
  return (
    <div className="surface-card p-5">
      <div className="flex size-9 items-center justify-center rounded-xl bg-primary/12 text-primary [&_svg]:size-4">
        {icon}
      </div>
      <p className="mt-3 font-display text-2xl font-semibold">
        <Counter value={value} {...(suffix ? { suffix } : {})} />
      </p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
