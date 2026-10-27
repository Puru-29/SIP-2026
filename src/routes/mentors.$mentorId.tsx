import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CalendarClock, MessageSquare, Star, Users } from "lucide-react";
import { useState } from "react";

import { BookSessionDialog } from "@/components/common/BookSessionDialog";
import { Reveal } from "@/components/common/motion-primitives";
import { PublicShell } from "@/components/layout/PublicShell";
import { Button } from "@/components/ui/button";
import { mentors } from "@/data/opportunities";

export const Route = createFileRoute("/mentors/$mentorId")({
  loader: ({ params }) => {
    const mentor = mentors.find((m) => m.id === params.mentorId);
    if (!mentor) throw notFound();
    return { mentor };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Mentor unavailable — Unified Mentor" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const m = loaderData.mentor;
    const title = `${m.name} — Mentor at Unified Mentor`;
    return {
      meta: [
        { title },
        { name: "description", content: `${m.company}. ${m.bio}` },
        { property: "og:title", content: title },
        { property: "og:description", content: m.bio },
        { property: "og:type", content: "profile" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: MentorProfile,
});

function MentorProfile() {
  const { mentor } = Route.useLoaderData();
  const [open, setOpen] = useState(false);

  return (
    <PublicShell>
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <Link to="/mentors" className="hover:text-foreground">
              Mentors
            </Link>
            <span>/</span>
            <span className="text-foreground">{mentor.name}</span>
          </nav>

          <Reveal className="mt-6">
            <div className="flex flex-wrap items-start gap-5">
              <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-primary/12 font-display text-xl font-semibold text-primary">
                {mentor.avatar}
              </span>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-semibold sm:text-3xl">{mentor.name}</h1>
                <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span>{mentor.company}</span>
                  <span className="flex items-center gap-1.5">
                    <Star className="size-4 fill-accent text-accent" /> {mentor.rating}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="size-4" /> {mentor.sessions}+ sessions
                  </span>
                  <span>{mentor.experienceYears} yrs experience</span>
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setOpen(true)}>
                  <CalendarClock className="size-4" /> Book session
                </Button>
                <Button asChild variant="outline">
                  <Link to="/dashboard/mentorship">
                    <MessageSquare className="size-4" /> Ask a question
                  </Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[1.5fr_1fr] lg:px-8">
        <div className="space-y-6">
          <div className="surface-card p-6">
            <h2 className="font-display text-lg font-semibold">
              About {mentor.name.split(" ")[0]}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{mentor.bio}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Sessions run for 45 minutes and typically cover code review, architecture decisions,
              portfolio critique and mock interviews. You will leave with written notes and a
              prioritised action list.
            </p>
          </div>

          <div className="surface-card p-6">
            <h2 className="font-display text-lg font-semibold">Expertise</h2>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {mentor.expertise.map((e) => (
                <span
                  key={e}
                  className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                >
                  {e}
                </span>
              ))}
            </div>
          </div>

          <div className="surface-card p-6">
            <h2 className="font-display text-lg font-semibold">What mentees say</h2>
            <div className="mt-4 space-y-3">
              {[
                {
                  name: "Alex Mehra",
                  text: "Blunt, specific feedback. My project went from tutorial-grade to something I could defend in an interview.",
                },
                {
                  name: "Priya Raghavan",
                  text: "Helped me structure my portfolio narrative around business impact instead of tools.",
                },
              ].map((r) => (
                <div key={r.name} className="rounded-xl bg-surface-2 p-4">
                  <p className="text-sm text-muted-foreground">&ldquo;{r.text}&rdquo;</p>
                  <p className="mt-2 text-xs font-medium">{r.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="surface-card p-6">
            <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              <CalendarClock className="size-3.5" /> Usual availability
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {mentor.availability.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setOpen(true)}
                  className="rounded-lg border border-border px-2.5 py-1 text-xs transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary"
                >
                  {slot}
                </button>
              ))}
            </div>
            <Button className="mt-5 w-full" onClick={() => setOpen(true)}>
              Book a 1:1
            </Button>
          </div>

          <div className="surface-card p-6">
            <h3 className="font-semibold">Other mentors</h3>
            <div className="mt-3 space-y-2">
              {mentors
                .filter((m) => m.id !== mentor.id)
                .slice(0, 4)
                .map((m) => (
                  <Link
                    key={m.id}
                    to="/mentors/$mentorId"
                    params={{ mentorId: m.id }}
                    className="block rounded-xl border border-border p-3 transition-colors hover:border-primary"
                  >
                    <p className="text-sm font-medium">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.company}</p>
                  </Link>
                ))}
            </div>
          </div>
        </aside>
      </section>

      <BookSessionDialog mentor={mentor} open={open} onOpenChange={setOpen} />
    </PublicShell>
  );
}
