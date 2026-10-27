import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { KeyRound, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PublicShell } from "@/components/layout/PublicShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Choose a new password — Unified Mentor" },
      {
        name: "description",
        content: "Set a new password for your Unified Mentor account using your secure reset link.",
      },
      { property: "og:title", content: "Choose a new password — Unified Mentor" },
      { property: "og:description", content: "Set a new password for your account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { updatePassword } = useApp();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) return setError("Use at least 6 characters");
    if (password !== confirm) return setError("Passwords do not match");
    setError("");
    setLoading(true);
    const res = await updatePassword(password);
    setLoading(false);
    if (!res.ok) {
      setError(res.message ?? "Could not update your password. Request a new reset link.");
      return;
    }
    toast.success("Password updated", { description: "You're signed in with your new password." });
    navigate({ to: "/dashboard", replace: true });
  }

  return (
    <PublicShell bare>
      <div className="hero-gradient flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16">
        <form onSubmit={submit} className="surface-card w-full max-w-md space-y-4 p-8">
          <span className="grid size-10 place-items-center rounded-xl bg-primary/12 text-primary">
            <KeyRound className="size-5" />
          </span>
          <h1 className="font-display text-2xl font-semibold">Choose a new password</h1>
          <p className="text-sm text-muted-foreground">
            Open this page from the reset link in your email, then set a new password.
          </p>
          <div className="space-y-1.5">
            <Label htmlFor="np">New password</Label>
            <Input
              id="np"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cp">Confirm password</Label>
            <Input
              id="cp"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : "Update password"}
          </Button>
        </form>
      </div>
    </PublicShell>
  );
}
