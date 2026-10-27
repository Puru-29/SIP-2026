import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Award,
  BookOpen,
  Check,
  ChevronDown,
  Clock,
  FileCode2,
  Play,
  Star,
  Users,
} from "lucide-react";
import { useState } from "react";

import { ProgressBar, Reveal } from "@/components/common/motion-primitives";
import { DemoVideoDialog } from "@/components/common/VideoPlayer";
import { PublicShell } from "@/components/layout/PublicShell";
import { Button } from "@/components/ui/button";
import { mentors } from "@/data/opportunities";
import { getProgram, programs } from "@/data/programs";
import { programDemoVideo } from "@/lib/demo-videos";
import { compact, inr } from "@/lib/format";
import { imageFor } from "@/lib/images";
import { notify, useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/programs/$slug")({
  loader: ({ params }) => {
    const program = getProgram(params.slug);
    if (!program) throw notFound();
    return { program };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Program unavailable — Unified Mentor" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const p = loaderData.program;
    return {
      meta: [
        { title: `${p.title} — Unified Mentor` },
        { name: "description", content: p.description },
        { property: "og:title", content: `${p.title} — Unified Mentor` },
        { property: "og:description", content: p.description },
      ],
    };
  },
  component: ProgramDetail,
});

const tabs = ["Overview", "Curriculum", "Mentors", "Reviews", "FAQ"] as const;

