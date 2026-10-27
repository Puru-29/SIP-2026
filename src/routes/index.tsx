import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BrainCircuit,
  BriefcaseBusiness,
  FileCheck2,
  FileText,
  GraduationCap,
  Layers,
  MonitorPlay,
  Quote,
  Route as RouteIcon,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Users,
} from "lucide-react";
import { useState } from "react";

import {
  Counter,
  Reveal,
  SectionHeading,
  Stagger,
  StaggerItem,
} from "@/components/common/motion-primitives";
import { CourseCard } from "@/components/cards/CourseCard";
import { ProgramCard } from "@/components/cards/ProgramCard";
import { HeroPreview } from "@/components/home/HeroPreview";
import { PublicShell } from "@/components/layout/PublicShell";
import { Button } from "@/components/ui/button";
import { hiringPartners } from "@/data/opportunities";
import { courses, coursesByGroup } from "@/data/courses";
import { programs } from "@/data/programs";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Unified Mentor — Learn. Build. Get Hired." },
      {
        name: "description",
        content:
          "One platform for mentored learning, internships, real-world projects, career tools and your next opportunity. Explore 10 career programs and 150+ hiring partners.",
      },
      { property: "og:title", content: "Unified Mentor — Learn. Build. Get Hired." },
      {
        property: "og:description",
        content:
          "Mentored programs, internships, a modern job portal, resume builder and ATS checker in one unified career platform.",
      },
    ],
  }),
  component: Home,
});

const ecosystem = [
  {
    key: "Learn",
    icon: GraduationCap,
    tagline: "Structured tracks that end in proof of skill",
    items: [
      { label: "Courses", to: "/courses" },
      { label: "Live Learning", to: "/courses" },
      { label: "Structured Learning", to: "/programs" },
      { label: "Practice Tests", to: "/resources" },
      { label: "Certifications", to: "/verify" },
    ],
    cta: { label: "Explore programs", to: "/programs" },
  },
  {
    key: "Experience",
    icon: Layers,
    tagline: "Real teams, real deadlines, real code review",
    items: [
      { label: "Internships", to: "/internships" },
      { label: "Fellowships", to: "/internships" },
      { label: "Real-world Projects", to: "/dashboard/projects" },
      { label: "Mentorship", to: "/mentors" },
    ],
    cta: { label: "Browse internships", to: "/internships" },
  },
  {
    key: "Career",
    icon: Target,
    tagline: "Everything between 'I can build' and 'I am hired'",
    items: [
      { label: "Job Portal", to: "/jobs" },
      { label: "Resume Builder", to: "/career-tools/resume-builder" },
      { label: "ATS Checker", to: "/career-tools/ats-checker" },
      { label: "Interview Prep", to: "/resources" },
      { label: "Career Guidance", to: "/career-tools/career-path" },
    ],
    cta: { label: "Open career tools", to: "/career-tools" },
  },
];

const journey = [
  {
    icon: RouteIcon,
    title: "Find your path",
    body: "Six questions produce a personalised roadmap: role, skill gaps, programs, projects and target companies.",
    to: "/career-tools/career-path",
  },
  {
    icon: MonitorPlay,
    title: "Learn with mentors",
    body: "Structured modules, live doubt sessions and weekly code review from practitioners who ship for a living.",
    to: "/programs",
  },
  {
    icon: BriefcaseBusiness,
    title: "Build real experience",
    body: "Six portfolio projects plus paid internships with partner teams — tracked stage by stage.",
    to: "/internships",
  },
  {
    icon: FileCheck2,
    title: "Get hired",
    body: "ATS-tuned resume, matched jobs with explained scores, interview prep and partner referrals.",
    to: "/jobs",
  },
];

const stats = [
  { value: 100, suffix: "K+", label: "Learners" },
  { value: 150, suffix: "+", label: "Hiring partners" },
  { value: 500, suffix: "+", label: "Real-world projects" },
  { value: 95, suffix: "%", label: "Learner satisfaction" },
];

const stories = [
  {
    name: "Ananya Rao",
    role: "SDE-1 · Razorpay",
    text: "I came in knowing loops. Six projects and 40 code reviews later I had three offers. The mentorship is the product.",
    metric: "₹18 LPA offer",
  },
  {
    name: "Rohit Bansal",
    role: "Data Scientist · Meesho",
    text: "The case studies matched my actual take-home assignment. The ATS checker got my resume past the first filter.",
    metric: "4 interviews in 3 weeks",
  },
  {
    name: "Devansh Gupta",
    role: "Product Designer · Zepto",
    text: "Weekly crits changed everything. My portfolio finally looked like a working designer's, not a student's.",
    metric: "Career switch in 5 months",
  },
];

