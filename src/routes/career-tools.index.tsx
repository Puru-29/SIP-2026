import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BrainCircuit, FileText, ShieldCheck, Target } from "lucide-react";

import { Reveal, Stagger, StaggerItem } from "@/components/common/motion-primitives";
import { PublicShell } from "@/components/layout/PublicShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/career-tools/")({
  head: () => ({
    meta: [
      { title: "Career Tools — Unified Mentor" },
      {
        name: "description",
        content:
          "ATS resume checker, resume builder, career path finder and explained job matching — the full career stack, included with every account.",
      },
      { property: "og:title", content: "Career Tools — Unified Mentor" },
      {
        property: "og:description",
        content: "ATS checker, resume builder, career path finder and job matching in one place.",
      },
    ],
  }),
  component: CareerTools,
});

const tools = [
  {
    icon: ShieldCheck,
    title: "ATS Resume Checker",
    body: "Upload a resume and get an overall score with a breakdown across formatting, keywords, experience, skills and structure — plus specific fixes.",
    to: "/career-tools/ats-checker",
    cta: "Check my resume",
  },
  {
    icon: FileText,
    title: "Resume Builder",
    body: "Guided sections, four ATS-safe templates, live preview and instant print/PDF export. Your data stays in your browser.",
    to: "/career-tools/resume-builder",
    cta: "Build my resume",
  },
  {
    icon: BrainCircuit,
    title: "Career Path Finder",
    body: "Answer six questions and get a personalised roadmap: recommended role, skill gaps, programs, projects, internships and target jobs.",
    to: "/career-tools/career-path",
    cta: "Find my path",
  },
  {
    icon: Target,
    title: "Job Match",
    body: "See ranked roles with explained match scores — which skills you already have, which to close, and why the role fits.",
    to: "/career-tools/job-match",
    cta: "See my matches",
  },
];

function CareerTools() {
  return (
    <PublicShell>
      <section className="hero-gradient relative overflow-hidden border-b border-border">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-25" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-xs font-semibold tracking-widest text-primary uppercase">
              Career tools
            </p>
            <h1 className="mt-3 max-w-2xl text-4xl font-semibold text-balance sm:text-5xl">
              The gap between skilled and <span className="text-gradient">hired</span>
            </h1>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Four tools that handle the unglamorous part of a job search: the resume, the keywords,
              the targeting and the plan.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <Stagger className="grid gap-5 lg:grid-cols-2">
          {tools.map((t) => (
            <StaggerItem key={t.title} className="h-full">
              <div className="surface-card flex h-full flex-col p-7 transition-shadow hover:shadow-elevated">
                <span className="grid size-11 place-items-center rounded-xl bg-primary/12 text-primary">
                  <t.icon className="size-5" />
                </span>
                <h2 className="mt-4 font-display text-xl font-semibold">{t.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {t.body}
                </p>
                <Button asChild className="mt-6 w-fit">
                  <Link to={t.to}>
                    {t.cta} <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </PublicShell>
  );
}
