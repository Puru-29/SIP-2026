import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Award, Bookmark, BookmarkCheck, Clock, FolderGit2, Play, Star, Users } from "lucide-react";
import { useState } from "react";

import { SmartImage } from "@/components/common/SmartImage";
import { DemoVideoDialog } from "@/components/common/VideoPlayer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { programDemoVideo } from "@/lib/demo-videos";
import { inr, compact } from "@/lib/format";
import { imageFor } from "@/lib/images";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Program } from "@/types";

export function ProgramCard({ program, enrolled }: { program: Program; enrolled?: boolean }) {
  const { isSaved, toggleSave } = useApp();
  const saved = isSaved("program", program.id);
  const [demoOpen, setDemoOpen] = useState(false);
  const demo = programDemoVideo(program);
  const discount = Math.round(
    ((program.originalPrice - program.price) / program.originalPrice) * 100,
  );

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group surface-card flex h-full flex-col overflow-hidden"
    >
      <div className="relative h-36">
        <SmartImage
          src={imageFor(program.category)}
          alt={`${program.category} program`}
          wrapperClassName="absolute inset-0"
          className="transition-transform duration-700 group-hover:scale-105"
        />
        <div className={cn("absolute inset-0 bg-gradient-to-br opacity-70", program.gradient)} />
        <div className="absolute inset-0 flex items-end justify-between p-4">
          <Badge variant="secondary" className="backdrop-blur">
            {program.category}
          </Badge>
          {discount > 0 && (
            <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold text-accent-foreground">
              {discount}% OFF
            </span>
          )}
        </div>
        {demo ? (
          <button
            type="button"
            onClick={() => setDemoOpen(true)}
            className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-background/85 px-2.5 py-1 text-[11px] font-semibold backdrop-blur transition-colors hover:bg-background"
          >
            <Play className="size-3 fill-current" /> Watch demo
          </button>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded-md bg-surface-2 px-2 py-0.5 font-medium">{program.level}</span>
          <span className="flex items-center gap-1">
            <Star className="size-3.5 fill-accent text-accent" />
            <span className="font-semibold text-foreground">{program.rating}</span>
          </span>
          <span className="flex items-center gap-1">
            <Users className="size-3.5" /> {compact(program.learners)}
          </span>
        </div>

        <h3 className="mt-3 text-lg leading-snug font-semibold">{program.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{program.description}</p>

        <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
          <Meta icon={Clock} label={`${program.durationWeeks} wks`} />
          <Meta icon={FolderGit2} label={`${program.projects} projects`} />
          <Meta icon={Award} label={program.certificate ? "Certificate" : "No cert"} />
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {program.skills.slice(0, 3).map((s) => (
            <span
              key={s}
              className="rounded-md border border-border px-2 py-0.5 text-[11px] text-muted-foreground"
            >
              {s}
            </span>
          ))}
          {program.mentorship && (
            <span className="rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] text-primary">
              Mentorship
            </span>
          )}
          {program.jobSupport && (
            <span className="rounded-md border border-success/30 bg-success/10 px-2 py-0.5 text-[11px] text-success">
              Job support
            </span>
          )}
        </div>

        <div className="mt-5 flex items-end justify-between border-t border-border pt-4">
          <div>
            <div className="text-xl font-semibold">{inr(program.price)}</div>
            <div className="text-xs text-muted-foreground line-through">
              {inr(program.originalPrice)}
            </div>
          </div>
          <button
            onClick={() => void toggleSave("program", program.id)}
            aria-label={saved ? "Remove from saved" : "Save program"}
            title={saved ? "Remove from saved" : "Save program"}
            className={cn(
              "grid size-9 shrink-0 place-items-center rounded-lg border border-border transition-colors",
              saved ? "bg-primary/12 text-primary" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {saved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
          </button>
          <Button asChild size="sm">
            <Link to="/programs/$slug" params={{ slug: program.slug }}>
              {enrolled ? "Continue" : "View Program"}
            </Link>
          </Button>
        </div>
      </div>

      {demo ? (
        <DemoVideoDialog
          open={demoOpen}
          onClose={() => setDemoOpen(false)}
          src={demo.src}
          srcFallback={demo.srcFallback}
          poster={imageFor(program.category)}
          title={program.title}
          subtitle={program.description}
          credit={demo.credit}
        />
      ) : null}
    </motion.div>
  );
}

function Meta({ icon: Icon, label }: { icon: typeof Clock; label: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg bg-surface-2 px-2 py-1.5 text-muted-foreground">
      <Icon className="size-3.5 shrink-0" />
      <span className="truncate">{label}</span>
    </div>
  );
}