function ProgramDetail() {
  const { program } = Route.useLoaderData();
  const { enroll, isEnrolled, enrollments, user, isSaved, toggleSave } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState<(typeof tabs)[number]>("Overview");
  const [openModule, setOpenModule] = useState(0);
  const [demoOpen, setDemoOpen] = useState(false);
  const demo = programDemoVideo(program);

  const enrolled = isEnrolled(program.id);
  const enrollment = enrollments.find((e) => e.programId === program.id);
  const programMentors = mentors.filter((m) => program.mentorIds.includes(m.id));
  const related = programs
    .filter((p) => p.category === program.category && p.id !== program.id)
    .slice(0, 3);
  const discount = Math.round(
    ((program.originalPrice - program.price) / program.originalPrice) * 100,
  );

  return (
    <PublicShell>
      <section className="hero-gradient relative overflow-hidden border-b border-border">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-25" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <Link to="/programs" className="hover:text-foreground">
              Programs
            </Link>
            <span>/</span>
            <span className="text-foreground">{program.title}</span>
          </nav>

          <div className="mt-6 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {program.category} · {program.level}
              </span>
              <h1 className="mt-4 text-3xl font-semibold text-balance sm:text-4xl lg:text-5xl">
                {program.title}
              </h1>
              <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
                {program.longDescription}
              </p>

              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm">
                <span className="flex items-center gap-1.5">
                  <Star className="size-4 fill-accent text-accent" />
                  <span className="font-semibold">{program.rating}</span>
                  <span className="text-muted-foreground">rating</span>
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Users className="size-4" /> {compact(program.learners)} learners
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="size-4" /> {program.durationWeeks} weeks
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <BookOpen className="size-4" /> {program.lessons} lessons
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <FileCode2 className="size-4" /> {program.projects} projects
                </span>
              </div>

              <div className="mt-6 flex flex-wrap gap-1.5">
                {program.technologies.map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-border bg-surface px-2 py-1 text-xs text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="surface-card sticky top-24 p-6 shadow-elevated">
                <div className={cn("mb-4 h-28 rounded-xl bg-gradient-to-br", program.gradient)} />
                {demo ? (
                  <Button
                    variant="outline"
                    className="mb-5 w-full"
                    onClick={() => setDemoOpen(true)}
                  >
                    <Play className="size-4" /> Watch free demo
                  </Button>
                ) : (
                  <p className="mb-5 text-center text-xs text-muted-foreground">
                    Demo video coming soon
                  </p>
                )}
                {enrolled ? (
                  <>
                    <p className="text-sm font-semibold">You're enrolled</p>
                    <ProgressBar value={enrollment?.progress ?? 0} className="mt-3" />
                    <p className="mt-2 text-xs text-muted-foreground">
                      {enrollment?.progress ?? 0}% complete · {enrollment?.currentLesson}
                    </p>
                    <Button asChild className="mt-5 w-full">
                      <Link to="/learning/$programId" params={{ programId: program.id }}>
                        <Play className="size-4" /> Continue learning
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex items-end gap-2">
                      <span className="font-display text-3xl font-semibold">
                        {inr(program.price)}
                      </span>
                      <span className="text-sm text-muted-foreground line-through">
                        {inr(program.originalPrice)}
                      </span>
                      <span className="ml-auto rounded-full bg-accent/15 px-2 py-0.5 text-xs font-semibold text-accent-foreground dark:text-accent">
                        {discount}% off
                      </span>
                    </div>
                    <Button
                      className="mt-5 w-full shadow-glow"
                      onClick={async () => {
                        if (!user) {
                          navigate({
                            to: "/auth",
                            search: { mode: "register", redirect: `/programs/${program.slug}` },
                          });
                          return;
                        }
                        await enroll(program.id);
                        notify("Enrollment confirmed", `${program.title} is now in My Learning.`);
                        navigate({ to: "/learning/$programId", params: { programId: program.id } });
                      }}
                    >
                      Enroll now
                    </Button>
                    <Button
                      variant="outline"
                      className="mt-2 w-full"
                      onClick={() => void toggleSave("program", program.id)}
                    >
                      {isSaved("program", program.id) ? "Saved to your list" : "Save for later"}
                    </Button>
                    <Button asChild variant="outline" className="mt-2 w-full">
                      <Link to="/career-tools/career-path">Not sure? Find your path</Link>
                    </Button>
                  </>
                )}

                <ul className="mt-6 space-y-2.5 border-t border-border pt-5 text-sm">
                  {[
                    `${program.projects} portfolio projects with mentor review`,
                    program.mentorship ? "1:1 mentorship and live doubt sessions" : "Self-paced",
                    program.certificate ? "Verifiable completion certificate" : "No certificate",
                    program.jobSupport
                      ? "Job support, referrals and interview prep"
                      : "Learning only",
                    "Lifetime access to updated modules",
                  ].map((f) => (
                    <li key={f} className="flex gap-2 text-muted-foreground">
                      <Check className="mt-0.5 size-4 shrink-0 text-success" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="sticky top-16 z-20 -mx-4 flex gap-1 overflow-x-auto border-b border-border bg-background/90 px-4 py-3 backdrop-blur sm:mx-0 sm:px-0">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "relative rounded-lg px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
                tab === t ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab === t && (
                <motion.span
                  layoutId="program-tab"
                  className="absolute inset-0 rounded-lg bg-primary/12"
                />
              )}
              <span className="relative">{t}</span>
            </button>
          ))}
        </div>

        <div className="py-10">
          {tab === "Overview" && (
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="surface-card p-6">
                <h2 className="font-display text-xl font-semibold">What you'll be able to do</h2>
                <ul className="mt-4 space-y-3">
                  {program.outcomes.map((o) => (
                    <li key={o} className="flex gap-2.5 text-sm text-muted-foreground">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="surface-card p-6">
                <h2 className="font-display text-xl font-semibold">Skills you'll gain</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {program.skills.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border pt-5">
                  {[
                    { label: "Duration", value: `${program.durationWeeks} weeks` },
                    { label: "Effort", value: "8–10 hrs / week" },
                    { label: "Projects", value: `${program.projects} guided` },
                    { label: "Certificate", value: program.certificate ? "Included" : "—" },
                  ].map((x) => (
                    <div key={x.label} className="rounded-xl bg-surface p-3">
                      <p className="text-xs text-muted-foreground">{x.label}</p>
                      <p className="mt-0.5 text-sm font-semibold">{x.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "Curriculum" && (
            <div className="space-y-3">
              {program.curriculum.map((mod, i) => {
                const open = openModule === i;
                return (
                  <div key={mod.module} className="surface-card overflow-hidden">
                    <button
                      onClick={() => setOpenModule(open ? -1 : i)}
                      className="flex w-full items-center gap-4 p-5 text-left"
                    >
                      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/12 text-xs font-bold text-primary">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs text-muted-foreground">{mod.module}</span>
                        <span className="block truncate font-semibold">{mod.title}</span>
                      </span>
                      <span className="hidden text-xs text-muted-foreground sm:block">
                        {mod.items.length} items
                      </span>
                      <ChevronDown
                        className={cn(
                          "size-4 shrink-0 text-muted-foreground transition-transform",
                          open && "rotate-180",
                        )}
                      />
                    </button>
                    <motion.div
                      initial={false}
                      animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <ul className="space-y-1 border-t border-border px-5 py-4">
                        {mod.items.map((item) => (
                          <li
                            key={item.title}
                            className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm hover:bg-surface-2"
                          >
                            <span
                              className={cn(
                                "rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase",
                                item.type === "project"
                                  ? "bg-accent/15 text-accent-foreground dark:text-accent"
                                  : item.type === "quiz"
                                    ? "bg-success/15 text-success"
                                    : "bg-primary/12 text-primary",
                              )}
                            >
                              {item.type}
                            </span>
                            <span className="text-muted-foreground">{item.title}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          )}

          {tab === "Mentors" && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {programMentors.map((m) => (
                <div key={m.id} className="surface-card p-6">
                  <div className="flex items-center gap-3">
                    <span className="grid size-12 place-items-center rounded-full bg-primary/12 font-semibold text-primary">
                      {m.avatar}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{m.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{m.company}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">{m.bio}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {m.expertise.slice(0, 4).map((e) => (
                      <span
                        key={e}
                        className="rounded-md bg-surface-2 px-2 py-0.5 text-[11px] text-muted-foreground"
                      >
                        {e}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="size-3.5 fill-accent text-accent" /> {m.rating}
                    </span>
                    <span>{m.sessions}+ sessions</span>
                    <span>{m.experienceYears} yrs exp</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "Reviews" && (
            <div className="grid gap-5 lg:grid-cols-3">
              {program.reviews.map((r) => (
                <div key={r.name} className="surface-card p-6">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "size-3.5",
                          i < r.rating ? "fill-accent text-accent" : "text-border",
                        )}
                      />
                    ))}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed">{r.text}</p>
                  <div className="mt-4 border-t border-border pt-4">
                    <p className="text-sm font-semibold">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.role}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "FAQ" && (
            <div className="mx-auto max-w-3xl space-y-3">
              {program.faqs.map((f) => (
                <details key={f.q} className="surface-card group p-5">
                  <summary className="cursor-pointer list-none font-medium">
                    <span className="flex items-center justify-between gap-4">
                      {f.q}
                      <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                    </span>
                  </summary>
                  <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          )}
        </div>

        {related.length > 0 && (
          <div className="border-t border-border py-12">
            <h2 className="font-display text-xl font-semibold">Related programs</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.id}
                  to="/programs/$slug"
                  params={{ slug: r.slug }}
                  className="surface-card p-5 transition-all hover:-translate-y-1 hover:shadow-soft"
                >
                  <p className="text-xs text-muted-foreground">{r.category}</p>
                  <p className="mt-1 font-semibold">{r.title}</p>
                  <p className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="size-3 fill-accent text-accent" /> {r.rating}
                    </span>
                    <span>{r.durationWeeks} weeks</span>
                    <span className="flex items-center gap-1">
                      <Award className="size-3" /> Certificate
                    </span>
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
      {demo ? (
        <DemoVideoDialog
          open={demoOpen}
          onClose={() => setDemoOpen(false)}
          src={demo.src}
          srcFallback={demo.srcFallback}
          poster={imageFor(program.category)}
          title={program.title}
          subtitle={program.description}
          credit={demo.credit}
        />
      ) : null}
    </PublicShell>
  );
}
