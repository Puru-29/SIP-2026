import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarClock, Search, Star } from "lucide-react";
import { useMemo, useState } from "react";

import { BookSessionDialog } from "@/components/common/BookSessionDialog";
import { Reveal, Stagger, StaggerItem } from "@/components/common/motion-primitives";
import { PublicShell } from "@/components/layout/PublicShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mentors } from "@/data/opportunities";
import { cn } from "@/lib/utils";
import type { Mentor } from "@/types";

export const Route = createFileRoute("/mentors/")({
  head: () => ({
    meta: [
      { title: "Mentors — Unified Mentor" },
      {
        name: "description",
        content:
          "Book 1:1 sessions with working engineers, analysts, designers and marketers who review your code, portfolio and interview performance.",
      },
      { property: "og:title", content: "Mentors — Unified Mentor" },
      {
        property: "og:description",
        content: "Practitioner mentors for code review, portfolio crits and mock interviews.",
      },
    ],
  }),
  component: MentorsPage,
});

function MentorsPage() {
  const [query, setQuery] = useState("");
  const [expertise, setExpertise] = useState("All");
  const [booking, setBooking] = useState<{ mentor: Mentor; slot?: string } | null>(null);

  const expertises = useMemo(
    () => ["All", ...Array.from(new Set(mentors.flatMap((m) => m.expertise))).sort()],
    [],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return mentors.filter(
      (m) =>
        (!q || m.name.toLowerCase().includes(q) || m.company.toLowerCase().includes(q)) &&
        (expertise === "All" || m.expertise.includes(expertise)),
    );
  }, [query, expertise]);

  return (
    <PublicShell>
      <section className="hero-gradient relative overflow-hidden border-b border-border">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-25" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-xs font-semibold tracking-widest text-primary uppercase">
              Mentorship
            </p>
            <h1 className="mt-3 max-w-2xl text-4xl font-semibold text-balance sm:text-5xl">
              People who <span className="text-gradient">ship</span>, reviewing what you build
            </h1>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Weekly code review, portfolio crits and mock interviews with practitioners from
              product teams — not career-long instructors.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-8">
            <div className="relative max-w-xl">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search mentor or company…"
                className="h-11 pl-9"
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {expertises.slice(0, 12).map((e) => (
                <button
                  key={e}
                  onClick={() => setExpertise(e)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    expertise === e
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:bg-surface-2",
                  )}
                >
                  {e}
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((m) => (
            <StaggerItem key={m.id} className="h-full">
              <div className="surface-card flex h-full flex-col p-6">
                <div className="flex items-center gap-3">
                  <span className="grid size-12 place-items-center rounded-full bg-primary/12 font-semibold text-primary">
                    {m.avatar}
                  </span>
                  <div className="min-w-0">
                    <Link
                      to="/mentors/$mentorId"
                      params={{ mentorId: m.id }}
                      className="block truncate font-semibold hover:text-primary"
                    >
                      {m.name}
                    </Link>
                    <p className="truncate text-xs text-muted-foreground">
                      {m.company} · {m.experienceYears} yrs
                    </p>
                  </div>
                  <span className="ml-auto flex shrink-0 items-center gap-1 text-xs font-semibold">
                    <Star className="size-3.5 fill-accent text-accent" />
                    {m.rating}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{m.bio}</p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {m.expertise.map((e) => (
                    <span
                      key={e}
                      className="rounded-md bg-surface-2 px-2 py-0.5 text-[11px] text-muted-foreground"
                    >
                      {e}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-5">
                  <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    <CalendarClock className="size-3.5" /> Next available
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {m.availability.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setBooking({ mentor: m, slot })}
                        className="rounded-lg border border-border px-2.5 py-1 text-xs transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary"
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 text-[11px] text-muted-foreground">
                    {m.sessions}+ sessions delivered
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" className="flex-1" onClick={() => setBooking({ mentor: m })}>
                      Book session
                    </Button>
                    <Button asChild size="sm" variant="outline" className="flex-1">
                      <Link to="/mentors/$mentorId" params={{ mentorId: m.id }}>
                        View profile
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <div className="surface-card mt-12 flex flex-col items-center gap-4 p-8 text-center">
          <h2 className="font-display text-xl font-semibold">
            Mentorship is bundled with programs
          </h2>
          <p className="max-w-lg text-sm text-muted-foreground">
            Enrol in any career program to get weekly 1:1s, code review and mock interviews
            included.
          </p>
          <Button asChild>
            <Link to="/programs">Explore programs</Link>
          </Button>
        </div>
      </section>

      {booking && (
        <BookSessionDialog
          mentor={booking.mentor}
          open
          onOpenChange={(v) => !v && setBooking(null)}
          {...(booking.slot ? { initialSlot: booking.slot } : {})}
        />
      )}
    </PublicShell>
  );
}
