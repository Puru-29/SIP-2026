import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CalendarClock, Check, CheckCircle2, IndianRupee, MapPin, Send, Users } from "lucide-react";
import { useState } from "react";

import { InternshipCard } from "@/components/cards/InternshipCard";
import { ApplyDialog } from "@/components/common/ApplyDialog";
import { Reveal } from "@/components/common/motion-primitives";
import { SmartImage } from "@/components/common/SmartImage";
import { PublicShell } from "@/components/layout/PublicShell";
import { Button } from "@/components/ui/button";
import { internships } from "@/data/opportunities";
import { daysUntil, inr, prettyDate } from "@/lib/format";
import { imageFor } from "@/lib/images";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/internships/$internshipId")({
  loader: ({ params }) => {
    const internship = internships.find((i) => i.id === params.internshipId);
    if (!internship) throw notFound();
    return { internship };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Internship unavailable — Unified Mentor" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const i = loaderData.internship;
    const title = `${i.title} at ${i.company} — Unified Mentor`;
    return {
      meta: [
        { title },
        { name: "description", content: i.description.slice(0, 155) },
        { property: "og:title", content: title },
        { property: "og:description", content: i.description.slice(0, 155) },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: InternshipDetail,
  notFoundComponent: () => (
    <PublicShell>
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-semibold">That internship has closed</h1>
        <p className="mt-3 text-muted-foreground">
          Openings rotate weekly — here&apos;s everything currently accepting applications.
        </p>
        <Button asChild className="mt-6">
          <Link to="/internships">Browse internships</Link>
        </Button>
      </div>
    </PublicShell>
  ),
});

function InternshipDetail() {
  const { internship } = Route.useLoaderData();
  const { applications } = useApp();
  const [open, setOpen] = useState(false);
  const applied = applications.some((a) => a.kind === "internship" && a.refId === internship.id);
  const similar = internships
    .filter((i) => i.id !== internship.id && i.category === internship.category)
    .concat(internships.filter((i) => i.id !== internship.id && i.category !== internship.category))
    .slice(0, 3);

  const responsibilities = [
    `Own a real ${internship.category.toLowerCase()} workstream with weekly deliverables`,
    "Join daily standups and one design/code review per week",
    "Write up decisions so the team can pick the work up after you",
    "Present your final deliverable to the wider team in the last week",
  ];
  const requirements = [
    `Working knowledge of ${internship.skills.slice(0, 3).join(", ")}`,
    "At least one project or coursework artefact you can walk us through",
    `Available ${internship.durationMonths} months, ~25 hours per week`,
    "Comfortable writing clearly in English",
  ];

  return (
    <PublicShell>
      <section className="hero-gradient relative overflow-hidden border-b border-border">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-20" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link to="/internships" className="hover:text-primary">
              Internships
            </Link>
            <span>/</span>
            <span className="text-foreground">{internship.category}</span>
          </nav>

          <Reveal className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-start">
            <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-accent/25 to-primary/20 text-lg font-bold">
              {internship.logo}
            </span>
            <div className="flex-1">
              <h1 className="text-3xl font-semibold sm:text-4xl">{internship.title}</h1>
              <p className="mt-2 text-lg text-muted-foreground">
                {internship.company} · {internship.mode}
              </p>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-4" /> {internship.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarClock className="size-4" /> {internship.durationMonths} months
                </span>
                <span className="flex items-center gap-1.5">
                  <IndianRupee className="size-4" />
                  {internship.stipend ? `${inr(internship.stipend)} / month` : "Unpaid fellowship"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="size-4" /> {internship.applicants} applicants
                </span>
              </div>
            </div>
            <div className="w-full max-w-xs shrink-0">
              <div className="surface-card p-5">
                <p className="text-sm text-muted-foreground">
                  Applications close {prettyDate(internship.deadline)}
                </p>
                <p className="mt-1 text-sm font-semibold text-accent">
                  {daysUntil(internship.deadline)} days left
                </p>
                {applied ? (
                  <div className="mt-4 flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2.5 text-sm font-medium text-success">
                    <CheckCircle2 className="size-4" /> Application submitted
                  </div>
                ) : (
                  <Button className="mt-4 w-full" onClick={() => setOpen(true)}>
                    <Send className="size-4" /> Apply now
                  </Button>
                )}
                <Button asChild variant="outline" className="mt-2 w-full">
                  <Link to="/dashboard/applications">Track applications</Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div className="space-y-10">
          <SmartImage
            src={imageFor(internship.category)}
            alt={`${internship.category} internship illustration`}
            wrapperClassName="aspect-[16/7] w-full rounded-2xl border border-border"
            eager
          />

          <section>
            <h2 className="font-display text-2xl font-semibold">About the role</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{internship.description}</p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold">What you&apos;ll do</h2>
            <ul className="mt-3 space-y-2.5">
              {responsibilities.map((r) => (
                <li key={r} className="flex gap-2.5 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-success" />
                  <span className="text-muted-foreground">{r}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold">What we look for</h2>
            <ul className="mt-3 space-y-2.5">
              {requirements.map((r) => (
                <li key={r} className="flex gap-2.5 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span className="text-muted-foreground">{r}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold">Skills</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {internship.skills.map((s) => (
                <span
                  key={s}
                  className="rounded-lg bg-surface-2 px-3 py-1.5 text-sm text-muted-foreground"
                >
                  {s}
                </span>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="surface-card p-5">
            <p className="text-xs font-semibold tracking-widest text-primary uppercase">
              How this internship runs
            </p>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>Weekly 1:1 with an assigned mentor from the host team.</li>
              <li>Structured onboarding brief in week one, deliverable scoped in week two.</li>
              <li>Certificate and written performance summary on completion.</li>
              <li>Top performers are referred into the partner&apos;s hiring pipeline.</li>
            </ul>
          </div>
          <div className="surface-card p-5">
            <p className="text-sm font-semibold">Not ready to apply?</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Run your resume through the ATS checker first — most rejections happen before a human
              reads it.
            </p>
            <Button asChild variant="outline" className="mt-4 w-full">
              <Link to="/career-tools/ats-checker">Check my resume</Link>
            </Button>
          </div>
        </aside>
      </div>

      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-semibold">Similar openings</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((i) => (
              <InternshipCard key={i.id} internship={i} />
            ))}
          </div>
        </div>
      </section>

      <ApplyDialog
        open={open}
        onOpenChange={setOpen}
        kind="internship"
        refId={internship.id}
        title={internship.title}
        company={internship.company}
      />
    </PublicShell>
  );
}
