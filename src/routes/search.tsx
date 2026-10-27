import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  BriefcaseBusiness,
  GraduationCap,
  Search as SearchIcon,
  Sparkles,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Reveal } from "@/components/common/motion-primitives";
import { PublicShell } from "@/components/layout/PublicShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { courses } from "@/data/courses";
import { internships, jobs, mentors } from "@/data/opportunities";
import { programs } from "@/data/programs";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/search")({
  validateSearch: (search: { q?: string }) => ({ q: typeof search.q === "string" ? search.q : "" }),
  head: () => ({
    meta: [
      { title: "Search — Unified Mentor" },
      {
        name: "description",
        content:
          "Search every program, course, internship, job and mentor on Unified Mentor from one place.",
      },
      { property: "og:title", content: "Search — Unified Mentor" },
      {
        property: "og:description",
        content: "One search across programs, courses, internships, jobs and mentors.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SearchPage,
});

type Tab = "All" | "Programs" | "Courses" | "Jobs" | "Internships" | "Mentors";
const tabs: Tab[] = ["All", "Programs", "Courses", "Jobs", "Internships", "Mentors"];

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate();
  const [input, setInput] = useState(q);
  const [tab, setTab] = useState<Tab>("All");

  const term = q.trim().toLowerCase();

  const results = useMemo(() => {
    const has = (...parts: (string | undefined)[]) =>
      !term || parts.filter(Boolean).join(" ").toLowerCase().includes(term);
    return {
      Programs: programs.filter((p) => has(p.title, p.category, p.description, p.skills.join(" "))),
      Courses: courses.filter((c) => has(c.title, c.category, c.description, c.skills.join(" "))),
      Jobs: jobs.filter((j) => has(j.title, j.company, j.skills.join(" "), j.location)),
      Internships: internships.filter((i) =>
        has(i.title, i.company, i.skills.join(" "), i.location),
      ),
      Mentors: mentors.filter((m) => has(m.name, m.company, m.expertise.join(" "))),
    };
  }, [term]);

  const total =
    results.Programs.length +
    results.Courses.length +
    results.Jobs.length +
    results.Internships.length +
    results.Mentors.length;

  const show = (t: Tab) => tab === "All" || tab === t;

  return (
    <PublicShell>
      <section className="hero-gradient relative overflow-hidden border-b border-border">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-25" />
        <div className="relative mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-xs font-semibold tracking-widest text-primary uppercase">Search</p>
            <h1 className="mt-3 text-3xl font-semibold text-balance sm:text-4xl">
              {q ? (
                <>
                  Results for <span className="text-gradient">{q}</span>
                </>
              ) : (
                <>
                  Search the whole <span className="text-gradient">platform</span>
                </>
              )}
            </h1>
          </Reveal>

          <form
            className="mt-6 flex flex-col gap-2 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ to: "/search", search: { q: input } });
            }}
          >
            <div className="relative flex-1">
              <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Try React, data science, remote internship…"
                className="h-11 pl-9"
              />
            </div>
            <Button type="submit" className="h-11">
              Search
            </Button>
          </form>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition-colors",
                  tab === t
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-surface-2",
                )}
              >
                {t}
                {t !== "All" && (
                  <span className="ml-1 text-[10px]">
                    {results[t as Exclude<Tab, "All">].length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="mb-6 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{total}</span> result
          {total === 1 ? "" : "s"} found
        </p>

        {total === 0 ? (
          <div className="surface-card p-12 text-center">
            <p className="font-display text-lg font-semibold">Nothing matched that search</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try a skill like &ldquo;React&rdquo;, a role like &ldquo;analyst&rdquo;, or browse the
              catalogs.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Button asChild variant="outline">
                <Link to="/programs">Programs</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/courses">Courses</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/jobs">Jobs</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            {show("Programs") && results.Programs.length > 0 && (
              <Group icon={<GraduationCap className="size-4" />} title="Programs">
                {results.Programs.map((p) => (
                  <Link
                    key={p.id}
                    to="/programs/$slug"
                    params={{ slug: p.slug }}
                    className="block rounded-xl border border-border p-4 transition-colors hover:border-primary"
                  >
                    <p className="font-medium">{p.title}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {p.description}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {p.category} · {p.level} · {p.durationWeeks} weeks
                    </p>
                  </Link>
                ))}
              </Group>
            )}

            {show("Courses") && results.Courses.length > 0 && (
              <Group icon={<Sparkles className="size-4" />} title="Courses">
                {results.Courses.map((c) => (
                  <Link
                    key={c.id}
                    to="/courses/$courseId"
                    params={{ courseId: c.id }}
                    className="block rounded-xl border border-border p-4 transition-colors hover:border-primary"
                  >
                    <p className="font-medium">{c.title}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {c.description}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {c.category} · {c.level} · {c.hours} hours
                    </p>
                  </Link>
                ))}
              </Group>
            )}

            {show("Jobs") && results.Jobs.length > 0 && (
              <Group icon={<BriefcaseBusiness className="size-4" />} title="Jobs">
                {results.Jobs.map((j) => (
                  <Link
                    key={j.id}
                    to="/jobs/$jobId"
                    params={{ jobId: j.id }}
                    className="block rounded-xl border border-border p-4 transition-colors hover:border-primary"
                  >
                    <p className="font-medium">{j.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {j.company} · {j.location} · {j.mode}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {j.skills.slice(0, 4).join(" · ")}
                    </p>
                  </Link>
                ))}
              </Group>
            )}

            {show("Internships") && results.Internships.length > 0 && (
              <Group icon={<BriefcaseBusiness className="size-4" />} title="Internships">
                {results.Internships.map((i) => (
                  <Link
                    key={i.id}
                    to="/internships/$internshipId"
                    params={{ internshipId: i.id }}
                    className="block rounded-xl border border-border p-4 transition-colors hover:border-primary"
                  >
                    <p className="font-medium">{i.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {i.company} · {i.location} · {i.mode}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {i.durationMonths} months · {i.skills.slice(0, 3).join(" · ")}
                    </p>
                  </Link>
                ))}
              </Group>
            )}

            {show("Mentors") && results.Mentors.length > 0 && (
              <Group icon={<Users className="size-4" />} title="Mentors">
                {results.Mentors.map((m) => (
                  <Link
                    key={m.id}
                    to="/mentors/$mentorId"
                    params={{ mentorId: m.id }}
                    className="block rounded-xl border border-border p-4 transition-colors hover:border-primary"
                  >
                    <p className="font-medium">{m.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{m.company}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{m.expertise.join(" · ")}</p>
                  </Link>
                ))}
              </Group>
            )}
          </div>
        )}
      </section>
    </PublicShell>
  );
}

function Group({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="flex items-center gap-2 text-sm font-semibold tracking-wider uppercase">
        <span className="text-primary">{icon}</span>
        {title}
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">{children}</div>
    </div>
  );
}
