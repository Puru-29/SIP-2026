import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Bookmark, BookmarkCheck, Clock, IndianRupee, MapPin } from "lucide-react";
import { useState } from "react";

import { ApplyDialog } from "@/components/common/ApplyDialog";
import { Button } from "@/components/ui/button";
import { lpa } from "@/lib/format";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Job } from "@/types";

export function JobCard({ job, matchScore }: { job: Job; matchScore?: number }) {
  const { savedJobs, toggleSaveJob, applications } = useApp();
  const saved = savedJobs.includes(job.id);
  const [open, setOpen] = useState(false);
  const applied = applications.some((a) => a.kind === "job" && a.refId === job.id);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="surface-card p-5"
    >
      <div className="flex items-start gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-sm font-bold">
          {job.logo}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold">{job.title}</h3>
            {typeof matchScore === "number" && (
              <span className="rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-bold text-success">
                {matchScore}% match
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {job.company} · {job.industry}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="size-3.5" /> {job.location} · {job.mode}
            </span>
            <span className="flex items-center gap-1">
              <IndianRupee className="size-3.5" /> {lpa(job.salaryMin)} – {lpa(job.salaryMax)}
            </span>
            <span>{job.experience}</span>
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" /> {job.postedDaysAgo}d ago
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {job.skills.map((s) => (
              <span
                key={s}
                className="rounded-md bg-surface-2 px-2 py-0.5 text-[11px] text-muted-foreground"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
        <button
          onClick={() => toggleSaveJob(job.id)}
          aria-label={saved ? "Unsave job" : "Save job"}
          className={cn(
            "grid size-9 shrink-0 place-items-center rounded-lg border border-border transition-colors",
            saved ? "bg-primary/12 text-primary" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {saved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
        </button>
      </div>
      <div className="mt-4 flex gap-2 border-t border-border pt-4">
        <Button size="sm" className="flex-1" disabled={applied} onClick={() => setOpen(true)}>
          {applied ? "Applied" : "Apply Now"}
        </Button>
        <Button asChild size="sm" variant="outline" className="flex-1">
          <Link to="/jobs/$jobId" params={{ jobId: job.id }}>
            View Details
          </Link>
        </Button>
      </div>

      <ApplyDialog
        open={open}
        onOpenChange={setOpen}
        kind="job"
        refId={job.id}
        title={job.title}
        company={job.company}
      />
    </motion.div>
  );
}
