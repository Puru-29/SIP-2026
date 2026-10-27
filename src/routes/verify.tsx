import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BadgeCheck, Search, ShieldAlert, ShieldCheck } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Reveal } from "@/components/common/motion-primitives";
import { PublicShell } from "@/components/layout/PublicShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { seedCertificates } from "@/data/opportunities";
import { prettyDate } from "@/lib/format";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/verify")({
  validateSearch: (search: { code?: string }) => ({
    code: typeof search.code === "string" ? search.code : "",
  }),
  head: () => ({
    meta: [
      { title: "Verify a Certificate — Unified Mentor" },
      {
        name: "description",
        content:
          "Employers can verify any Unified Mentor certificate by code and see the program, grade, issue date and skills assessed.",
      },
      { property: "og:title", content: "Verify a Certificate — Unified Mentor" },
      {
        property: "og:description",
        content: "Check a certificate code to confirm program, grade and skills assessed.",
      },
    ],
  }),
  component: VerifyPage,
});

function VerifyPage() {
  const { certificates } = useApp();
  const { code: initialCode } = Route.useSearch();
  const pool = certificates.length ? certificates : seedCertificates;
  const [code, setCode] = useState(initialCode);
  const [result, setResult] = useState<"idle" | "found" | "missing">("idle");
  const [match, setMatch] = useState<(typeof pool)[number] | null>(null);

  const check = useCallback(
    (value: string) => {
      const found = pool.find((c) => c.code.toLowerCase() === value.trim().toLowerCase());
      setMatch(found ?? null);
      setResult(found ? "found" : "missing");
    },
    [pool],
  );

  useEffect(() => {
    if (initialCode.trim()) check(initialCode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCode]);

  function verify(e: React.FormEvent) {
    e.preventDefault();
    check(code);
  }

  return (
    <PublicShell>
      <section className="hero-gradient relative min-h-[70vh] overflow-hidden">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-25" />
        <div className="relative mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <Reveal className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
              <ShieldCheck className="size-3.5" /> Certificate verification
            </span>
            <h1 className="mt-6 text-3xl font-semibold text-balance sm:text-4xl">
              Verify a Unified Mentor <span className="text-gradient">certificate</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Paste the code printed on the certificate to confirm the program, grade and skills
              assessed.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-8">
            <form onSubmit={verify} className="surface-card flex flex-col gap-3 p-5 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. UM-2026-FSD-0142"
                  className="h-11 pl-9"
                />
              </div>
              <Button type="submit" className="h-11">
                Verify certificate
              </Button>
            </form>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Try a demo code: {pool.map((c) => c.code).join(" · ")}
            </p>
          </Reveal>

          {result !== "idle" && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-8"
            >
              {result === "found" && match ? (
                <div className="surface-card overflow-hidden">
                  <div className="flex items-center gap-3 border-b border-border bg-success/10 px-6 py-4">
                    <BadgeCheck className="size-5 text-success" />
                    <p className="font-semibold text-success">Verified certificate</p>
                  </div>
                  <div className="grid gap-5 p-6 sm:grid-cols-2">
                    <Field label="Program" value={match.title} />
                    <Field label="Certificate code" value={match.code} />
                    <Field label="Issued on" value={prettyDate(match.issuedOn)} />
                    <Field label="Grade" value={match.grade} />
                    <div className="sm:col-span-2">
                      <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                        Skills assessed
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {match.skills.map((s) => (
                          <span
                            key={s}
                            className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="surface-card flex items-start gap-3 p-6">
                  <ShieldAlert className="mt-0.5 size-5 shrink-0 text-destructive" />
                  <div>
                    <p className="font-semibold">No certificate found for that code</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Check for typos, or ask the candidate to re-share the code exactly as printed.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>
    </PublicShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}
