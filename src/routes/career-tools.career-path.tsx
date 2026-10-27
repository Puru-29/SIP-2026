import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Check, RotateCcw, Sparkles } from "lucide-react";
import { useState } from "react";

import { ProgressBar, Reveal } from "@/components/common/motion-primitives";
import { PublicShell } from "@/components/layout/PublicShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { internships, jobs } from "@/data/opportunities";
import { programs } from "@/data/programs";
import { buildCareerPlan, type CareerAnswers } from "@/lib/insights";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/career-tools/career-path")({
  head: () => ({
    meta: [
      { title: "Career Path Finder — Unified Mentor" },
      {
        name: "description",
        content:
          "Answer six questions and get a personalised roadmap: recommended role, skill gaps, programs, projects, internships and target jobs.",
      },
      { property: "og:title", content: "Career Path Finder — Unified Mentor" },
      {
        property: "og:description",
        content: "A personalised career roadmap in six questions.",
      },
    ],
  }),
  component: CareerPath,
});

const educationOptions = ["Student", "Recent graduate", "Postgraduate", "Career switcher"];
const experienceOptions = [
  "No experience",
  "Internships only",
  "0–2 years",
  "2–5 years",
  "5+ years",
];
const skillOptions = [
  "JavaScript",
  "React",
  "TypeScript",
  "Node.js",
  "Python",
  "SQL",
  "Statistics",
  "Excel Modelling",
  "Figma",
  "User Research",
  "Docker",
  "AWS",
  "Power BI",
  "SEO",
  "Networking",
];
const interestOptions = [
  "Building products",
  "Web development",
  "Working with data",
  "AI & research",
  "Design & visual craft",
  "Business & strategy",
  "Infrastructure & scale",
  "Security",
];
const industryOptions = [
  "Product / SaaS",
  "Fintech",
  "E-commerce",
  "Consulting",
  "Healthcare",
  "Open to all",
];

