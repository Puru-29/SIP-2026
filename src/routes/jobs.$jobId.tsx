import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  Bookmark,
  BriefcaseBusiness,
  Building2,
  Check,
  Clock,
  MapPin,
  Send,
  Share2,
  Sparkles,
  Wallet,
} from "lucide-react";

import { JobCard } from "@/components/cards/JobCard";
import { ApplyDialog } from "@/components/common/ApplyDialog";
import { ProgressBar, Reveal } from "@/components/common/motion-primitives";
import { PublicShell } from "@/components/layout/PublicShell";
import { Button } from "@/components/ui/button";
import { getJob, jobs } from "@/data/opportunities";
import { lpa } from "@/lib/format";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/jobs/$jobId")({
  loader: ({ params }) => {
    const job = getJob(params.jobId);
    if (!job) throw notFound();
    return { job };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Role unavailable — Unified Mentor" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const j = loaderData.job;
    const title = `${j.title} at ${j.company} — Unified Mentor`;
    return {
      meta: [
        { title },
        { name: "description", content: j.description },
        { property: "og:title", content: title },
        { property: "og:description", content: j.description },
      ],
    };
  },
  component: JobDetail,
});

function JobDetail() {
  const { job } = Route.useLoaderData();
  const [applyOpen, setApplyOpen] = useState(false);
  const { user, savedJobs, toggleSaveJob, applications } = useApp();

  const saved = savedJobs.includes(job.id);
  const applied = applications.some((a) => a.kind === "job" && a.refId === job.id);
  const userSkills = new Set((user?.skills ?? []).map((s) => s.toLowerCase()));
  const matched = job.skills.filter((s) => userSkills.has(s.toLowerCase()));
  const missing = job.skills.filter((s) => !userSkills.has(s.toLowerCase()));
  const score = user ? Math.round((matched.length / job.skills.length) * 100) : null;
  const similar = jobs.filter((j) => j.industry === job.industry && j.id !== job.id).slice(0, 2);

  async function shareJob() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const data = {
      title: `${job.title} at ${job.company}`,
      text: `${job.title} at ${job.company} — ${job.location}`,
      url,
    };
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(data);
        return;
      } catch {
        // dismissed — fall back to copying the link
      }
    }
    await navigator.clipboard.writeText(url);
    toast.success("Job link copied to clipboard");
  }

  return (
    <PublicShell>
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <Link to="/jobs" className="hover:text-foreground">
              Jobs
            </Link>
            <span>/</span>
            <span className="text-foreground">{job.title}</span>
          </nav>

          <Reveal className="mt-6">
            <div className="flex flex-wrap items-start gap-5">
              <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-primary/12 font-display text-xl font-semibold text-primary">
                {job.logo}
              </span>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-semibold sm:text-3xl">{job.title}</h1>
                <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="size-4" /> {job.company}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-4" /> {job.location} · {job.mode}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Wallet className="size-4" /> {lpa(job.salaryMin)}–{lpa(job.salaryMax)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BriefcaseBusiness className="size-4" /> {job.experience}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-4" /> {job.postedDaysAgo}d ago
                  </span>
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => void shareJob()}>
                  <Share2 className="size-4" /> Share
                </Button>
                <Button variant="outline" onClick={() => toggleSaveJob(job.id)}>
                  <Bookmark className={cn("size-4", saved && "fill-current")} />
                  {saved ? "Saved" : "Save"}
                </Button>
                <Button
                  onClick={() => setApplyOpen(true)}
                  disabled={applied}
                  className="shadow-glow"
                >
                  {applied ? (
                    <>
                      <Check className="size-4" /> Applied
                    </>
                  ) : (
                    <>
                      <Send className="size-4" /> Apply now
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.5fr_1fr] lg:px-8">
        <div className="space-y-6">
          <div className="surface-card p-6">
            <h2 className="font-display text-lg font-semibold">About the role</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{job.description}</p>
          </div>
          <div className="surface-card p-6">
            <h2 className="font-display text-lg font-semibold">What you'll do</h2>
            <ul className="mt-4 space-y-2.5">
              {job.responsibilities.map((r) => (
                <li key={r} className="flex gap-2.5 text-sm text-muted-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
          <div className="surface-card p-6">
            <h2 className="font-display text-lg font-semibold">What they're looking for</h2>
            <ul className="mt-4 space-y-2.5">
              {job.requirements.map((r) => (
                <li key={r} className="flex gap-2.5 text-sm text-muted-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-success" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="surface-card p-6">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
              <Sparkles className="size-4 text-primary" /> Your match
            </h2>
            {score === null ? (
              <>
                <p className="mt-3 text-sm text-muted-foreground">
                  Sign in to see how your skills line up with this role and what to close next.
                </p>
                <Button asChild className="mt-4 w-full">
                  <Link to="/auth" search={{ mode: "login" }}>
                    Sign in to see match
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <div className="mt-3 flex items-end gap-2">
                  <span className="font-display text-3xl font-semibold text-primary">{score}%</span>
                  <span className="pb-1 text-xs text-muted-foreground">skill overlap</span>
                </div>
                <ProgressBar value={score} className="mt-3" />
                <p className="mt-5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  You have
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {matched.length ? (
                    matched.map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-medium text-success"
                      >
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">No overlap yet</span>
                  )}
                </div>
                {missing.length > 0 && (
                  <>
                    <p className="mt-4 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                      Close these next
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {missing.map((s) => (
                        <span
                          key={s}
                          className="rounded-full bg-destructive/12 px-2.5 py-0.5 text-xs font-medium text-destructive"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                    <Button asChild variant="outline" size="sm" className="mt-4 w-full">
                      <Link to="/programs">Find a program for these skills</Link>
                    </Button>
                  </>
                )}
              </>
            )}
          </div>

          <div className="surface-card p-6">
            <h2 className="font-display text-lg font-semibold">Role snapshot</h2>
            <dl className="mt-4 space-y-3 text-sm">
              {[
                ["Employment type", job.type],
                ["Industry", job.industry],
                ["Work mode", job.mode],
                ["Experience", job.experience],
                ["Compensation", `${lpa(job.salaryMin)} – ${lpa(job.salaryMax)}`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="text-right font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>
      </section>

      {similar.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <h2 className="font-display text-xl font-semibold">Similar roles</h2>
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            {similar.map((j) => (
              <JobCard key={j.id} job={j} />
            ))}
          </div>
        </section>
      )}

      <ApplyDialog
        open={applyOpen}
        onOpenChange={setApplyOpen}
        kind="job"
        refId={job.id}
        title={job.title}
        company={job.company}
      />
    </PublicShell>
  );
}
