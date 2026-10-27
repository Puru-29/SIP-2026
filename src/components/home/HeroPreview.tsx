import { motion } from "framer-motion";
import { BriefcaseBusiness, FileText, GraduationCap, Sparkles, TrendingUp } from "lucide-react";

import { ProgressBar } from "@/components/common/motion-primitives";

const float = (delay: number) => ({
  animate: { y: [0, -10, 0] },
  transition: { duration: 6, repeat: Infinity, ease: "easeInOut" as const, delay },
});

export function HeroPreview() {
  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: 30, rotateX: 8 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="glass relative rounded-3xl p-4 shadow-elevated"
      >
        <div className="mb-3 flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-destructive/70" />
          <span className="size-2.5 rounded-full bg-accent/70" />
          <span className="size-2.5 rounded-full bg-success/70" />
          <span className="ml-2 text-[11px] text-muted-foreground">
            unifiedmentor.com/dashboard
          </span>
        </div>

        <div className="rounded-2xl bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Good morning</p>
              <p className="font-display text-lg font-semibold">Alex Mehra 👋</p>
            </div>
            <div className="rounded-xl border border-primary/30 bg-primary/10 px-3 py-1.5 text-right">
              <p className="text-[10px] tracking-wide text-primary uppercase">Career readiness</p>
              <p className="font-display text-xl leading-none font-semibold text-primary">82%</p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <PreviewCard
              icon={<GraduationCap className="size-4" />}
              label="Current course"
              value="Full Stack Development"
              progress={64}
              caption="Module 5 · JWT and refresh tokens"
            />
            <PreviewCard
              icon={<BriefcaseBusiness className="size-4" />}
              label="Internship"
              value="Northwind Labs"
              progress={48}
              caption="Week 5 of 12 · On track"
              tone="accent"
            />
            <PreviewCard
              icon={<FileText className="size-4" />}
              label="Resume score"
              value="78 / 100"
              progress={78}
              caption="+7 this week"
              tone="success"
            />
            <PreviewCard
              icon={<Sparkles className="size-4" />}
              label="Certificate progress"
              value="3 earned · 1 in progress"
              progress={72}
              caption="React Pro · 72% complete"
            />
          </div>

          <div className="mt-3 rounded-xl border border-border bg-surface p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-medium">
                <TrendingUp className="size-3.5 text-primary" /> Recommended jobs
              </span>
              <span className="text-muted-foreground">3 new</span>
            </div>
            <div className="mt-2.5 space-y-2">
              {[
                { role: "Frontend Developer", company: "Northwind Labs", match: 92 },
                { role: "React Developer", company: "Lumen Studio", match: 87 },
              ].map((j) => (
                <div key={j.role} className="flex items-center gap-3 text-xs">
                  <span className="grid size-7 place-items-center rounded-lg bg-primary/12 text-[10px] font-bold text-primary">
                    {j.match}
                  </span>
                  <span className="min-w-0 flex-1 truncate">
                    <span className="font-medium">{j.role}</span>
                    <span className="text-muted-foreground"> · {j.company}</span>
                  </span>
                  <span className="rounded-md bg-success/15 px-1.5 py-0.5 font-semibold text-success">
                    {j.match}% match
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        {...float(0)}
        className="glass absolute -top-6 -left-6 hidden rounded-2xl p-3 shadow-soft sm:block"
      >
        <p className="text-[10px] text-muted-foreground">Weekly streak</p>
        <p className="font-display text-lg font-semibold">12 days 🔥</p>
      </motion.div>

      <motion.div
        {...float(1.5)}
        className="glass absolute -right-4 -bottom-6 hidden w-44 rounded-2xl p-3 shadow-soft sm:block"
      >
        <p className="text-[10px] text-muted-foreground">Project review</p>
        <p className="text-sm font-semibold">Analytics Dashboard</p>
        <ProgressBar value={88} className="mt-2" tone="accent" />
        <p className="mt-1.5 text-[10px] text-muted-foreground">88% · mentor feedback in</p>
      </motion.div>
    </div>
  );
}

function PreviewCard({
  icon,
  label,
  value,
  progress,
  caption,
  tone = "primary",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  progress: number;
  caption: string;
  tone?: "primary" | "accent" | "success";
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="text-primary">{icon}</span>
        {label}
      </div>
      <p className="mt-1.5 truncate text-sm font-semibold">{value}</p>
      <ProgressBar value={progress} className="mt-2" tone={tone} />
      <p className="mt-1.5 text-[10px] text-muted-foreground">{caption}</p>
    </div>
  );
}
