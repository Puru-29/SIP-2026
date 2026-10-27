import { Link } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Clock,
  FolderKanban,
  PlayCircle,
  Signal,
  Star,
  Users,
  UsersRound,
} from "lucide-react";
import { useState } from "react";

import { SmartImage } from "@/components/common/SmartImage";
import { DemoVideoDialog } from "@/components/common/VideoPlayer";
import { compact, inr } from "@/lib/format";
import { imageFor } from "@/lib/images";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Course } from "@/types";

export function CourseCard({ course: c }: { course: Course }) {
  const { isSaved, toggleSave, isCourseEnrolled, courseProgressOf } = useApp();
  const [demo, setDemo] = useState(false);
  const saved = isSaved("course", c.id);
  const enrolled = isCourseEnrolled(c.id);
  const progress = enrolled ? courseProgressOf(c.id) : 0;
  const discount = Math.round(((c.originalPrice - c.price) / c.originalPrice) * 100);

  return (
    <div className="group surface-card flex h-full flex-col overflow-hidden p-0 transition-all hover:-translate-y-1.5 hover:shadow-elevated">
      <div className="relative">
        <Link to="/courses/$courseId" params={{ courseId: c.id }} aria-label={`Open ${c.title}`}>
          <SmartImage
            src={imageFor(c.category)}
            alt={`${c.title} course artwork`}
            wrapperClassName="aspect-[16/9] w-full"
            className="transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        <span
          className={cn(
            "absolute top-3 left-3 rounded-full px-2 py-0.5 text-[11px] font-semibold backdrop-blur",
            c.format === "Instructor Led"
              ? "bg-accent/80 text-accent-foreground"
              : "bg-card/85 text-primary",
          )}
        >
          {c.format}
        </span>
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {discount > 0 && (
            <span className="rounded-full bg-success/90 px-2 py-0.5 text-[11px] font-bold text-success-foreground">
              {discount}% off
            </span>
          )}
          <button
            type="button"
            onClick={() => void toggleSave("course", c.id)}
            aria-label={saved ? "Remove from saved courses" : "Save course"}
            title={saved ? "Remove from saved courses" : "Save course"}
            className={cn(
              "grid size-8 place-items-center rounded-full backdrop-blur transition-colors",
              saved
                ? "bg-primary text-primary-foreground"
                : "bg-card/85 text-muted-foreground hover:text-foreground",
            )}
          >
            {saved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
          </button>
        </div>
        <button
          type="button"
          onClick={() => setDemo(true)}
          className="absolute inset-x-3 bottom-3 flex items-center justify-center gap-1.5 rounded-lg bg-card/90 py-2 text-xs font-semibold text-foreground opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 focus-visible:opacity-100 max-sm:opacity-100"
        >
          <PlayCircle className="size-4 text-primary" /> Watch demo lecture
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] font-semibold tracking-wide text-primary uppercase">{c.group}</p>
        <h3 className="mt-1.5 font-display text-base font-semibold">
          <Link to="/courses/$courseId" params={{ courseId: c.id }} className="hover:text-primary">
            {c.title}
          </Link>
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{c.tagline}</p>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1 font-semibold text-foreground">
            <Star className="size-3.5 fill-warning text-warning" /> {c.rating.toFixed(1)}
          </span>
          <span className="flex items-center gap-1">
            <Users className="size-3.5" /> {compact(c.learners)} learners
          </span>
          <span className="flex items-center gap-1">
            <Signal className="size-3.5" /> {c.level}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-y-1.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" /> {c.hours}h
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="size-3.5" /> {c.lessonCount} lessons
          </span>
          <span className="flex items-center gap-1">
            <FolderKanban className="size-3.5" /> {c.projects} projects
          </span>
          {c.certificate && (
            <span className="flex items-center gap-1">
              <Award className="size-3.5" /> Certificate
            </span>
          )}
          {c.mentorship && (
            <span className="flex items-center gap-1">
              <UsersRound className="size-3.5" /> Mentorship
            </span>
          )}
        </div>

        {enrolled && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Your progress</span>
              <span className="font-semibold text-foreground">{progress}%</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-2">
              <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-4">
          <div>
            <p className="text-base font-semibold">{inr(c.price)}</p>
            <p className="text-xs text-muted-foreground line-through">{inr(c.originalPrice)}</p>
          </div>
          {enrolled ? (
            <Link
              to="/learning/course/$courseId"
              params={{ courseId: c.id }}
              className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
            >
              Continue learning
            </Link>
          ) : (
            <Link
              to="/courses/$courseId"
              params={{ courseId: c.id }}
              className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
            >
              View Course
            </Link>
          )}
        </div>
      </div>

      <DemoVideoDialog
        open={demo}
        onClose={() => setDemo(false)}
        src={c.demoVideo}
        {...(c.demoVideoFallback ? { srcFallback: c.demoVideoFallback } : {})}
        poster={imageFor(c.category)}
        title={c.title}
        subtitle={`${c.instructor.name} · ${c.instructor.title}, ${c.instructor.company}`}
        {...(c.demoCredit ? { credit: c.demoCredit } : {})}
      />
    </div>
  );
}
