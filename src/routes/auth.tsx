import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, GraduationCap, Loader2, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { PublicShell } from "@/components/layout/PublicShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { demoAccounts } from "@/data/users";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Role } from "@/types";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: { mode?: "login" | "register"; redirect?: string }) => ({
    mode: search.mode === "register" ? ("register" as const) : ("login" as const),
    ...(typeof search.redirect === "string" && search.redirect
      ? { redirect: search.redirect }
      : {}),
  }),
  head: () => ({
    meta: [
      { title: "Sign in — Unified Mentor" },
      {
        name: "description",
        content:
          "Sign in or create your Unified Mentor account to access programs, internships, projects and career tools.",
      },
      { property: "og:title", content: "Sign in — Unified Mentor" },
      {
        property: "og:description",
        content: "Access your learning dashboard, applications and career tools.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

const dashboardFor: Record<Role, string> = {
  student: "/dashboard",
  admin: "/admin",
  mentor: "/mentor",
  recruiter: "/recruiter",
};

function safePath(path: string) {
  return path.startsWith("/") && !path.startsWith("//") ? path : "";
}

function AuthPage() {
  const { mode, redirect } = Route.useSearch() as { mode: "login" | "register"; redirect?: string };
  const navigate = useNavigate();
  const {
    login,
    register,
    signInWithGoogle,
    sendPasswordReset,
    user,
    loading: appLoading,
  } = useApp();
  const [tab, setTab] = useState<"login" | "register" | "forgot">(
    mode === "register" ? "register" : "login",
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // once a session lands (password, Google or demo), leave the auth page
  useEffect(() => {
    if (appLoading || !user) return;
    const stored = safePath(sessionStorage.getItem("um-post-auth") ?? "");
    sessionStorage.removeItem("um-post-auth");
    const target = safePath(redirect ?? "") || stored || dashboardFor[user.role];
    navigate({ to: target, replace: true });
  }, [user, appLoading, redirect, navigate]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (!res.ok) {
      setError(res.message ?? "Invalid email or password");
      return;
    }
    toast.success("Welcome back!");
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || password.length < 6) {
      setError("Name, email and a password of at least 6 characters are required");
      return;
    }
    setError("");
    setLoading(true);
    const res = await register(name.trim(), email, password, role);
    setLoading(false);
    if (!res.ok) {
      setError(res.message ?? "Could not create the account");
      return;
    }
    toast.success("Account created", { description: "Your workspace is ready." });
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setError("Enter the email on your account");
      return;
    }
    setError("");
    setLoading(true);
    const res = await sendPasswordReset(email);
    setLoading(false);
    if (!res.ok) {
      setError(res.message ?? "Could not send the reset link");
      return;
    }
    toast.success("Reset link sent", { description: `Check ${email} for a password reset link.` });
    setTab("login");
  }

  async function handleGoogle() {
    setError("");
    setLoading(true);
    const res = await signInWithGoogle(safePath(redirect ?? "") || undefined);
    if (!res.ok) {
      setLoading(false);
      setError(res.message ?? "Google sign-in failed");
    }
  }

  async function handleDemoSignIn(
    accEmail: string,
    accPassword: string,
    accRole: Role,
    accName: string,
  ) {
    setTab("login");
    setEmail(accEmail);
    setPassword(accPassword);
    setError("");
    setLoading(true);
    let res = await login(accEmail, accPassword);
    if (!res.ok) {
      // first use of a demo account on this backend — provision it
      const created = await register(accName, accEmail, accPassword, accRole);
      if (!created.ok) {
        setLoading(false);
        setError(created.message ?? "Could not open the demo account");
        return;
      }
      res = await login(accEmail, accPassword);
    }
    setLoading(false);
    if (!res.ok) setError(res.message ?? "Could not open the demo account");
    else toast.success(`Signed in as ${accRole}`);
  }

  return (
    <PublicShell bare>
      <div className="hero-gradient relative min-h-[calc(100vh-4rem)] overflow-hidden">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-30" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="hidden lg:block">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
              <Sparkles className="size-3.5" /> Learn. Build. Get Hired.
            </span>
            <h1 className="mt-6 text-4xl leading-tight font-semibold">
              One account for learning, experience and <span className="text-gradient">hiring</span>
            </h1>
            <p className="mt-4 max-w-md text-muted-foreground">
              Track programs, internship applications, project reviews, certificates and career
              tools from a single dashboard tailored to your role.
            </p>

            <div className="mt-8 space-y-2.5">
              <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Demo accounts — one click
              </p>
              {demoAccounts.map((acc) => (
                <button
                  key={acc.email}
                  disabled={loading}
                  onClick={() =>
                    void handleDemoSignIn(acc.email, acc.password, acc.user.role, acc.user.name)
                  }
                  className="surface-card flex w-full items-center gap-3 p-3 text-left transition-all hover:-translate-y-0.5 hover:shadow-soft disabled:opacity-60"
                >
                  <span className="grid size-9 place-items-center rounded-lg bg-primary/12 text-xs font-bold text-primary uppercase">
                    {acc.user.role.slice(0, 2)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium capitalize">
                      {acc.user.role} — {acc.user.name}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {acc.email} · {acc.password}
                    </span>
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="surface-card mx-auto w-full max-w-md p-6 shadow-elevated sm:p-8"
          >
            <div className="flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
                <GraduationCap className="size-5" />
              </span>
              <span className="font-display text-lg font-semibold">Unified Mentor</span>
            </div>

            {tab !== "forgot" && (
              <div className="mt-6 grid grid-cols-2 gap-1 rounded-xl bg-surface-2 p-1">
                {(["login", "register"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTab(t);
                      setError("");
                    }}
                    className={cn(
                      "relative rounded-lg py-2 text-sm font-medium capitalize transition-colors",
                      tab === t ? "text-primary-foreground" : "text-muted-foreground",
                    )}
                  >
                    {tab === t && (
                      <motion.span
                        layoutId="auth-tab"
                        className="absolute inset-0 rounded-lg bg-primary"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span className="relative">{t === "login" ? "Sign in" : "Create account"}</span>
                  </button>
                ))}
              </div>
            )}

            {tab !== "forgot" && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-5 w-full"
                  disabled={loading}
                  onClick={() => void handleGoogle()}
                >
                  <GoogleMark /> Continue with Google
                </Button>
                <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="h-px flex-1 bg-border" /> or use email{" "}
                  <span className="h-px flex-1 bg-border" />
                </div>
              </>
            )}

            {tab === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <button
                      type="button"
                      onClick={() => {
                        setTab("forgot");
                        setError("");
                      }}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Loader2 className="size-4 animate-spin" /> : "Sign in"}
                </Button>
              </form>
            )}

            {tab === "register" && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    placeholder="Alex Mehra"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="remail">Email</Label>
                  <Input
                    id="remail"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="rpassword">Password</Label>
                  <Input
                    id="rpassword"
                    type="password"
                    autoComplete="new-password"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>I am a</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["student", "mentor", "recruiter", "admin"] as Role[]).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={cn(
                          "rounded-lg border px-3 py-2 text-sm font-medium capitalize transition-colors",
                          role === r
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-muted-foreground hover:bg-surface-2",
                        )}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Loader2 className="size-4 animate-spin" /> : "Create account"}
                </Button>
              </form>
            )}

            {tab === "forgot" && (
              <form onSubmit={handleForgot} className="mt-6 space-y-4">
                <div>
                  <h2 className="font-display text-lg font-semibold">Reset your password</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    We&apos;ll email you a secure link to choose a new password.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="femail">Email</Label>
                  <Input
                    id="femail"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <>
                      <Mail className="size-4" /> Send reset link
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setTab("login");
                    setError("");
                  }}
                >
                  Back to sign in
                </Button>
              </form>
            )}

            <p className="mt-5 flex items-start gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-primary" />
              Accounts are secured by Unified Mentor&apos;s backend. New accounts start empty — your
              learning, applications and certificates are private to you.
            </p>

            <p className="mt-3 text-center text-xs text-muted-foreground">
              By continuing you agree to our{" "}
              <Link to="/resources" className="text-primary hover:underline">
                platform guidelines
              </Link>
              .
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2 lg:hidden">
              {demoAccounts.map((acc) => (
                <Button
                  key={acc.email}
                  variant="outline"
                  size="sm"
                  disabled={loading}
                  onClick={() =>
                    void handleDemoSignIn(acc.email, acc.password, acc.user.role, acc.user.name)
                  }
                  className="capitalize"
                >
                  {acc.user.role}
                </Button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </PublicShell>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.4a5.5 5.5 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.6-5.2 3.6-8.8Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3a7.2 7.2 0 0 1-10.7-3.8H1.3v3.1A12 12 0 0 0 12 24Z"
      />
      <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.3a12 12 0 0 0 0 10.8l4-3.1Z" />
      <path
        fill="#EA4335"
        d="M12 4.8c1.8 0 3.4.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1A7.2 7.2 0 0 1 12 4.8Z"
      />
    </svg>
  );
}
