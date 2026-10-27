import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CalendarClock, IndianRupee, MapPin, Users } from "lucide-react";
import { useState } from "react";

import { ApplyDialog } from "@/components/common/ApplyDialog";
import { Button } from "@/components/ui/button";
import { inr, daysUntil, prettyDate } from "@/lib/format";
import { useApp } from "@/lib/store";
import type { Internship } from "@/types";

export function InternshipCard({
  internship,
  recommended,
}: {
  internship: Internship;
  recommended?: boolean;
}) {
  const { applications, isSaved, toggleSave } = useApp();
  const saved = isSaved("internship", internship.id);
  const [open, setOpen] = useState(false);
  const applied = applications.some((a) => a.kind === "internship" && a.refId === internship.id);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="surface-card flex h-full flex-col p-5"
    >
      <div className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-accent/25 to-primary/20 text-sm font-bold">
          {internship.logo}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base leading-snug font-semibold">
              <Link
                to="/internships/$internshipId"
                params={{ internshipId: internship.id }}
                className="transition-colors hover:text-primary"
              >
                {internship.title}
              </Link>
            </h3>
            {recommended && (
              <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold tracking-wide text-primary uppercase">
                For you
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{internship.company}</p>
        </div>
        <span className="rounded-md border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
          {internship.mode}
        </span>
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{internship.description}</p>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <MapPin className="size-3.5" /> {internship.location}
        </span>
        <span className="flex items-center gap-1.5">
          <CalendarClock className="size-3.5" /> {internship.durationMonths} months
        </span>
        <span className="flex items-center gap-1.5">
          <IndianRupee className="size-3.5" />
          {internship.stipend ? `${inr(internship.stipend)}/mo` : "Unpaid fellowship"}
        </span>
        <span className="flex items-center gap-1.5">
          <Users className="size-3.5" /> {internship.applicants} applicants
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {internship.skills.map((s) => (
          <span
            key={s}
            className="rounded-md bg-surface-2 px-2 py-0.5 text-[11px] text-muted-foreground"
          >
            {s}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
        <div className="text-xs text-muted-foreground">
          Closes {prettyDate(internship.deadline)}
          <span className="ml-1 font-medium text-accent">
            ({daysUntil(internship.deadline)}d left)
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => void toggleSave("internship", internship.id)}
          >
            {saved ? "Saved" : "Save"}
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link to="/internships/$internshipId" params={{ internshipId: internship.id }}>
              Details
            </Link>
          </Button>
          <Button size="sm" disabled={applied} onClick={() => setOpen(true)}>
            {applied ? "Applied" : "Apply"}
          </Button>
        </div>
      </div>

      <ApplyDialog
        open={open}
        onOpenChange={setOpen}
        kind="internship"
        refId={internship.id}
        title={internship.title}
        company={internship.company}
      />
    </motion.div>
  );
}