function Home() {
  const [activeEco, setActiveEco] = useState("Learn");
  const featured = programs.slice(0, 6);
  const popularCourses = [...courses].sort((a, b) => b.learners - a.learners).slice(0, 6);

  return (
    <PublicShell>
      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-30" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pt-14 pb-20 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:px-8 lg:pt-24 lg:pb-28">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
                <Sparkles className="size-3.5" /> Learn. Build. Get Hired.
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-6 text-4xl leading-[1.05] font-semibold text-balance sm:text-5xl lg:text-6xl">
                Build Skills. Gain Experience. <span className="text-gradient">Get Hired.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
                One platform for learning, real-world projects, internships, career tools and your
                next opportunity — with mentors and hiring partners built into every step.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="shadow-glow">
                  <Link to="/programs">
                    Explore Programs <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/career-tools/career-path">Find Your Career Path</Link>
                </Button>
              </div>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-10 grid max-w-lg grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4">
                {stats.map((s) => (
                  <div key={s.label}>
                    <div className="font-display text-2xl font-semibold">
                      <Counter value={s.value} suffix={s.suffix} />
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
          <HeroPreview />
        </div>

        <div className="relative border-y border-border bg-surface/60 py-4">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            <span className="text-[10px]">Hiring partners</span>
            {hiringPartners.map((p) => (
              <span key={p} className="transition-colors hover:text-foreground">
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Ecosystem */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <SectionHeading
          eyebrow="The ecosystem"
          title="Three connected systems, one career outcome"
          subtitle="Most platforms sell you a course and disappear. Unified Mentor links what you learn to what you build, and what you build to who hires you."
        />
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {ecosystem.map((eco, i) => {
            const active = activeEco === eco.key;
            return (
              <Reveal key={eco.key} delay={i * 0.08}>
                <motion.div
                  onMouseEnter={() => setActiveEco(eco.key)}
                  whileHover={{ y: -6 }}
                  className={cn(
                    "surface-card relative h-full overflow-hidden p-6 transition-shadow",
                    active && "shadow-glow",
                  )}
                >
                  <div
                    className={cn(
                      "absolute inset-x-0 top-0 h-0.5 bg-primary transition-transform duration-500",
                      active ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                  <span className="grid size-11 place-items-center rounded-xl bg-primary/12 text-primary">
                    <eco.icon className="size-5" />
                  </span>
                  <h3 className="mt-4 font-display text-xl font-semibold">{eco.key}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{eco.tagline}</p>
                  <ul className="mt-5 space-y-1.5">
                    {eco.items.map((item) => (
                      <li key={item.label}>
                        <Link
                          to={item.to}
                          className="group flex items-center justify-between rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
                        >
                          {item.label}
                          <ArrowRight className="size-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <motion.div
                    animate={{ opacity: active ? 1 : 0.55 }}
                    className="mt-5 border-t border-border pt-4"
                  >
                    <Button asChild variant="secondary" size="sm" className="w-full">
                      <Link to={eco.cta.to}>{eco.cta.label}</Link>
                    </Button>
                  </motion.div>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Journey */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <SectionHeading
            align="left"
            eyebrow="How it works"
            title="From day one to signed offer letter"
            subtitle="A single continuous track. Every stage feeds the next, and everything you produce lives in one profile employers can verify."
          />
          <Stagger className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {journey.map((step, i) => (
              <StaggerItem key={step.title}>
                <Link
                  to={step.to}
                  className="group surface-card block h-full p-6 transition-all hover:-translate-y-1.5 hover:shadow-elevated"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid size-10 place-items-center rounded-xl bg-primary/12 text-primary">
                      <step.icon className="size-5" />
                    </span>
                    <span className="font-display text-3xl font-semibold text-border">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary">
                    Open{" "}
                    <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Programs */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            align="left"
            eyebrow="Career programs"
            title="Tracks designed backwards from job descriptions"
            className="max-w-2xl"
          />
          <Button asChild variant="outline">
            <Link to="/programs">
              All 10 programs <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <StaggerItem key={p.id} className="h-full">
              <ProgramCard program={p} />
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Course library */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              align="left"
              eyebrow="Course library"
              title={`${courses.length} courses, each opening with a free demo lecture`}
              className="max-w-2xl"
            />
            <Button asChild variant="outline">
              <Link to="/courses">
                Explore all courses <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {coursesByGroup().map(([group, list]) => (
              <Link
                key={group}
                to="/courses"
                search={{ group }}
                className="rounded-full border border-border bg-card px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                {group} <span className="text-xs opacity-70">({list.length})</span>
              </Link>
            ))}
          </div>

          <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {popularCourses.map((c) => (
              <StaggerItem key={c.id} className="h-full">
                <CourseCard course={c} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Career tools band */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <SectionHeading
            eyebrow="Career tools"
            title="SaaS-grade tools, included"
            subtitle="No add-on pricing. Every learner gets the full career stack from day one."
          />
          <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: ShieldCheck,
                title: "ATS Resume Checker",
                body: "Score, breakdown and fixes across formatting, keywords and structure.",
                to: "/career-tools/ats-checker",
              },
              {
                icon: FileText,
                title: "Resume Builder",
                body: "Four templates, guided sections, live preview and instant export.",
                to: "/career-tools/resume-builder",
              },
              {
                icon: BrainCircuit,
                title: "Career Path Finder",
                body: "A personalised roadmap: role, skills, programs, projects, jobs.",
                to: "/career-tools/career-path",
              },
              {
                icon: Target,
                title: "Job Match",
                body: "Explained match scores so you know exactly what to fix.",
                to: "/career-tools/job-match",
              },
            ].map((t) => (
              <StaggerItem key={t.title} className="h-full">
                <Link
                  to={t.to}
                  className="group surface-card block h-full p-6 transition-all hover:-translate-y-1.5 hover:shadow-glow"
                >
                  <span className="grid size-10 place-items-center rounded-xl bg-accent/15 text-accent-foreground dark:text-accent">
                    <t.icon className="size-5" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold">{t.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{t.body}</p>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Stories */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <SectionHeading
          eyebrow="Success stories"
          title="Outcomes, not testimonials"
          subtitle="Every story below ties back to shipped projects, verified certificates and partner referrals."
        />
        <Stagger className="mt-12 grid gap-5 lg:grid-cols-3">
          {stories.map((s) => (
            <StaggerItem key={s.name} className="h-full">
              <div className="surface-card flex h-full flex-col p-6">
                <Quote className="size-6 text-primary/40" />
                <p className="mt-4 flex-1 text-sm leading-relaxed">{s.text}</p>
                <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                  <span className="grid size-10 place-items-center rounded-full bg-primary/12 text-sm font-semibold text-primary">
                    {s.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{s.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{s.role}</p>
                  </div>
                  <span className="ml-auto shrink-0 rounded-full bg-success/15 px-2.5 py-1 text-[11px] font-semibold text-success">
                    {s.metric}
                  </span>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal className="mt-10">
          <div className="surface-card flex flex-wrap items-center justify-around gap-6 p-6">
            {[
              { icon: Star, label: "4.8 average program rating" },
              { icon: Users, label: "1:12 mentor to learner ratio" },
              { icon: Award, label: "Verifiable certificates" },
              { icon: BriefcaseBusiness, label: "Partner referral loop" },
            ].map((x) => (
              <span key={x.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                <x.icon className="size-4 text-primary" /> {x.label}
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-7xl">
          <div className="hero-gradient relative overflow-hidden rounded-3xl border border-border p-10 text-center lg:p-16">
            <div className="grid-lines pointer-events-none absolute inset-0 opacity-30" />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-3xl font-semibold text-balance sm:text-4xl">
                Your next offer starts with one structured path
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                Join 100,000+ learners building proof of skill — and get the career tools, mentors
                and hiring partners that turn that proof into interviews.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button asChild size="lg" className="shadow-glow">
                  <Link to="/auth" search={{ mode: "register" }}>
                    Get started free <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/programs">Explore programs</Link>
                </Button>
              </div>
              <p className="mt-6 text-xs text-muted-foreground">
                Demo logins: student@unifiedmentor.com / Student@UM2026 · admin · mentor · recruiter
              </p>
            </div>
          </div>
        </Reveal>
      </section>
    </PublicShell>
  );
}
