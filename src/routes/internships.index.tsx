import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { InternshipCard } from "@/components/cards/InternshipCard";
import { Reveal, Stagger, StaggerItem } from "@/components/common/motion-primitives";
import { PublicShell } from "@/components/layout/PublicShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { internships } from "@/data/opportunities";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/internships/")({
  head: () => ({
    meta: [
      { title: "Internships & Fellowships — Unified Mentor" },
      {
        name: "description",
        content:
          "Apply to mentored internships and fellowships with partner teams — remote, hybrid and on-site roles with stipends and real project work.",
      },
      { property: "og:title", content: "Internships & Fellowships — Unified Mentor" },
      {
        property: "og:description",
        content: "Paid, mentored internships with real deliverables and partner teams.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InternshipsPage,
});

const modes = ["All", "Remote", "Hybrid", "On-site"] as const;
const durations = ["Any duration", "1–2 months", "3 months", "4+ months"] as const;

function InternshipsPage() {
  const { user } = useApp();
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<(typeof modes)[number]>("All");
  const [category, setCategory] = useState("All");
  const [minStipend, setMinStipend] = useState(0);
  const [duration, setDuration] = useState<(typeof durations)[number]>("Any duration");
  const [paidOnly, setPaidOnly] = useState(false);
  const [location, setLocation] = useState("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(internships.map((i) => i.category)))],
    [],
  );
  const locations = useMemo(
    () => ["All", ...Array.from(new Set(internships.map((i) => i.location)))],
    [],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return internships.filter((i) => {
      const matchDuration =
        duration === "Any duration" ||
        (duration === "1–2 months" && i.durationMonths <= 2) ||
        (duration === "3 months" && i.durationMonths === 3) ||
        (duration === "4+ months" && i.durationMonths >= 4);
      return (
        (!q ||
          i.title.toLowerCase().includes(q) ||
          i.company.toLowerCase().includes(q) ||
          i.skills.some((s) => s.toLowerCase().includes(q))) &&
        (mode === "All" || i.mode === mode) &&
        (category === "All" || i.category === category) &&
        (location === "All" || i.location === location) &&
        (!paidOnly || i.stipend > 0) &&
        i.stipend >= minStipend &&
        matchDuration
      );
    });
  }, [query, mode, category, minStipend, duration, paidOnly, location]);

  const recommendedIds = useMemo(() => {
    if (!user) return new Set<string>();
    const skills = new Set(user.skills.map((s) => s.toLowerCase()));
    return new Set(
      internships
        .filter((i) => i.skills.some((s) => skills.has(s.toLowerCase())))
        .slice(0, 3)
        .map((i) => i.id),
    );
  }, [user]);

  return (
    <PublicShell>
      <section className="hero-gradient relative overflow-hidden border-b border-border">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-25" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-xs font-semibold tracking-widest text-primary uppercase">
              Internships & fellowships
            </p>
            <h1 className="mt-3 max-w-2xl text-4xl font-semibold text-balance sm:text-5xl">
              Experience that shows up on a <span className="text-gradient">resume</span>
            </h1>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Structured internships with partner teams: real tickets, weekly reviews, stipends and
              a certificate at the end.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-8">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="relative lg:col-span-2">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search role, company or skill…"
                  className="h-11 pl-9"
                />
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-11 rounded-lg border border-input bg-card px-3 text-sm"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === "All" ? "All domains" : c}
                  </option>
                ))}
              </select>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-11 rounded-lg border border-input bg-card px-3 text-sm"
              >
                {locations.map((c) => (
                  <option key={c} value={c}>
                    {c === "All" ? "All locations" : c}
                  </option>
                ))}
              </select>
              <select
                value={minStipend}
                onChange={(e) => setMinStipend(Number(e.target.value))}
                className="h-11 rounded-lg border border-input bg-card px-3 text-sm"
              >
                {[0, 10000, 15000, 20000, 25000].map((v) => (
                  <option key={v} value={v}>
                    {v === 0 ? "Any stipend" : `₹${v / 1000}k+ / month`}
                  </option>
                ))}
              </select>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value as (typeof durations)[number])}
                className="h-11 rounded-lg border border-input bg-card px-3 text-sm"
              >
                {durations.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
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
                onClick={() => setPaidOnly((p) => !p)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  paidOnly
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-surface-2",
                )}
              >
                Paid only
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="mb-5 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{results.length}</span> open opportunit
          {results.length === 1 ? "y" : "ies"}
          {user ? " · recommendations based on your skills" : ""}
        </p>

        {results.length === 0 ? (
          <div className="surface-card p-12 text-center">
            <p className="font-display text-lg font-semibold">No internships match those filters</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              Widen the stipend range or clear the domain filter to see everything that is open.
            </p>
            <Button
              className="mt-5"
              variant="outline"
              onClick={() => {
                setQuery("");
                setMode("All");
                setCategory("All");
                setMinStipend(0);
                setDuration("Any duration");
                setPaidOnly(false);
                setLocation("All");
              }}
            >
              Reset filters
            </Button>
          </div>
        ) : (
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((i) => (
              <StaggerItem key={i.id} className="h-full">
                <InternshipCard internship={i} recommended={recommendedIds.has(i.id)} />
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </section>
    </PublicShell>
  );
}
