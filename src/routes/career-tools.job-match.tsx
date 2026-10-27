import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, Plus, Sparkles, X } from "lucide-react";
import { useMemo, useState } from "react";

import { ProgressBar, Reveal } from "@/components/common/motion-primitives";
import { PublicShell } from "@/components/layout/PublicShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { jobSkills } from "@/data/opportunities";
import { lpa } from "@/lib/format";
import { matchJobs } from "@/lib/insights";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/career-tools/job-match")({
  head: () => ({
    meta: [
      { title: "Job Match Score — Unified Mentor" },
      {
        name: "description",
        content:
          "Enter your skills and experience to see ranked job matches with explained scores, matched skills and gaps.",
      },
      { property: "og:title", content: "Job Match Score — Unified Mentor" },
      {
        property: "og:description",
        content: "Ranked job matches with explained scores and skill gaps.",
      },
    ],
  }),
  component: JobMatchPage,
});

function JobMatchPage() {
  const { user } = useApp();
  const [skills, setSkills] = useState<string[]>(user?.skills ?? ["React", "JavaScript", "SQL"]);
  const [years, setYears] = useState(1);
  const [draft, setDraft] = useState("");

  const matches = useMemo(() => matchJobs(skills, years), [skills, years]);
  const suggestions = jobSkills.filter((s) => !skills.includes(s)).slice(0, 12);

  return (
    <PublicShell>
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-xs font-semibold tracking-widest text-primary uppercase">
              Career tools
            </p>
            <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Job Match Score</h1>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Every score is explained — matched skills, experience fit and freshness — so you know
              exactly what to fix.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[320px_1fr] lg:px-8">
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="surface-card space-y-5 p-6">
            <div className="space-y-2">
              <Label>Your skills</Label>
              <div className="flex gap-2">
                <Input
                  value={draft}
                  placeholder="Add a skill"
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && draft.trim()) {
                      setSkills((s) => Array.from(new Set([...s, draft.trim()])));
                      setDraft("");
                    }
                  }}
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    if (!draft.trim()) return;
                    setSkills((s) => Array.from(new Set([...s, draft.trim()])));
                    setDraft("");
                  }}
                >
                  <Plus className="size-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {skills.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSkills((prev) => prev.filter((x) => x !== s))}
                    className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                  >
                    {s} <X className="size-3" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Suggested skills</Label>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSkills((prev) => [...prev, s])}
                    className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>
                Experience: {years} {years === 1 ? "year" : "years"}
              </Label>
              <input
                type="range"
                min={0}
                max={8}
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>

            <div className="rounded-xl bg-primary/8 p-4 text-xs leading-relaxed text-muted-foreground">
              <Sparkles className="mb-1.5 size-4 text-primary" />
              Scores are computed locally from skill overlap (72%), experience fit (20%) and posting
              freshness (8%).
            </div>
          </div>
        </aside>

        <div className="space-y-4">
          {matches.map((m, i) => (
            <motion.article
              key={m.job.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.04, 0.3) }}
              className="surface-card p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <Link
                    to="/jobs/$jobId"
                    params={{ jobId: m.job.id }}
                    className="font-display text-lg font-semibold hover:text-primary"
                  >
                    {m.job.title}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {m.job.company} · {m.job.location} · {m.job.mode}
                  </p>
                  <p className="mt-1 text-sm font-medium text-accent-foreground dark:text-accent">
                    {lpa(m.job.salaryMin)} – {lpa(m.job.salaryMax)}
                  </p>
                </div>
                <div className="w-32 text-right">
                  <p
                    className={cn(
                      "font-display text-3xl font-semibold",
                      m.score >= 75
                        ? "text-primary"
                        : m.score >= 55
                          ? "text-accent"
                          : "text-muted-foreground",
                    )}
                  >
                    {m.score}%
                  </p>
                  <ProgressBar value={m.score} className="mt-1.5" />
                </div>
              </div>

              <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                {m.reasons.map((r) => (
                  <li key={r} className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    {r}
                  </li>
                ))}
              </ul>

              {m.missingSkills.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    Gaps
                  </span>
                  {m.missingSkills.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </motion.article>
          ))}
        </div>
      </section>
    </PublicShell>
  );
}
