import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark, Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

import { JobCard } from "@/components/cards/JobCard";
import { Reveal, Stagger, StaggerItem } from "@/components/common/motion-primitives";
import { PublicShell } from "@/components/layout/PublicShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { jobIndustries, jobs } from "@/data/opportunities";
import { matchJobs } from "@/lib/insights";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/jobs/")({
  head: () => ({
    meta: [
      { title: "Job Portal — Unified Mentor" },
      {
        name: "description",
        content:
          "Browse curated full-time roles from 150+ hiring partners with explained match scores, salary ranges and one-click applications.",
      },
      { property: "og:title", content: "Job Portal — Unified Mentor" },
      {
        property: "og:description",
        content: "Curated roles with explained match scores and one-click applications.",
      },
    ],
  }),
  component: JobsPage,
});

const modes = ["All", "Remote", "Hybrid", "On-site"] as const;
const sorts = ["Relevance", "Newest", "Salary: high to low"] as const;

function JobsPage() {
  const { user, savedJobs } = useApp();
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<(typeof modes)[number]>("All");
  const [industry, setIndustry] = useState("All");
  const [maxExp, setMaxExp] = useState(10);
  const [sort, setSort] = useState<(typeof sorts)[number]>("Relevance");
  const [onlySaved, setOnlySaved] = useState(false);

  const matchMap = useMemo(() => {
    if (!user) return new Map<string, number>();
    return new Map(matchJobs(user.skills, 1).map((m) => [m.job.id, m.score] as const));
  }, [user]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = jobs.filter(
      (j) =>
        (!q ||
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.skills.some((s) => s.toLowerCase().includes(q))) &&
        (mode === "All" || j.mode === mode) &&
        (industry === "All" || j.industry === industry) &&
        j.experienceYears <= maxExp &&
        (!onlySaved || savedJobs.includes(j.id)),
    );
    list = [...list].sort((a, b) => {
      if (sort === "Newest") return a.postedDaysAgo - b.postedDaysAgo;
      if (sort === "Salary: high to low") return b.salaryMax - a.salaryMax;
      return (matchMap.get(b.id) ?? 0) - (matchMap.get(a.id) ?? 0);
    });
    return list;
  }, [query, mode, industry, maxExp, onlySaved, savedJobs, sort, matchMap]);

  return (
    <PublicShell>
      <section className="hero-gradient relative overflow-hidden border-b border-border">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-25" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-xs font-semibold tracking-widest text-primary uppercase">
              Job portal
            </p>
            <h1 className="mt-3 max-w-2xl text-4xl font-semibold text-balance sm:text-5xl">
              Roles that match what you've <span className="text-gradient">actually built</span>
            </h1>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Every listing shows an explained match score, so you always know which skill to close
              next.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-8">
            <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto_auto]">
              <div className="relative">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search role, company or skill…"
                  className="h-11 pl-9"
                />
              </div>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="h-11 rounded-lg border border-input bg-card px-3 text-sm"
              >
                {["All", ...jobIndustries].map((i) => (
                  <option key={i} value={i}>
                    {i === "All" ? "All industries" : i}
                  </option>
                ))}
              </select>
              <select
                value={maxExp}
                onChange={(e) => setMaxExp(Number(e.target.value))}
                className="h-11 rounded-lg border border-input bg-card px-3 text-sm"
              >
                {[0, 1, 2, 3, 5, 10].map((v) => (
                  <option key={v} value={v}>
                    {v === 10 ? "Any experience" : `≤ ${v} yrs experience`}
                  </option>
                ))}
              </select>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as (typeof sorts)[number])}
                className="h-11 rounded-lg border border-input bg-card px-3 text-sm"
              >
                {sorts.map((s) => (
                  <option key={s} value={s}>
                    Sort: {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-1.5">
              {modes.map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    mode === m
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:bg-surface-2",
                  )}
                >
                  {m}
                </button>
              ))}
              <button
                onClick={() => setOnlySaved((s) => !s)}
                className={cn(
                  "ml-1 flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  onlySaved
                    ? "border-accent bg-accent/15 text-accent-foreground dark:text-accent"
                    : "border-border text-muted-foreground hover:bg-surface-2",
                )}
              >
                <Bookmark className="size-3.5" /> Saved ({savedJobs.length})
              </button>
              {user && (
                <span className="ml-auto flex items-center gap-1.5 text-xs text-primary">
                  <Sparkles className="size-3.5" /> Match scores personalised for {user.name}
                </span>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="mb-5 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{results.length}</span> role
          {results.length === 1 ? "" : "s"} open
        </p>

        {results.length === 0 ? (
          <div className="surface-card p-12 text-center">
            <p className="font-display text-lg font-semibold">No roles match those filters</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Widen your filters, or use the career path finder to see roles that fit your profile.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setQuery("");
                  setMode("All");
                  setIndustry("All");
                  setMaxExp(10);
                  setOnlySaved(false);
                }}
              >
                Reset filters
              </Button>
              <Button asChild>
                <Link to="/career-tools/job-match">Try job match</Link>
              </Button>
            </div>
          </div>
        ) : (
          <Stagger className="grid gap-5 lg:grid-cols-2">
            {results.map((j) => (
              <StaggerItem key={j.id} className="h-full">
                <JobCard
                  job={j}
                  {...(matchMap.get(j.id) !== undefined ? { matchScore: matchMap.get(j.id)! } : {})}
                />
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </section>
    </PublicShell>
  );
}
