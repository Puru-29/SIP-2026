import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, Plus, Printer, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Reveal } from "@/components/common/motion-primitives";
import { PublicShell } from "@/components/layout/PublicShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { ResumeData } from "@/types";

export const Route = createFileRoute("/career-tools/resume-builder")({
  head: () => ({
    meta: [
      { title: "Resume Builder — Unified Mentor" },
      {
        name: "description",
        content:
          "Build an ATS-safe resume with guided sections, four templates, live preview and instant PDF export.",
      },
      { property: "og:title", content: "Resume Builder — Unified Mentor" },
      {
        property: "og:description",
        content: "Guided sections, four ATS-safe templates and a live preview.",
      },
    ],
  }),
  component: ResumeBuilder,
});

const templates: { id: ResumeData["template"]; label: string; note: string }[] = [
  { id: "aurora", label: "Aurora", note: "Accent header, modern" },
  { id: "onyx", label: "Onyx", note: "Monochrome, formal" },
  { id: "compact", label: "Compact", note: "One page, dense" },
  { id: "editorial", label: "Editorial", note: "Serif, spacious" },
];

const sections = ["Personal", "Experience", "Education", "Skills", "Projects", "Extras"] as const;

function ResumeBuilder() {
  const { resume, setResume, saveResume, user } = useApp();
  const [section, setSection] = useState<(typeof sections)[number]>("Personal");

  return (
    <PublicShell>
      <section className="border-b border-border bg-surface print:hidden">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-xs font-semibold tracking-widest text-primary uppercase">
              Career tools
            </p>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-semibold sm:text-4xl">Resume Builder</h1>
                <p className="mt-2 max-w-xl text-muted-foreground">
                  Everything saves to your browser as you type. Print or export whenever you're
                  ready.
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link to="/career-tools/ats-checker">Check ATS score</Link>
                </Button>
                <Button onClick={() => window.print()}>
                  <Printer className="size-4" /> Print / PDF
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
        <div className="print:hidden">
          <div className="flex flex-wrap gap-1.5">
            {sections.map((s) => (
              <button
                key={s}
                onClick={() => setSection(s)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  section === s
                    ? "bg-primary/12 text-primary"
                    : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
                )}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="surface-card mt-5 space-y-4 p-6">
            {section === "Personal" && (
              <>
                <Field
                  label="Full name"
                  value={resume.personal.name}
                  onChange={(v) =>
                    setResume((p) => ({ ...p, personal: { ...p.personal, name: v } }))
                  }
                />
                <Field
                  label="Headline / target role"
                  value={resume.personal.title}
                  onChange={(v) =>
                    setResume((p) => ({ ...p, personal: { ...p.personal, title: v } }))
                  }
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Email"
                    value={resume.personal.email}
                    onChange={(v) =>
                      setResume((p) => ({ ...p, personal: { ...p.personal, email: v } }))
                    }
                  />
                  <Field
                    label="Phone"
                    value={resume.personal.phone}
                    onChange={(v) =>
                      setResume((p) => ({ ...p, personal: { ...p.personal, phone: v } }))
                    }
                  />
                </div>
                <Field
                  label="Location"
                  value={resume.personal.location}
                  onChange={(v) =>
                    setResume((p) => ({ ...p, personal: { ...p.personal, location: v } }))
                  }
                />
                <div className="space-y-1.5">
                  <Label>Professional summary</Label>
                  <Textarea
                    rows={4}
                    value={resume.personal.summary}
                    onChange={(e) =>
                      setResume((p) => ({
                        ...p,
                        personal: { ...p.personal, summary: e.target.value },
                      }))
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Lead with the outcome you deliver, then the stack. Two or three lines max.
                  </p>
                </div>
              </>
            )}

            {section === "Experience" && (
              <ListEditor
                items={resume.experience}
                onChange={(items) => setResume((p) => ({ ...p, experience: items }))}
                blank={{ company: "", title: "", period: "", summary: "" }}
                render={(item, update) => (
                  <>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field
                        label="Company"
                        value={item.company}
                        onChange={(v) => update({ company: v })}
                      />
                      <Field
                        label="Title"
                        value={item.title}
                        onChange={(v) => update({ title: v })}
                      />
                    </div>
                    <Field
                      label="Period"
                      value={item.period}
                      onChange={(v) => update({ period: v })}
                    />
                    <div className="space-y-1.5">
                      <Label>Impact</Label>
                      <Textarea
                        rows={3}
                        value={item.summary}
                        onChange={(e) => update({ summary: e.target.value })}
                      />
                    </div>
                  </>
                )}
                addLabel="Add experience"
              />
            )}

            {section === "Education" && (
              <ListEditor
                items={resume.education}
                onChange={(items) => setResume((p) => ({ ...p, education: items }))}
                blank={{ school: "", degree: "", year: "", score: "" }}
                render={(item, update) => (
                  <>
                    <Field
                      label="Institution"
                      value={item.school}
                      onChange={(v) => update({ school: v })}
                    />
                    <div className="grid gap-3 sm:grid-cols-3">
                      <Field
                        label="Degree"
                        value={item.degree}
                        onChange={(v) => update({ degree: v })}
                      />
                      <Field label="Year" value={item.year} onChange={(v) => update({ year: v })} />
                      <Field
                        label="Score"
                        value={item.score}
                        onChange={(v) => update({ score: v })}
                      />
                    </div>
                  </>
                )}
                addLabel="Add education"
              />
            )}

            {section === "Skills" && (
              <TagEditor
                label="Skills"
                items={resume.skills}
                onChange={(skills) => setResume((p) => ({ ...p, skills }))}
                hint="Group by area: languages, frameworks, tools, platforms."
              />
            )}

            {section === "Projects" && (
              <ListEditor
                items={resume.projects}
                onChange={(items) => setResume((p) => ({ ...p, projects: items }))}
                blank={{ name: "", description: "", link: "" }}
                render={(item, update) => (
                  <>
                    <Field
                      label="Project"
                      value={item.name}
                      onChange={(v) => update({ name: v })}
                    />
                    <div className="space-y-1.5">
                      <Label>Description</Label>
                      <Textarea
                        rows={3}
                        value={item.description}
                        onChange={(e) => update({ description: e.target.value })}
                      />
                    </div>
                    <Field label="Link" value={item.link} onChange={(v) => update({ link: v })} />
                  </>
                )}
                addLabel="Add project"
              />
            )}

            {section === "Extras" && (
              <>
                <TagEditor
                  label="Certifications"
                  items={resume.certifications}
                  onChange={(certifications) => setResume((p) => ({ ...p, certifications }))}
                />
                <TagEditor
                  label="Achievements"
                  items={resume.achievements}
                  onChange={(achievements) => setResume((p) => ({ ...p, achievements }))}
                />
              </>
            )}
          </div>

          <div className="surface-card mt-5 p-6">
            <h2 className="text-sm font-semibold">Template</h2>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setResume((p) => ({ ...p, template: t.id }))}
                  className={cn(
                    "rounded-xl border p-3 text-left transition-colors",
                    resume.template === t.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:bg-surface-2",
                  )}
                >
                  <p className="text-sm font-medium">{t.label}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{t.note}</p>
                </button>
              ))}
            </div>
            <Button className="mt-4 w-full" onClick={() => void saveResume()} disabled={!user}>
              Save resume to my account
            </Button>
            {!user && (
              <p className="mt-2 text-xs text-muted-foreground">
                Sign in to store your resume and reuse it in applications.
              </p>
            )}
            <Button
              variant="outline"
              className="mt-2 w-full"
              onClick={() => {
                const blob = new Blob([JSON.stringify(resume, null, 2)], {
                  type: "application/json",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "resume-data.json";
                a.click();
                URL.revokeObjectURL(url);
                toast.success("Resume data exported");
              }}
            >
              <Download className="size-4" /> Export data (JSON)
            </Button>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:h-fit">
          <ResumePreview resume={resume} />
        </div>
      </section>
    </PublicShell>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function ListEditor<T extends object>({
  items,
  onChange,
  blank,
  render,
  addLabel,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  blank: T;
  render: (item: T, update: (patch: Partial<T>) => void) => React.ReactNode;
  addLabel: string;
}) {
  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-border p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Entry {i + 1}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            >
              <Trash2 className="size-4 text-destructive" />
            </Button>
          </div>
          <div className="space-y-3">
            {render(item, (patch) =>
              onChange(items.map((x, idx) => (idx === i ? { ...x, ...patch } : x))),
            )}
          </div>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => onChange([...items, { ...blank }])}>
        <Plus className="size-4" /> {addLabel}
      </Button>
    </div>
  );
}

function TagEditor({
  label,
  items,
  onChange,
  hint,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  hint?: string;
}) {
  const [draft, setDraft] = useState("");
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          value={draft}
          placeholder={`Add ${label.toLowerCase()} and press Enter`}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && draft.trim()) {
              e.preventDefault();
              onChange([...items, draft.trim()]);
              setDraft("");
            }
          }}
        />
        <Button
          variant="outline"
          onClick={() => {
            if (!draft.trim()) return;
            onChange([...items, draft.trim()]);
            setDraft("");
          }}
        >
          <Plus className="size-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((s) => (
          <button
            key={s}
            onClick={() => onChange(items.filter((x) => x !== s))}
            className="group flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
          >
            {s}
            <Trash2 className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
          </button>
        ))}
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function ResumePreview({ resume }: { resume: ResumeData }) {
  const t = resume.template;
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-white p-8 text-[13px] leading-relaxed text-neutral-800 shadow-elevated print:border-0 print:shadow-none",
        t === "editorial" && "font-serif",
        t === "compact" && "p-6 text-[12px]",
      )}
    >
      <header
        className={cn(
          "border-b pb-4",
          t === "aurora" ? "border-teal-500/60" : "border-neutral-300",
        )}
      >
        <h2
          className={cn(
            "text-2xl font-bold",
            t === "aurora" && "text-teal-700",
            t === "onyx" && "text-neutral-900",
          )}
        >
          {resume.personal.name}
        </h2>
        <p className="mt-0.5 text-sm font-medium text-neutral-600">{resume.personal.title}</p>
        <p className="mt-2 text-[11px] text-neutral-500">
          {[resume.personal.email, resume.personal.phone, resume.personal.location]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </header>

      {resume.personal.summary && (
        <Block title="Summary" template={t}>
          <p>{resume.personal.summary}</p>
        </Block>
      )}

      {resume.experience.length > 0 && (
        <Block title="Experience" template={t}>
          {resume.experience.map((e, i) => (
            <div key={i} className="mb-3 last:mb-0">
              <div className="flex justify-between gap-4">
                <p className="font-semibold">
                  {e.title}
                  {e.company ? ` · ${e.company}` : ""}
                </p>
                <p className="shrink-0 text-[11px] text-neutral-500">{e.period}</p>
              </div>
              <p className="text-neutral-600">{e.summary}</p>
            </div>
          ))}
        </Block>
      )}

      {resume.projects.length > 0 && (
        <Block title="Projects" template={t}>
          {resume.projects.map((p, i) => (
            <div key={i} className="mb-2 last:mb-0">
              <p className="font-semibold">{p.name}</p>
              <p className="text-neutral-600">{p.description}</p>
              {p.link && <p className="text-[11px] text-teal-700">{p.link}</p>}
            </div>
          ))}
        </Block>
      )}

      {resume.skills.length > 0 && (
        <Block title="Skills" template={t}>
          <p className="text-neutral-700">{resume.skills.join(" · ")}</p>
        </Block>
      )}

      {resume.education.length > 0 && (
        <Block title="Education" template={t}>
          {resume.education.map((e, i) => (
            <div key={i} className="mb-2 flex justify-between gap-4 last:mb-0">
              <div>
                <p className="font-semibold">{e.school}</p>
                <p className="text-neutral-600">{e.degree}</p>
              </div>
              <p className="shrink-0 text-[11px] text-neutral-500">
                {e.year}
                {e.score ? ` · ${e.score}` : ""}
              </p>
            </div>
          ))}
        </Block>
      )}

      {(resume.certifications.length > 0 || resume.achievements.length > 0) && (
        <Block title="Certifications & achievements" template={t}>
          <ul className="list-disc pl-4 text-neutral-700">
            {[...resume.certifications, ...resume.achievements].map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </Block>
      )}
    </div>
  );
}

function Block({
  title,
  children,
  template,
}: {
  title: string;
  children: React.ReactNode;
  template: ResumeData["template"];
}) {
  return (
    <section className="mt-4">
      <h3
        className={cn(
          "mb-1.5 text-[11px] font-bold tracking-widest uppercase",
          template === "aurora" ? "text-teal-700" : "text-neutral-500",
        )}
      >
        {title}
      </h3>
      {children}
    </section>
  );
}
