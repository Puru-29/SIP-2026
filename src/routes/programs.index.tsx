import { createFileRoute } from "@tanstack/react-router";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";

import { ProgramCard } from "@/components/cards/ProgramCard";
import { Reveal, Stagger, StaggerItem } from "@/components/common/motion-primitives";
import { PublicShell } from "@/components/layout/PublicShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { programCategories, programs } from "@/data/programs";
import { cn } from "@/lib/utils";
import type { Level } from "@/types";

export const Route = createFileRoute("/programs/")({
  head: () => ({
    meta: [
      { title: "Career Programs — Unified Mentor" },
      {
        name: "description",
        content:
          "Explore 10 mentored career programs across web development, data science, AI/ML, design, marketing, finance, cyber security and cloud.",
      },
      { property: "og:title", content: "Career Programs — Unified Mentor" },
      {
        property: "og:description",
        content: "Mentored, project-based programs with certificates and job support.",
      },
    ],
  }),
  component: ProgramsPage,
});

const levels: Level[] = ["Beginner", "Intermediate", "Advanced"];
const sorts = ["Popular", "Rating", "Price: low to high", "Duration"] as const;

const priceBands = [
  { label: "All", min: 0, max: Number.MAX_SAFE_INTEGER },
  { label: "Under 10,000", min: 0, max: 9999 },
  { label: "10,000 - 14,999", min: 10000, max: 14999 },
  { label: "15,000 and above", min: 15000, max: Number.MAX_SAFE_INTEGER },
] as const;

const durationBands = [
  { label: "All", min: 0, max: 999 },
  { label: "Up to 14 weeks", min: 0, max: 14 },
  { label: "15 - 20 weeks", min: 15, max: 20 },
  { label: "20+ weeks", min: 21, max: 999 },
] as const;

const ratingBands = [0, 4.5, 4.7, 4.8] as const;

function ProgramsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState<Level | "All">("All");
  const [sort, setSort] = useState<(typeof sorts)[number]>("Popular");
  const [priceBand, setPriceBand] = useState<(typeof priceBands)[number]["label"]>("All");
  const [durationBand, setDurationBand] = useState<(typeof durationBands)[number]["label"]>("All");
  const [minRating, setMinRating] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(false);

  const results = useMemo(() => {
    const band = priceBands.find((b) => b.label === priceBand)!;
    const dband = durationBands.find((b) => b.label === durationBand)!;
    let list = programs.filter((p) => {
      const q = query.trim().toLowerCase();
      const matchQ =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.skills.some((s) => s.toLowerCase().includes(q));
      const matchC = category === "All" || p.category === category;
      const matchL = level === "All" || p.level === level;
      const matchP = p.price >= band.min && p.price <= band.max;
      const matchD = p.durationWeeks >= dband.min && p.durationWeeks <= dband.max;
      const matchR = p.rating >= minRating;
      return matchQ && matchC && matchL && matchP && matchD && matchR;
    });
    list = [...list].sort((a, b) => {
      if (sort === "Rating") return b.rating - a.rating;
      if (sort === "Price: low to high") return a.price - b.price;
      if (sort === "Duration") return a.durationWeeks - b.durationWeeks;
      return b.learners - a.learners;
    });
    return list;
  }, [query, category, level, sort, priceBand, durationBand, minRating]);

  const active =
    (category !== "All" ? 1 : 0) +
    (level !== "All" ? 1 : 0) +
    (priceBand !== "All" ? 1 : 0) +
    (durationBand !== "All" ? 1 : 0) +
    (minRating > 0 ? 1 : 0);

  function clearFilters() {
    setCategory("All");
    setLevel("All");
    setPriceBand("All");
    setDurationBand("All");
    setMinRating(0);
  }

  return (
    <PublicShell>
      <section className="hero-gradient relative overflow-hidden border-b border-border">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-25" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-xs font-semibold tracking-widest text-primary uppercase">
              Career programs
            </p>
            <h1 className="mt-3 max-w-2xl text-4xl font-semibold text-balance sm:text-5xl">
              Pick the track. We handle the <span className="text-gradient">roadmap</span>.
            </h1>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Every program is mentored, project-based and ends with a verifiable certificate plus
              job support.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-8">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search programs, skills or tools…"
                  className="h-11 pl-9"
                />
              </div>
              <div className="flex gap-2">
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
                <Button
                  variant="outline"
                  className="h-11 lg:hidden"
                  onClick={() => setShowFilters((s) => !s)}
                >
                  <SlidersHorizontal className="size-4" /> Filters
                  {active > 0 && (
                    <span className="ml-1 rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">
                      {active}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid lg:grid-cols-[240px_1fr] lg:px-8">
        <aside className={cn("mb-8 lg:mb-0 lg:block", showFilters ? "block" : "hidden")}>
          <div className="surface-card sticky top-24 p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Filters</h2>
              {active > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-xs text-primary"
                >
                  <X className="size-3" /> Clear
                </button>
              )}
            </div>

            <p className="mt-5 mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Category
            </p>
            <div className="space-y-1">
              {programCategories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={cn(
                    "w-full rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors",
                    category === c
                      ? "bg-primary/12 font-medium text-primary"
                      : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>

            <p className="mt-6 mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Level
            </p>
            <div className="flex flex-wrap gap-1.5">
              {(["All", ...levels] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l as Level | "All")}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-xs transition-colors",
                    level === l
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:bg-surface-2",
                  )}
                >
                  {l}
                </button>
              ))}
            </div>

            <p className="mt-6 mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Price
            </p>
            <div className="space-y-1">
              {priceBands.map((b) => (
                <button
                  key={b.label}
                  onClick={() => setPriceBand(b.label)}
                  className={cn(
                    "w-full rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors",
                    priceBand === b.label
                      ? "bg-primary/12 font-medium text-primary"
                      : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
                  )}
                >
                  {b.label}
                </button>
              ))}
            </div>

            <p className="mt-6 mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Duration
            </p>
            <div className="space-y-1">
              {durationBands.map((b) => (
                <button
                  key={b.label}
                  onClick={() => setDurationBand(b.label)}
                  className={cn(
                    "w-full rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors",
                    durationBand === b.label
                      ? "bg-primary/12 font-medium text-primary"
                      : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
                  )}
                >
                  {b.label}
                </button>
              ))}
            </div>

            <p className="mt-6 mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Rating
            </p>
            <div className="flex flex-wrap gap-1.5">
              {ratingBands.map((r) => (
                <button
                  key={r}
                  onClick={() => setMinRating(r)}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-xs transition-colors",
                    minRating === r
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:bg-surface-2",
                  )}
                >
                  {r === 0 ? "Any" : `${r}+`}
                </button>
              ))}
            </div>

            <Button variant="outline" size="sm" className="mt-6 w-full" onClick={clearFilters}>
              Clear filters
            </Button>
          </div>
        </aside>

        <div>
          <p className="mb-5 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{results.length}</span> program
            {results.length === 1 ? "" : "s"} found
          </p>
          {results.length === 0 ? (
            <div className="surface-card p-12 text-center">
              <p className="font-display text-lg font-semibold">No programs match those filters</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try clearing filters or searching a different skill.
              </p>
              <Button
                className="mt-5"
                variant="outline"
                onClick={() => {
                  setQuery("");
                  clearFilters();
                }}
              >
                Reset search
              </Button>
            </div>
          ) : (
            <Stagger className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((p) => (
                <StaggerItem key={p.id} className="h-full">
                  <ProgramCard program={p} />
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </div>
      </section>
    </PublicShell>
  );
}
