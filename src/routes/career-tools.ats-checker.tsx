import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, FileUp, Loader2, RotateCcw, Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { ProgressBar, Reveal } from "@/components/common/motion-primitives";
import { PublicShell } from "@/components/layout/PublicShell";
import { Button } from "@/components/ui/button";
import { scoreResume } from "@/lib/insights";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/career-tools/ats-checker")({
  head: () => ({
    meta: [
      { title: "ATS Resume Checker — Unified Mentor" },
      {
        name: "description",
        content:
          "Score your resume against applicant tracking systems and get a category breakdown with specific, prioritised fixes.",
      },
      { property: "og:title", content: "ATS Resume Checker — Unified Mentor" },
      {
        property: "og:description",
        content: "Get an ATS score with a category breakdown and prioritised fixes.",
      },
    ],
  }),
  component: AtsChecker,
});

function AtsChecker() {
  const { ats, setAts } = useApp();
  const inputRef = useRef<HTMLInputElement>(null);
  const [analysing, setAnalysing] = useState(false);
  const [dragging, setDragging] = useState(false);

  function analyse(fileName: string) {
    setAnalysing(true);
    setTimeout(() => {
      setAts(scoreResume(fileName, fileName.length));
      setAnalysing(false);
      toast.success("Resume analysed", { description: fileName });
    }, 1300);
  }

  function onFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    if (!/\.(pdf|docx?|txt)$/i.test(file.name)) {
      toast.error("Unsupported file", { description: "Upload a PDF, DOC, DOCX or TXT resume." });
      return;
    }
    analyse(file.name);
  }

  const tone = (n: number): "success" | "primary" | "accent" =>
    n >= 85 ? "success" : n >= 70 ? "primary" : "accent";

  return (
    <PublicShell>
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-xs font-semibold tracking-widest text-primary uppercase">
              Career tools
            </p>
            <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">ATS Resume Checker</h1>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Most resumes are filtered by software before a human reads them. Find out how yours
              scores and exactly what to change.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:px-8">
        <div className="space-y-5">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              onFiles(e.dataTransfer.files);
            }}
            className={cn(
              "surface-card flex flex-col items-center justify-center gap-3 border-2 border-dashed p-10 text-center transition-colors",
              dragging ? "border-primary bg-primary/5" : "border-border",
            )}
          >
            <span className="grid size-12 place-items-center rounded-2xl bg-primary/12 text-primary">
              {analysing ? (
                <Loader2 className="size-6 animate-spin" />
              ) : (
                <FileUp className="size-6" />
              )}
            </span>
            <p className="font-semibold">
              {analysing ? "Analysing your resume…" : "Drop your resume here"}
            </p>
            <p className="text-xs text-muted-foreground">PDF, DOC, DOCX or TXT · max 5 MB</p>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              className="hidden"
              onChange={(e) => onFiles(e.target.files)}
            />
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              <Button onClick={() => inputRef.current?.click()} disabled={analysing}>
                Choose file
              </Button>
              <Button
                variant="outline"
                disabled={analysing}
                onClick={() => analyse("sample-resume.pdf")}
              >
                Use sample resume
              </Button>
            </div>
          </div>

          <div className="surface-card p-6">
            <h2 className="font-display text-lg font-semibold">What we check</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              {[
                "Parsing safety — columns, tables, headers, graphics",
                "Keyword coverage against real job descriptions",
                "Experience framing — outcomes vs responsibilities",
                "Skills section completeness and grouping",
                "Section order, length and consistency",
              ].map((x) => (
                <li key={x} className="flex gap-2.5">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  {x}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs text-muted-foreground">
              Prototype note: scoring is simulated locally — no file leaves your browser.
            </p>
          </div>
        </div>

        <div>
          {!ats ? (
            <div className="surface-card grid h-full place-items-center p-12 text-center">
              <div>
                <Sparkles className="mx-auto size-8 text-primary/50" />
                <p className="mt-4 font-display text-lg font-semibold">No analysis yet</p>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  Upload a resume or run the sample to see your score, category breakdown and
                  prioritised fixes.
                </p>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="space-y-5"
            >
              <div className="surface-card p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">{ats.fileName}</p>
                    <p className="mt-1 font-display text-4xl font-semibold">
                      {ats.total}
                      <span className="text-lg text-muted-foreground">/100</span>
                    </p>
                    <p className="mt-1 text-sm font-medium text-primary">
                      {ats.total >= 85
                        ? "Excellent — ready to apply"
                        : ats.total >= 70
                          ? "Good — a few fixes will lift you"
                          : "Needs work before applying"}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAts(scoreResume(ats.fileName, Math.random() * 10))}
                  >
                    <RotateCcw className="size-4" /> Re-run
                  </Button>
                </div>
                <ProgressBar value={ats.total} className="mt-5 h-2.5" tone={tone(ats.total)} />
              </div>

              <div className="surface-card p-6">
                <h2 className="font-display text-lg font-semibold">Category breakdown</h2>
                <div className="mt-5 space-y-4">
                  {ats.breakdown.map((b) => (
                    <div key={b.label}>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{b.label}</span>
                        <span className="text-muted-foreground">{b.score}/100</span>
                      </div>
                      <ProgressBar value={b.score} className="mt-1.5" tone={tone(b.score)} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="surface-card p-6">
                  <h3 className="flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="size-4 text-success" /> Strengths
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    {ats.strengths.map((s) => (
                      <li key={s}>• {s}</li>
                    ))}
                  </ul>
                </div>
                <div className="surface-card p-6">
                  <h3 className="flex items-center gap-2 font-semibold">
                    <AlertTriangle className="size-4 text-accent" /> Fix these next
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    {ats.improvements.map((s) => (
                      <li key={s}>• {s}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="surface-card flex flex-wrap items-center justify-between gap-4 p-6">
                <p className="text-sm text-muted-foreground">
                  Apply these fixes in the builder and re-check in a minute.
                </p>
                <Button asChild>
                  <Link to="/career-tools/resume-builder">Open resume builder</Link>
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </PublicShell>
  );
}
