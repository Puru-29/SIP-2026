import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Check,
  ChevronDown,
  Clock,
  FolderKanban,
  PlayCircle,
  Signal,
  Sparkles,
  Star,
  Users,
  UsersRound,
} from "lucide-react";
import { useState } from "react";

import { Reveal } from "@/components/common/motion-primitives";
import { PublicShell } from "@/components/layout/PublicShell";
import { CourseCard } from "@/components/cards/CourseCard";
import { DemoVideoDialog, VideoPlayer } from "@/components/common/VideoPlayer";
import { Button } from "@/components/ui/button";
import { courses, getCourse, relatedCourses } from "@/data/courses";
import { programs } from "@/data/programs";
import { compact, inr } from "@/lib/format";
import { imageFor } from "@/lib/images";
import { notify, useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/courses/$courseId")({
  loader: ({ params }) => {
    const course = getCourse(params.courseId);
    if (!course) throw notFound();
    return { course };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Course unavailable — Unified Mentor" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const c = loaderData.course;
    return {
      meta: [
        { title: `${c.title} — Unified Mentor` },
        { name: "description", content: c.tagline },
        { property: "og:title", content: `${c.title} — Unified Mentor` },
        { property: "og:description", content: c.tagline },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: CourseDetail,
  notFoundComponent: CourseNotFound,
});

function CourseNotFound() {
  return (
    <PublicShell>
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-semibold">We couldn&apos;t find that course</h1>
        <p className="mt-3 text-muted-foreground">
          It may have been renamed. Browse the full catalogue to find what you need.
        </p>
        <Button asChild className="mt-6">
          <Link to="/courses">Browse courses</Link>
        </Button>
      </div>
    </PublicShell>
  );
}

function CourseDetail() {
  const { course } = Route.useLoaderData();
  const {
    enrollCourse,
    isCourseEnrolled,
    enroll,
    hydrated,
    isSaved,
    toggleSave,
    courseProgressOf,
  } = useApp();
  const [openModule, setOpenModule] = useState(0);
  const [demoOpen, setDemoOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const enrolled = hydrated && isCourseEnrolled(course.id);
  const saved = hydrated && isSaved("course", course.id);
  const progress = enrolled ? courseProgressOf(course.id) : 0;
  const related = relatedCourses(course);
  const discount = Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100);

  async function handleEnroll() {
    setBusy(true);
    await enrollCourse(course.id, course.title);
    if (course.programSlug) {
      const program = programs.find((p) => p.slug === course.programSlug);
      if (program) await enroll(program.id);
    }
    setBusy(false);
    notify(`You're enrolled in ${course.title}`, "Lesson 1 is unlocked in your course workspace.");
  }

  return (
    <PublicShell>
      <section className="hero-gradient relative overflow-hidden border-b border-border">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-20" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
          <Reveal>
            <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Link to="/courses" className="hover:text-primary">
                Courses
              </Link>
              <span>/</span>
              <span className="text-foreground">{course.category}</span>
            </nav>
            <h1 className="mt-4 text-4xl font-semibold text-balance sm:text-5xl">{course.title}</h1>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">{course.tagline}</p>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              <span className="flex items-center gap-1.5 font-semibold">
                <Star className="size-4 fill-warning text-warning" /> {course.rating.toFixed(1)}
                <span className="font-normal text-muted-foreground">
                  ({compact(course.reviewCount)} reviews)
                </span>
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Users className="size-4" /> {compact(course.learners)} learners
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Signal className="size-4" /> {course.level}
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="size-4" /> {course.hours} hours
              </span>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              {enrolled ? (
                <Button asChild size="lg">
                  <Link to="/learning/course/$courseId" params={{ courseId: course.id }}>
                    <PlayCircle className="size-4" />{" "}
                    {progress > 0 ? "Continue learning" : "Start learning"}
                  </Link>
                </Button>
              ) : (
                <Button size="lg" onClick={() => void handleEnroll()} disabled={busy}>
                  <Sparkles className="size-4" /> Enroll now — {inr(course.price)}
                </Button>
              )}
              <Button size="lg" variant="outline" onClick={() => setDemoOpen(true)}>
                <PlayCircle className="size-4" /> Watch demo lecture
              </Button>
              <Button
                size="lg"
                variant="ghost"
                onClick={() => void toggleSave("course", course.id)}
                aria-label={saved ? "Remove from saved courses" : "Save this course"}
              >
                {saved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
                {saved ? "Saved" : "Save"}
              </Button>
            </div>
            {enrolled && (
              <p className="mt-3 text-sm text-success">
                You&apos;re enrolled — {progress}% complete. Progress syncs to your dashboard.
              </p>
            )}
          </Reveal>

          <Reveal delay={0.1}>
            <div className="surface-card overflow-hidden p-0">
              <VideoPlayer
                src={course.demoVideo}
                {...(course.demoVideoFallback ? { srcFallback: course.demoVideoFallback } : {})}
                poster={imageFor(course.category)}
                title={`${course.title} — free demo lecture`}
                {...(course.demoCredit ? { credit: course.demoCredit } : {})}
                className="rounded-none border-0 border-b"
              />
              <div className="p-5">
                <p className="mb-3 text-xs text-muted-foreground">
                  Free demo lecture · {course.instructor.name}, {course.instructor.title} at{" "}
                  {course.instructor.company}
                </p>
                <div className="flex items-end gap-3">
                  <p className="font-display text-2xl font-semibold">{inr(course.price)}</p>
                  <p className="text-sm text-muted-foreground line-through">
                    {inr(course.originalPrice)}
                  </p>
                  {discount > 0 && (
                    <span className="rounded-full bg-success/15 px-2 py-0.5 text-xs font-bold text-success">
                      {discount}% off
                    </span>
                  )}
                </div>
                <ul className="mt-4 space-y-2 text-sm">
                  <Fact
                    icon={<BookOpen className="size-4" />}
                    label={`${course.lessonCount} lessons across ${course.modules.length} modules`}
                  />
                  <Fact
                    icon={<FolderKanban className="size-4" />}
                    label={`${course.projects} portfolio projects`}
                  />
                  {course.certificate && (
                    <Fact icon={<Award className="size-4" />} label="Verifiable certificate" />
                  )}
                  {course.mentorship && (
                    <Fact icon={<UsersRound className="size-4" />} label="1:1 mentor reviews" />
                  )}
                  <Fact
                    icon={<Clock className="size-4" />}
                    label={`${course.mode} · lifetime access`}
                  />
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
        <div className="space-y-12">
          <Section title="About this course">
            <p className="leading-relaxed text-muted-foreground">{course.description}</p>
          </Section>

          <Section title="What you'll learn">
            <div className="grid gap-3 sm:grid-cols-2">
              {course.outcomes.map((o) => (
                <div key={o} className="flex gap-2.5 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-success" />
                  <span>{o}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Curriculum">
            <p className="-mt-2 mb-4 text-sm text-muted-foreground">
              {course.modules.length} modules · {course.lessonCount} lessons
            </p>
            <div className="divide-y divide-border overflow-hidden rounded-xl border border-border">
              {course.modules.map((m, i) => {
                const open = openModule === i;
                return (
                  <div key={m.title}>
                    <button
                      onClick={() => setOpenModule(open ? -1 : i)}
                      aria-expanded={open}
                      className="flex w-full items-center gap-3 bg-card px-4 py-4 text-left transition-colors hover:bg-surface-2"
                    >
                      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/12 text-xs font-bold text-primary">
                        {i + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">{m.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {m.lessons.length} lessons
                        </span>
                      </span>
                      <ChevronDown
                        className={cn(
                          "size-4 shrink-0 text-muted-foreground transition-transform",
                          open && "rotate-180",
                        )}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden bg-surface-2"
                        >
                          {m.lessons.map((l) => (
                            <li
                              key={l}
                              className="flex items-center gap-2.5 px-4 py-2.5 pl-15 text-sm text-muted-foreground"
                            >
                              <PlayCircle className="size-3.5 shrink-0 text-primary" />
                              {l}
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </Section>

          <Section title="Skills you'll gain">
            <div className="flex flex-wrap gap-2">
              {course.skills.map((s) => (
                <span
                  key={s}
                  className="rounded-lg bg-surface-2 px-3 py-1.5 text-sm text-muted-foreground"
                >
                  {s}
                </span>
              ))}
            </div>
          </Section>

          <Section title="Learner reviews">
            <div className="grid gap-4 sm:grid-cols-2">
              {course.reviews.map((r) => (
                <figure key={r.name} className="surface-card p-5">
                  <div className="flex gap-0.5">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="size-3.5 fill-warning text-warning" />
                    ))}
                  </div>
                  <blockquote className="mt-3 text-sm leading-relaxed">“{r.text}”</blockquote>
                  <figcaption className="mt-3 text-xs text-muted-foreground">
                    {r.name} · {r.role}
                  </figcaption>
                </figure>
              ))}
            </div>
          </Section>

          <Section title="Frequently asked questions">
            <div className="divide-y divide-border rounded-xl border border-border bg-card">
              {course.faqs.map((f) => (
                <details key={f.q} className="group px-4 py-4">
                  <summary className="flex cursor-pointer items-center justify-between gap-3 text-sm font-medium">
                    {f.q}
                    <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </Section>
        </div>

        <aside className="space-y-8">
          <div className="surface-card p-5">
            <p className="text-xs font-semibold tracking-widest text-primary uppercase">
              Your instructor
            </p>
            <div className="mt-4 flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-full bg-gradient-to-br from-primary/25 to-accent/25 text-sm font-bold">
                {course.instructor.initials}
              </span>
              <div>
                <p className="font-semibold">{course.instructor.name}</p>
                <p className="text-xs text-muted-foreground">
                  {course.instructor.title} · {course.instructor.company}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {course.instructor.bio}
            </p>
          </div>

          <div className="surface-card p-5">
            <p className="text-xs font-semibold tracking-widest text-primary uppercase">
              Career benefits
            </p>
            <ul className="mt-4 space-y-2.5">
              {course.careerBenefits.map((b) => (
                <li key={b} className="flex gap-2.5 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-success" />
                  <span className="text-muted-foreground">{b}</span>
                </li>
              ))}
            </ul>
            <Button asChild variant="outline" className="mt-5 w-full">
              <Link to="/career-tools">Explore career tools</Link>
            </Button>
          </div>

          {course.programSlug && (
            <div className="surface-card p-5">
              <p className="text-sm font-semibold">Part of a full mentored program</p>
              <p className="mt-2 text-sm text-muted-foreground">
                The program bundles this course with mentorship, placement support and a capstone.
              </p>
              <Button asChild className="mt-4 w-full">
                <Link to="/programs/$slug" params={{ slug: course.programSlug }}>
                  View the program
                </Link>
              </Button>
            </div>
          )}
        </aside>
      </div>

      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-semibold">Learners also take</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
          <p className="mt-8 text-sm text-muted-foreground">
            Browse all {courses.length} courses in the{" "}
            <Link to="/courses" className="text-primary hover:underline">
              catalogue
            </Link>
            .
          </p>
        </div>
      </section>
      <DemoVideoDialog
        open={demoOpen}
        onClose={() => setDemoOpen(false)}
        src={course.demoVideo}
        {...(course.demoVideoFallback ? { srcFallback: course.demoVideoFallback } : {})}
        poster={imageFor(course.category)}
        title={course.title}
        subtitle={`${course.instructor.name} · ${course.instructor.title}, ${course.instructor.company}`}
        {...(course.demoCredit ? { credit: course.demoCredit } : {})}
      />
    </PublicShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-2xl font-semibold">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Fact({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <li className="flex items-center gap-2.5 text-muted-foreground">
      <span className="text-primary">{icon}</span>
      {label}
    </li>
  );
}
