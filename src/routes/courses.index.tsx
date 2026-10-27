import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Filter, Search, X } from "lucide-react";
import { useMemo, useState } from "react";

import { CourseCard } from "@/components/cards/CourseCard";
import { Reveal, Stagger, StaggerItem } from "@/components/common/motion-primitives";
import { PublicShell } from "@/components/layout/PublicShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  courseDurationBuckets,
  courseFormats,
  courseGroups,
  courseLevels,
  courses,
  matchesDuration,
  type CourseDurationBucket,
} from "@/data/courses";
import { cn } from "@/lib/utils";
import type { CourseFormat, CourseGroup, Level } from "@/types";

export const Route = createFileRoute("/courses/")({
  validateSearch: (search: Record<string, unknown>) => {
    const out: { q?: string; group?: string } = {};
    if (typeof search["q"] === "string" && search["q"]) out.q = search["q"];
    if (typeof search["group"] === "string" && search["group"]) out.group = search["group"];
    return out;
  },
  head: () => ({
    meta: [
      { title: "Course Library — Unified Mentor" },
      {
        name: "description",
        content: `Browse ${courses.length} mentored courses across technology, data & AI, cloud, cybersecurity, business, marketing, social media, design, finance and career skills — each with a free demo lecture, projects and a verifiable certificate.`,
      },
      { property: "og:title", content: "Course Library — Unified Mentor" },
      {
        property: "og:description",
        content: `${courses.length} project-based courses with free demo lectures, mentorship and verifiable certificates.`,
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CoursesPage,
});

const sorts = ["Popular", "Highest rated", "Price: low to high", "Shortest"] as const;

function CoursesPage() {
  const search = Route.useSearch();
  const initialGroup = (courseGroups as readonly string[]).includes(search.group ?? "")
    ? (search.group as CourseGroup)
    : "All";
  const [query, setQuery] = useState(search.q ?? "");
  const [group, setGroup] = useState<CourseGroup | "All">(initialGroup);
  const [level, setLevel] = useState<Level | "All">("All");
  const [format, setFormat] = useState<CourseFormat | "All">("All");
  const [duration, setDuration] = useState<CourseDurationBucket>("all");
  const [sort, setSort] = useState<(typeof sorts)[number]>("Popular");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const activeFilters =
    (group !== "All" ? 1 : 0) +
    (level !== "All" ? 1 : 0) +
    (format !== "All" ? 1 : 0) +
    (duration !== "all" ? 1 : 0) +
    (query.trim() ? 1 : 0);

  const clearAll = () => {
    setQuery("");
    setGroup("All");
    setLevel("All");
    setFormat("All");
    setDuration("all");
  };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = courses.filter(
      (c) =>
        (!q ||
          c.title.toLowerCase().includes(q) ||
          c.tagline.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.group.toLowerCase().includes(q) ||
          c.skills.some((s) => s.toLowerCase().includes(q))) &&
        (group === "All" || c.group === group) &&
        (level === "All" || c.level === level) &&
        (format === "All" || c.format === format) &&
        matchesDuration(c, duration),
    );
    return [...list].sort((a, b) => {
      if (sort === "Highest rated") return b.rating - a.rating;
      if (sort === "Price: low to high") return a.price - b.price;
      if (sort === "Shortest") return a.hours - b.hours;
      return b.learners - a.learners;
    });
  }, [query, group, level, format, duration, sort]);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of courses) map.set(c.group, (map.get(c.group) ?? 0) + 1);
    return map;
  }, []);

  const filterPanel = (
    <div className="space-y-6">
      <FilterBlock label="Category">
        <div className="flex flex-wrap gap-1.5">
          {courseGroups.map((g) => (
            <Chip key={g} active={group === g} onClick={() => setGroup(g)}>
              {g === "All" ? `All (${courses.length})` : `${g} (${counts.get(g) ?? 0})`}
            </Chip>
          ))}
        </div>
      </FilterBlock>
      <FilterBlock label="Level">
        <div className="flex flex-wrap gap-1.5">
          {courseLevels.map((l) => (
            <Chip key={l} active={level === l} onClick={() => setLevel(l)}>
              {l === "All" ? "All levels" : l}
            </Chip>
          ))}
        </div>
      </FilterBlock>
      <FilterBlock label="Format">
        <div className="flex flex-wrap gap-1.5">
          {courseFormats.map((f) => (
            <Chip key={f} active={format === f} onClick={() => setFormat(f)}>
              {f === "All" ? "Any format" : f}
            </Chip>
          ))}
        </div>
      </FilterBlock>
      <FilterBlock label="Duration">
        <div className="flex flex-wrap gap-1.5">
          {courseDurationBuckets.map((d) => (
            <Chip key={d.id} active={duration === d.id} onClick={() => setDuration(d.id)}>
              {d.label}
            </Chip>
          ))}
        </div>
      </FilterBlock>
      <Button
        variant="outline"
        className="w-full"
        onClick={clearAll}
        disabled={activeFilters === 0}
      >
        Clear filters{activeFilters ? ` (${activeFilters})` : ""}
      </Button>
    </div>
  );

  return (
    <PublicShell>
      <section className="hero-gradient relative overflow-hidden border-b border-border">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-25" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-xs font-semibold tracking-widest text-primary uppercase">
              Course library
            </p>
            <h1 className="mt-3 max-w-2xl text-4xl font-semibold text-balance sm:text-5xl">
              {courses.length} courses. Watch a lesson <span className="text-gradient">before</span>{" "}
              you commit.
            </h1>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Every course opens with a free demo lecture, then runs on projects, mentor feedback
              and a verifiable certificate. Filter by category, level, format or length.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-8">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search courses, e.g. React, SQL, Figma, Instagram…"
                  className="h-11 pl-9"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as (typeof sorts)[number])}
                aria-label="Sort courses"
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
                onClick={() => setFiltersOpen((v) => !v)}
              >
                <Filter className="size-4" /> Filters{activeFilters ? ` (${activeFilters})` : ""}
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className={cn("surface-card p-5", !filtersOpen && "hidden lg:block")}>
            {filterPanel}
          </div>
        </aside>

        <div>
          <p className="mb-5 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{results.length}</span>{" "}
            {results.length === 1 ? "course" : "courses"} found
            {group !== "All" ? ` in ${group}` : ""}
          </p>

          {results.length === 0 ? (
            <div className="surface-card flex flex-col items-center gap-3 p-12 text-center">
              <BookOpen className="size-8 text-muted-foreground" />
              <h2 className="font-display text-lg font-semibold">No courses match those filters</h2>
              <p className="max-w-sm text-sm text-muted-foreground">
                Try a broader search term or clear the filters to see the whole library.
              </p>
              <Button variant="outline" onClick={clearAll}>
                Clear filters
              </Button>
            </div>
          ) : (
            <Stagger className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((c) => (
                <StaggerItem key={c.id} className="h-full">
                  <CourseCard course={c} />
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </div>
      </section>
    </PublicShell>
  );
}

function FilterBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
        {label}
      </p>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border text-muted-foreground hover:bg-surface-2",
      )}
    >
      {children}
    </button>
  );
}
