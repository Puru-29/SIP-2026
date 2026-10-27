import { CheckCircle2, Paperclip, Send } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { notify, useApp } from "@/lib/store";

type Errors = Partial<Record<"name" | "email" | "phone" | "why", string>>;

export function ApplyDialog({
  open,
  onOpenChange,
  kind,
  refId,
  title,
  company,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  kind: "job" | "internship";
  refId: string;
  title: string;
  company: string;
}) {
  const { user, resume, applyTo } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [skills, setSkills] = useState("");
  const [why, setWhy] = useState("");
  const [fileName, setFileName] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
    setPhone(resume.personal.phone ?? "");
    setSkills((user?.skills ?? resume.skills).slice(0, 6).join(", "));
    setWhy("");
    setFileName(user ? `${user.name.toLowerCase().replace(/\s+/g, "-")}-resume.pdf` : "resume.pdf");
    setErrors({});
    setDone(false);
  }, [open, user, resume]);

  function validate(): boolean {
    const e: Errors = {};
    if (name.trim().length < 2) e.name = "Enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()))
      e.email = "Enter a valid email address.";
    if (phone.replace(/\D/g, "").length < 10) e.phone = "Enter a 10-digit phone number.";
    if (why.trim().length < 40) e.why = "Tell us at least a couple of sentences (40+ characters).";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function submit() {
    if (!validate()) return;
    applyTo({
      kind,
      refId,
      title,
      company,
      resumeName: fileName || "resume.pdf",
      note: why.trim().slice(0, 600),
    });
    setDone(true);
    notify("Application submitted", `${title} at ${company} — tracked in My Applications.`);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        {done ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2 className="size-12 text-success" />
            <h2 className="font-display text-xl font-semibold">Application sent</h2>
            <p className="max-w-sm text-sm text-muted-foreground">
              {title} at {company} is now in your application tracker with status{" "}
              <span className="font-medium text-foreground">Applied</span>. You&apos;ll get a
              notification when the stage changes.
            </p>
            <div className="mt-2 flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Keep browsing
              </Button>
              <Button asChild>
                <a href="/dashboard/applications">View tracker</a>
              </Button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Apply — {title}</DialogTitle>
            </DialogHeader>
            <p className="-mt-2 text-sm text-muted-foreground">
              {company} · your details are prefilled from your profile.
            </p>

            <div className="mt-2 grid gap-4">
              <Field label="Full name" error={errors.name}>
                <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={80} />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Email" error={errors.email}>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    maxLength={120}
                  />
                </Field>
                <Field label="Phone" error={errors.phone}>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={20} />
                </Field>
              </div>
              <Field label="Resume">
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-input px-3 py-2.5 text-sm text-muted-foreground hover:border-primary hover:text-foreground">
                  <Paperclip className="size-4" />
                  <span className="truncate">{fileName || "Attach a PDF or DOCX"}</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setFileName(f.name);
                    }}
                  />
                </label>
              </Field>
              <Field label="Key skills">
                <Input
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  maxLength={200}
                  placeholder="React, TypeScript, Node.js"
                />
              </Field>
              <Field label="Why should we select you?" error={errors.why}>
                <Textarea
                  value={why}
                  onChange={(e) => setWhy(e.target.value)}
                  rows={4}
                  maxLength={800}
                  placeholder="Mention a relevant project, what you built, and the outcome."
                />
                <p className="mt-1 text-right text-[11px] text-muted-foreground">
                  {why.length}/800
                </p>
              </Field>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={submit}>
                <Send className="size-4" /> Submit application
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-xs font-medium">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
