import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpenCheck,
  Download,
  FileQuestion,
  Headphones,
  MessagesSquare,
  Newspaper,
  NotebookPen,
  Video,
} from "lucide-react";
import { useState } from "react";

import {
  Reveal,
  SectionHeading,
  Stagger,
  StaggerItem,
} from "@/components/common/motion-primitives";
import { PublicShell } from "@/components/layout/PublicShell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources & Interview Prep — Unified Mentor" },
      {
        name: "description",
        content:
          "Practice tests, interview question banks, roadmaps, cheat sheets, mock interviews and guides for every career track.",
      },
      { property: "og:title", content: "Resources & Interview Prep — Unified Mentor" },
      {
        property: "og:description",
        content: "Practice tests, question banks, roadmaps and mock-interview kits.",
      },
    ],
  }),
  component: ResourcesPage,
});

const groups = [
  {
    key: "Practice tests",
    icon: FileQuestion,
    items: [
      { title: "JavaScript fundamentals", meta: "40 questions · 45 min", level: "Beginner" },
      { title: "React & state management", meta: "35 questions · 40 min", level: "Intermediate" },
      {
        title: "SQL joins & window functions",
        meta: "30 questions · 35 min",
        level: "Intermediate",
      },
      { title: "Python for data analysis", meta: "45 questions · 50 min", level: "Beginner" },
      { title: "System design basics", meta: "20 questions · 60 min", level: "Advanced" },
      { title: "Statistics & A/B testing", meta: "30 questions · 40 min", level: "Intermediate" },
    ],
  },
  {
    key: "Interview prep",
    icon: MessagesSquare,
    items: [
      {
        title: "150 frontend interview questions",
        meta: "With model answers",
        level: "All levels",
      },
      {
        title: "Data science case studies",
        meta: "12 end-to-end walkthroughs",
        level: "Intermediate",
      },
      { title: "Behavioural interview playbook", meta: "STAR templates", level: "All levels" },
      { title: "Mock interview scripts", meta: "Peer + mentor formats", level: "All levels" },
      { title: "Salary negotiation guide", meta: "India-specific benchmarks", level: "All levels" },
      { title: "Take-home assignment checklist", meta: "Reviewer's rubric", level: "Intermediate" },
    ],
  },
  {
    key: "Roadmaps & guides",
    icon: NotebookPen,
    items: [
      { title: "Full stack developer roadmap 2026", meta: "12-month plan", level: "Beginner" },
      { title: "Data analyst roadmap", meta: "6-month plan", level: "Beginner" },
      {
        title: "Product design portfolio guide",
        meta: "Case-study structure",
        level: "Intermediate",
      },
      { title: "Cloud & DevOps certification path", meta: "AWS + Kubernetes", level: "Advanced" },
      { title: "Cyber security starter kit", meta: "Labs + tooling", level: "Beginner" },
      {
        title: "Digital marketing metrics cheat sheet",
        meta: "CAC, LTV, ROAS",
        level: "All levels",
      },
    ],
  },
  {
    key: "Templates & downloads",
    icon: Download,
    items: [
      { title: "ATS-safe resume templates", meta: "4 formats · DOCX + PDF", level: "All levels" },
      { title: "Cover letter frameworks", meta: "5 role-specific variants", level: "All levels" },
      { title: "Project README template", meta: "Recruiter-friendly", level: "All levels" },
      { title: "Portfolio site starter", meta: "React + Tailwind", level: "Intermediate" },
      { title: "Weekly learning tracker", meta: "Notion + Sheets", level: "All levels" },
      { title: "Referral outreach scripts", meta: "LinkedIn + email", level: "All levels" },
    ],
  },
];

const media = [
  {
    icon: Video,
    title: "Live masterclasses",
    body: "Weekly sessions with hiring managers and senior ICs.",
  },
  {
    icon: Headphones,
    title: "Career podcast",
    body: "Short episodes on switching, negotiating and growing.",
  },
  {
    icon: Newspaper,
    title: "The Unified brief",
    body: "A fortnightly digest of hiring trends and role demand.",
  },
  {
    icon: BookOpenCheck,
    title: "Skill assessments",
    body: "Benchmark yourself against role-level expectations.",
  },
];

function ResourcesPage() {
  const [active, setActive] = useState(groups[0]!.key);
  const group = groups.find((g) => g.key === active) ?? groups[0]!;

  return (
    <PublicShell>
      <section className="hero-gradient relative overflow-hidden border-b border-border">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-25" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-xs font-semibold tracking-widest text-primary uppercase">
              Resources
            </p>
            <h1 className="mt-3 max-w-2xl text-4xl font-semibold text-balance sm:text-5xl">
              Everything to <span className="text-gradient">practise</span> with, free
            </h1>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Question banks, roadmaps, templates and mock-interview kits maintained alongside the
              programs.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-1.5">
          {groups.map((g) => (
            <button
              key={g.key}
              onClick={() => setActive(g.key)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                active === g.key
                  ? "bg-primary/12 text-primary"
                  : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
              )}
            >
              <g.icon className="size-4" />
              {g.key}
            </button>
          ))}
        </div>

        <Stagger key={active} className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {group.items.map((item) => (
            <StaggerItem key={item.title} className="h-full">
              <div className="surface-card flex h-full flex-col p-5">
                <span className="w-fit rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                  {item.level}
                </span>
                <h3 className="mt-3 font-semibold">{item.title}</h3>
                <p className="mt-1 flex-1 text-xs text-muted-foreground">{item.meta}</p>
                <Button variant="outline" size="sm" className="mt-5 w-full">
                  Open resource
                </Button>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Beyond the docs"
            title="Learn from people currently hiring"
            subtitle="Live sessions, a podcast and a fortnightly brief on what teams are actually screening for."
          />
          <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {media.map((m) => (
              <StaggerItem key={m.title} className="h-full">
                <div className="surface-card h-full p-6">
                  <span className="grid size-10 place-items-center rounded-xl bg-primary/12 text-primary">
                    <m.icon className="size-5" />
                  </span>
                  <h3 className="mt-4 font-semibold">{m.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{m.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <div className="surface-card mt-10 flex flex-col items-center gap-4 p-8 text-center">
            <h2 className="font-display text-xl font-semibold">Ready to put this into practice?</h2>
            <div className="flex flex-wrap justify-center gap-2">
              <Button asChild>
                <Link to="/programs">Explore programs</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/career-tools/ats-checker">Check your resume</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
