import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, Moon, Pencil, Plus, Sun, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { ProgressBar } from "@/components/common/motion-primitives";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useStudentNav } from "@/components/layout/dashboard-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useApp } from "@/lib/store";
import type { WorkExperience } from "@/types";

export const Route = createFileRoute("/dashboard/profile")({
  head: () => ({
    meta: [
      { title: "Profile & Settings — Unified Mentor" },
      {
        name: "description",
        content:
          "Manage your personal information, skills, work experience, appearance and profile strength.",
      },
      { property: "og:title", content: "Profile & Settings — Unified Mentor" },
      {
        property: "og:description",
        content: "Personal information, skills, work experience and preferences.",
      },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <DashboardShell
      allow={["student", "mentor", "recruiter", "admin"]}
      title="Profile & settings"
      subtitle="What recruiters see, and how the app behaves"
      items={useStudentNav()}
    >
      <Inner />
    </DashboardShell>
  );
}

function ageFrom(dob: string) {
  if (!dob) return "";
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return "";
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age -= 1;
  return age >= 0 && age < 120 ? String(age) : "";
}

function periodOf(e: WorkExperience) {
  const fmt = (v?: string) =>
    v ? new Date(`${v}-01`).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "";
  const start = fmt(e.startDate);
  const end = e.current ? "Present" : fmt(e.endDate);
  if (!start && !end) return e.period || "";
  return [start, end].filter(Boolean).join(" – ");
}

function completionOf(input: {
  name: string;
  phone: string;
  location: string;
  headline: string;
  about: string;
  skills: number;
  experience: number;
  dob: string;
}) {
  let score = 0;
  if (input.name.trim()) score += 12;
  if (input.phone.trim()) score += 10;
  if (input.dob) score += 8;
  if (input.location.trim()) score += 10;
  if (input.headline.trim().length >= 4) score += 15;
  if (input.about.trim().length >= 40) score += 15;
  score += Math.min(15, input.skills * 3);
  score += Math.min(15, input.experience * 15);
  return Math.min(100, score);
}

function Inner() {
  const { user, resume, setResume, theme, toggleTheme, updateUser } = useApp();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [dob, setDob] = useState(user?.dateOfBirth ?? "");
  const [location, setLocation] = useState(user?.location ?? "");
  const [address, setAddress] = useState(user?.address ?? "");
  const [headline, setHeadline] = useState(user?.headline ?? "");
  const [about, setAbout] = useState(user?.about ?? "");
  const [skills, setSkills] = useState<string[]>(user?.skills ?? []);
  const [skillDraft, setSkillDraft] = useState("");
  const [saving, setSaving] = useState(false);

  // keep local form in sync once the account data hydrates
  useEffect(() => {
    if (!user) return;
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone);
    setDob(user.dateOfBirth);
    setLocation(user.location);
    setAddress(user.address);
    setHeadline(user.headline);
    setAbout(user.about);
    setSkills(user.skills);
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) return null;

  const experience = user.experience;
  const strength = completionOf({
    name,
    phone,
    location,
    headline,
    about,
    dob,
    skills: skills.length,
    experience: experience.length,
  });

  const addSkill = () => {
    const v = skillDraft.trim();
    if (!v) return;
    if (skills.some((s) => s.toLowerCase() === v.toLowerCase())) {
      setSkillDraft("");
      return;
    }
    setSkills([...skills, v]);
    setSkillDraft("");
  };

  const save = async () => {
    if (!name.trim()) {
      toast.error("Your full name is required");
      return;
    }
    setSaving(true);
    await updateUser({
      name: name.trim(),
      phone: phone.trim(),
      dateOfBirth: dob,
      location: location.trim(),
      address: address.trim(),
      headline: headline.trim(),
      about: about.trim(),
      skills,
      profileCompletion: strength,
      avatar:
        name
          .trim()
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase() || "UM",
    });
    setResume((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        name: name.trim(),
        title: headline.trim(),
        email: email.trim(),
        phone: phone.trim(),
        location: location.trim(),
        summary: about.trim(),
      },
      skills,
    }));
    setSaving(false);
    toast.success("Profile saved", { description: "Your details are stored on your account." });
  };

  const saveExperience = async (entry: WorkExperience, index: number | null) => {
    const withPeriod = { ...entry, period: periodOf(entry) };
    const next =
      index === null
        ? [...experience, withPeriod]
        : experience.map((e, i) => (i === index ? withPeriod : e));
    await updateUser({
      experience: next,
      profileCompletion: completionOf({
        name,
        phone,
        location,
        headline,
        about,
        dob,
        skills: skills.length,
        experience: next.length,
      }),
    });
    setResume((prev) => ({
      ...prev,
      experience: next.map((e) => ({
        company: e.company,
        title: e.title,
        period: e.period,
        summary: e.summary,
      })),
    }));
    toast.success(index === null ? "Experience added" : "Experience updated");
  };

  const removeExperience = async (index: number) => {
    const next = experience.filter((_, i) => i !== index);
    await updateUser({
      experience: next,
      profileCompletion: completionOf({
        name,
        phone,
        location,
        headline,
        about,
        dob,
        skills: skills.length,
        experience: next.length,
      }),
    });
    setResume((prev) => ({
      ...prev,
      experience: next.map((e) => ({
        company: e.company,
        title: e.title,
        period: e.period,
        summary: e.summary,
      })),
    }));
    toast.success("Experience removed");
  };

  return (
    <div className="space-y-6">
      <div className="surface-card p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="grid size-16 place-items-center rounded-2xl bg-primary/12 font-display text-xl font-semibold text-primary">
            {(
              user.avatar ||
              user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
            ).slice(0, 2)}
          </div>
          <div className="min-w-0">
            <h2 className="font-display text-xl font-semibold">{user.name || "Your name"}</h2>
            <p className="text-sm text-muted-foreground">
              {user.email}
              {user.location ? ` · ${user.location}` : ""}
            </p>
          </div>
          <div className="ml-auto w-full max-w-xs">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Profile strength</span>
              <span>{strength}%</span>
            </div>
            <ProgressBar value={strength} className="mt-1.5" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <div className="surface-card space-y-4 p-6">
            <h3 className="font-semibold">Personal information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="p-name">Full name</Label>
                <Input id="p-name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-email">Email address</Label>
                <Input
                  id="p-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <p className="text-[11px] text-muted-foreground">
                  Used on your resume. Your sign-in email stays the same.
                </p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-phone">Phone number</Label>
                <Input
                  id="p-phone"
                  value={phone}
                  placeholder="+91 90000 00000"
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-dob">Date of birth</Label>
                <Input
                  id="p-dob"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
                <p className="text-[11px] text-muted-foreground">
                  {ageFrom(dob) ? `Age: ${ageFrom(dob)}` : "Age is calculated from this date."}
                </p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-loc">Location</Label>
                <Input
                  id="p-loc"
                  value={location}
                  placeholder="City, Country"
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-addr">Address</Label>
                <Input
                  id="p-addr"
                  value={address}
                  placeholder="Street, area, PIN"
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-head">Headline</Label>
              <Input
                id="p-head"
                value={headline}
                placeholder="Aspiring full stack developer"
                onChange={(e) => setHeadline(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-about">About</Label>
              <Textarea
                id="p-about"
                rows={4}
                value={about}
                placeholder="A short summary recruiters read first."
                onChange={(e) => setAbout(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-skill">Skills (shared with the resume builder)</Label>
              <div className="flex gap-2">
                <Input
                  id="p-skill"
                  value={skillDraft}
                  placeholder="Add a skill"
                  onChange={(e) => setSkillDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                />
                <Button variant="outline" onClick={addSkill} aria-label="Add skill">
                  <Plus className="size-4" />
                </Button>
              </div>
              {skills.length === 0 ? (
                <p className="text-xs text-muted-foreground">No skills added yet.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSkills(skills.filter((x) => x !== s))}
                      className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                    >
                      {s} <X className="size-3" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button onClick={save} disabled={saving}>
              {saving ? "Saving…" : "Save profile"}
            </Button>
          </div>

          <ExperienceSection
            items={experience}
            onSave={saveExperience}
            onDelete={removeExperience}
          />
        </div>

        <div className="space-y-6">
          <div className="surface-card p-6">
            <h3 className="font-semibold">Appearance</h3>
            <p className="mt-1 text-sm text-muted-foreground">Currently using the {theme} theme.</p>
            <Button variant="outline" className="mt-3 w-full" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
              Switch to {theme === "dark" ? "light" : "dark"}
            </Button>
          </div>

          <div className="surface-card p-6">
            <h3 className="font-semibold">Education</h3>
            <div className="mt-3 space-y-3 text-sm">
              {user.education.length === 0 && (
                <p className="text-xs text-muted-foreground">No education added yet.</p>
              )}
              {user.education.map((e) => (
                <div key={`${e.school}-${e.year}`}>
                  <p className="font-medium">{e.school}</p>
                  <p className="text-xs text-muted-foreground">
                    {e.degree} · {e.year}
                  </p>
                </div>
              ))}
            </div>
            <Button asChild variant="outline" size="sm" className="mt-4 w-full">
              <Link to="/career-tools/resume-builder">Edit in resume builder</Link>
            </Button>
          </div>

          <div className="surface-card p-6">
            <h3 className="font-semibold">Resume</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {resume.skills.length || resume.experience.length
                ? "Your resume uses your saved profile details."
                : "You haven't built a resume yet."}
            </p>
            <Button asChild size="sm" className="mt-3 w-full">
              <Link to="/career-tools/resume-builder">Open resume builder</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

const emptyExperience: WorkExperience = {
  company: "",
  title: "",
  period: "",
  summary: "",
  employmentType: "Full-time",
  location: "",
  startDate: "",
  endDate: "",
  current: false,
};

function ExperienceSection({
  items,
  onSave,
  onDelete,
}: {
  items: WorkExperience[];
  onSave: (entry: WorkExperience, index: number | null) => Promise<void>;
  onDelete: (index: number) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<WorkExperience>(emptyExperience);

  const startAdd = () => {
    setDraft(emptyExperience);
    setIndex(null);
    setOpen(true);
  };
  const startEdit = (i: number) => {
    setDraft({ ...emptyExperience, ...items[i] });
    setIndex(i);
    setOpen(true);
  };

  return (
    <div className="surface-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold">Work experience</h3>
          <p className="text-sm text-muted-foreground">
            Roles, internships and freelance work you want recruiters to see.
          </p>
        </div>
        <Button size="sm" onClick={startAdd}>
          <Plus className="size-4" /> Add experience
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-border p-6 text-center">
          <Briefcase className="mx-auto size-5 text-muted-foreground" />
          <p className="mt-2 text-sm font-medium">No work experience added yet.</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Add your first role to raise your experience score on the dashboard.
          </p>
        </div>
      ) : (
        <ol className="mt-5 space-y-3">
          {items.map((e, i) => (
            <li
              key={`${e.company}-${e.title}-${i}`}
              className="rounded-xl border border-border p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium">
                    {e.title} · {e.company}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {[e.period || periodOf(e), e.employmentType, e.location]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Edit experience"
                    onClick={() => startEdit(i)}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Delete experience"
                    onClick={() => void onDelete(i)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
              {e.summary && (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{e.summary}</p>
              )}
            </li>
          ))}
        </ol>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{index === null ? "Add experience" : "Edit experience"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="x-title">Job title</Label>
              <Input
                id="x-title"
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="x-company">Company</Label>
              <Input
                id="x-company"
                value={draft.company}
                onChange={(e) => setDraft({ ...draft, company: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="x-type">Employment type</Label>
              <select
                id="x-type"
                value={draft.employmentType}
                onChange={(e) => setDraft({ ...draft, employmentType: e.target.value })}
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
              >
                {["Full-time", "Part-time", "Internship", "Contract", "Freelance"].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="x-loc">Location</Label>
              <Input
                id="x-loc"
                value={draft.location}
                onChange={(e) => setDraft({ ...draft, location: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="x-start">Start date</Label>
              <Input
                id="x-start"
                type="month"
                value={draft.startDate}
                onChange={(e) => setDraft({ ...draft, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="x-end">End date</Label>
              <Input
                id="x-end"
                type="month"
                disabled={draft.current}
                value={draft.endDate}
                onChange={(e) => setDraft({ ...draft, endDate: e.target.value })}
              />
            </div>
            <label className="flex items-center gap-2 text-sm sm:col-span-2">
              <input
                type="checkbox"
                checked={draft.current}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    current: e.target.checked,
                    ...(e.target.checked ? { endDate: "" } : {}),
                  })
                }
                className="size-4 rounded border-input"
              />
              I currently work here
            </label>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="x-sum">Description / responsibilities</Label>
              <Textarea
                id="x-sum"
                rows={4}
                value={draft.summary}
                onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (!draft.title.trim() || !draft.company.trim()) {
                  toast.error("Job title and company are required");
                  return;
                }
                await onSave(draft, index);
                setOpen(false);
              }}
            >
              {index === null ? "Add experience" : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