function CareerPath() {
  const { careerPlan, setCareerPlan, user } = useApp();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<CareerAnswers>({
    education: "Student",
    experience: "No experience",
    skills: user?.skills.slice(0, 4) ?? [],
    interests: [],
    industry: "Open to all",
    goal: "",
  });

  const steps = [
    {
      title: "Where are you today?",
      body: (
        <Choices
          options={educationOptions}
          selected={[answers.education]}
          onSelect={(v) => setAnswers((a) => ({ ...a, education: v }))}
        />
      ),
    },
    {
      title: "How much work experience do you have?",
      body: (
        <Choices
          options={experienceOptions}
          selected={[answers.experience]}
          onSelect={(v) => setAnswers((a) => ({ ...a, experience: v }))}
        />
      ),
    },
    {
      title: "Which skills do you already have?",
      body: (
        <Choices
          options={skillOptions}
          multi
          selected={answers.skills}
          onSelect={(v) =>
            setAnswers((a) => ({
              ...a,
              skills: a.skills.includes(v) ? a.skills.filter((s) => s !== v) : [...a.skills, v],
            }))
          }
        />
      ),
    },
    {
      title: "What kind of work energises you?",
      body: (
        <Choices
          options={interestOptions}
          multi
          selected={answers.interests}
          onSelect={(v) =>
            setAnswers((a) => ({
              ...a,
              interests: a.interests.includes(v)
                ? a.interests.filter((s) => s !== v)
                : [...a.interests, v],
            }))
          }
        />
      ),
    },
    {
      title: "Any industry preference?",
      body: (
        <Choices
          options={industryOptions}
          selected={[answers.industry]}
          onSelect={(v) => setAnswers((a) => ({ ...a, industry: v }))}
        />
      ),
    },
    {
      title: "What's your goal for the next 12 months?",
      body: (
        <div className="space-y-2">
          <Label>In your words</Label>
          <Input
            value={answers.goal}
            placeholder="e.g. land a frontend developer job at a product company"
            onChange={(e) => setAnswers((a) => ({ ...a, goal: e.target.value }))}
          />
        </div>
      ),
    },
  ];

  const plan = careerPlan;
  const planPrograms = plan ? programs.filter((p) => plan.programSlugs.includes(p.slug)) : [];
  const planJobs = plan ? jobs.filter((j) => plan.jobIds.includes(j.id)) : [];
  const planInternships = plan ? internships.filter((i) => plan.internshipIds.includes(i.id)) : [];

  return (
    <PublicShell>
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-xs font-semibold tracking-widest text-primary uppercase">
              Career tools
            </p>
            <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Career Path Finder</h1>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Six questions in, a full roadmap out: role, skill gaps, programs, projects,
              internships and target jobs.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {!plan ? (
          <div className="surface-card p-7">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Step {step + 1} of {steps.length}
              </span>
              <span>{Math.round(((step + 1) / steps.length) * 100)}%</span>
            </div>
            <ProgressBar value={((step + 1) / steps.length) * 100} className="mt-2" />

            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="mt-7"
            >
              <h2 className="font-display text-xl font-semibold">{steps[step]!.title}</h2>
              <div className="mt-5">{steps[step]!.body}</div>
            </motion.div>

            <div className="mt-8 flex justify-between gap-3">
              <Button variant="outline" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
                Back
              </Button>
              {step === steps.length - 1 ? (
                <Button
                  onClick={() => setCareerPlan(buildCareerPlan(answers))}
                  className="shadow-glow"
                >
                  <Sparkles className="size-4" /> Build my roadmap
                </Button>
              ) : (
                <Button onClick={() => setStep((s) => s + 1)}>
                  Continue <ArrowRight className="size-4" />
                </Button>
              )}
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            <div className="surface-card p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold tracking-wider text-primary uppercase">
                    Recommended role
                  </p>
                  <h2 className="mt-1.5 font-display text-2xl font-semibold">{plan.role}</h2>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                    {plan.summary}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-3xl font-semibold text-primary">{plan.match}%</p>
                  <p className="text-xs text-muted-foreground">profile fit</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      setCareerPlan(null as never);
                      setStep(0);
                    }}
                  >
                    <RotateCcw className="size-3.5" /> Redo
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="surface-card p-6">
                <h3 className="font-semibold">Skills to close</h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {plan.skillsToLearn.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-accent/15 px-2.5 py-1 text-xs font-medium text-accent-foreground dark:text-accent"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="surface-card p-6">
                <h3 className="font-semibold">Portfolio projects to build</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {plan.projects.map((p) => (
                    <li key={p} className="flex gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="surface-card p-6">
              <h3 className="font-semibold">Programs that get you there</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {planPrograms.map((p) => (
                  <Link
                    key={p.id}
                    to="/programs/$slug"
                    params={{ slug: p.slug }}
                    className="rounded-xl border border-border p-4 transition-colors hover:border-primary hover:bg-primary/5"
                  >
                    <p className="text-xs text-muted-foreground">{p.category}</p>
                    <p className="mt-1 font-medium">{p.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {p.durationWeeks} weeks · {p.projects} projects
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="surface-card p-6">
                <h3 className="font-semibold">Internships to target</h3>
                <ul className="mt-3 space-y-2.5">
                  {planInternships.map((i) => (
                    <li key={i.id} className="text-sm">
                      <p className="font-medium">{i.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {i.company} · {i.mode}
                      </p>
                    </li>
                  ))}
                </ul>
                <Button asChild variant="outline" size="sm" className="mt-4 w-full">
                  <Link to="/internships">Browse internships</Link>
                </Button>
              </div>
              <div className="surface-card p-6">
                <h3 className="font-semibold">Jobs to aim at</h3>
                <ul className="mt-3 space-y-2.5">
                  {planJobs.map((j) => (
                    <li key={j.id} className="text-sm">
                      <Link
                        to="/jobs/$jobId"
                        params={{ jobId: j.id }}
                        className="font-medium hover:text-primary"
                      >
                        {j.title}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {j.company} · {j.location}
                      </p>
                    </li>
                  ))}
                </ul>
                <Button asChild variant="outline" size="sm" className="mt-4 w-full">
                  <Link to="/jobs">Open job portal</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </section>
    </PublicShell>
  );
}

function Choices({
  options,
  selected,
  onSelect,
  multi,
}: {
  options: string[];
  selected: string[];
  onSelect: (value: string) => void;
  multi?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = selected.includes(o);
        return (
          <button
            key={o}
            onClick={() => onSelect(o)}
            className={cn(
              "rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors",
              active
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:bg-surface-2",
            )}
          >
            {active && multi && <Check className="mr-1.5 inline size-3.5" />}
            {o}
          </button>
        );
      })}
    </div>
  );
}
