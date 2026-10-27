import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, Copy, Download, Share2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { useStudentNav } from "@/components/layout/dashboard-nav";
import { Button } from "@/components/ui/button";
import { prettyDate } from "@/lib/format";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/dashboard/certificates/")({
  head: () => ({
    meta: [
      { title: "Certificates — Unified Mentor" },
      {
        name: "description",
        content:
          "Download and share your verified program certificates, each with a public verification code.",
      },
      { property: "og:title", content: "Certificates — Unified Mentor" },
      { property: "og:description", content: "Verified certificates with public codes." },
    ],
  }),
  component: CertificatesPage,
});

function CertificatesPage() {
  return (
    <DashboardShell
      allow={["student"]}
      title="Certificates"
      subtitle="Verified credentials you can share with recruiters"
      items={useStudentNav()}
    >
      <Inner />
    </DashboardShell>
  );
}

function Inner() {
  const { certificates, user } = useApp();

  return (
    <div className="space-y-6">
      <div className="grid gap-5 lg:grid-cols-2">
        {certificates.map((c) => (
          <div key={c.id} className="surface-card overflow-hidden">
            <div className="relative border-b border-border bg-gradient-to-br from-primary/18 via-transparent to-accent/15 p-6">
              <Award className="size-8 text-primary" />
              <h3 className="mt-3 font-display text-lg font-semibold">{c.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Awarded to {user?.name} · {c.grade}
              </p>
              <p className="mt-3 text-xs text-muted-foreground">Issued {prettyDate(c.issuedOn)}</p>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-1.5">
                {c.skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-surface-2 p-3">
                <ShieldCheck className="size-4 text-primary" />
                <code className="text-xs">{c.code}</code>
                <Button
                  size="icon"
                  variant="ghost"
                  className="ml-auto size-7"
                  onClick={() => {
                    void navigator.clipboard.writeText(c.code);
                    toast.success("Verification code copied");
                  }}
                >
                  <Copy className="size-3.5" />
                </Button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild size="sm">
                  <Link to="/dashboard/certificates/$certId" params={{ certId: c.id }}>
                    View certificate
                  </Link>
                </Button>
                <Button size="sm" variant="outline" onClick={() => window.print()}>
                  <Download className="size-4" /> Download
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    void navigator.clipboard.writeText(
                      `${window.location.origin}/verify?code=${c.code}`,
                    );
                    toast.success("Verification link copied");
                  }}
                >
                  <Share2 className="size-4" /> Share
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link to="/verify" search={{ code: c.code }}>
                    Public verify page
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
