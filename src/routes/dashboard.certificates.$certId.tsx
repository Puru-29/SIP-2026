import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Award, Copy, Download, Share2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { useStudentNav } from "@/components/layout/dashboard-nav";
import { Button } from "@/components/ui/button";
import { prettyDate } from "@/lib/format";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/dashboard/certificates/$certId")({
  head: () => ({
    meta: [
      { title: "Certificate — Unified Mentor" },
      {
        name: "description",
        content:
          "View, download, share and verify a Unified Mentor program certificate with its public verification code.",
      },
      { property: "og:title", content: "Certificate — Unified Mentor" },
      { property: "og:description", content: "Verified program certificate details." },
    ],
  }),
  component: CertificateDetailPage,
});

function CertificateDetailPage() {
  return (
    <DashboardShell
      allow={["student"]}
      title="Certificate"
      subtitle="Share or verify this credential"
      items={useStudentNav()}
    >
      <Inner />
    </DashboardShell>
  );
}

function Inner() {
  const { certId } = useParams({ from: "/dashboard/certificates/$certId" });
  const { certificates, user } = useApp();
  const cert = certificates.find((c) => c.id === certId);

  if (!cert) {
    return (
      <div className="surface-card p-12 text-center">
        <p className="font-display text-lg font-semibold">Certificate not found</p>
        <Button asChild className="mt-5" variant="outline">
          <Link to="/dashboard/certificates">Back to certificate vault</Link>
        </Button>
      </div>
    );
  }

  async function share() {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/verify?code=${encodeURIComponent(cert!.code)}`
        : "";
    const data = {
      title: cert!.title,
      text: `${user?.name ?? "A Unified Mentor learner"} earned ${cert!.title} (${cert!.code}).`,
      url,
    };
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(data);
        return;
      } catch {
        // user dismissed the share sheet — fall through to copy
      }
    }
    await navigator.clipboard.writeText(url);
    toast.success("Verification link copied", { description: url });
  }

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/dashboard/certificates">
          <ArrowLeft className="size-4" /> Certificate vault
        </Link>
      </Button>

      <div className="surface-card overflow-hidden">
        <div className="border-b border-border bg-gradient-to-br from-primary/18 via-transparent to-accent/15 p-8 text-center">
          <Award className="mx-auto size-10 text-primary" />
          <p className="mt-4 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Certificate of completion
          </p>
          <h2 className="mt-3 font-display text-2xl font-semibold">{cert.title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Awarded to <span className="font-medium text-foreground">{user?.name}</span> · Grade{" "}
            {cert.grade}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Issued {prettyDate(cert.issuedOn)}</p>
        </div>

        <div className="p-6">
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Skills assessed
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {cert.skills.map((s) => (
              <span
                key={s}
                className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
              >
                {s}
              </span>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-2 rounded-xl bg-surface-2 p-3">
            <ShieldCheck className="size-4 text-primary" />
            <code className="text-xs">{cert.code}</code>
            <Button
              size="icon"
              variant="ghost"
              className="ml-auto size-7"
              onClick={() => {
                void navigator.clipboard.writeText(cert.code);
                toast.success("Verification code copied");
              }}
            >
              <Copy className="size-3.5" />
            </Button>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Button onClick={() => window.print()}>
              <Download className="size-4" /> Download / print
            </Button>
            <Button variant="outline" onClick={() => void share()}>
              <Share2 className="size-4" /> Share
            </Button>
            <Button asChild variant="outline">
              <Link to="/verify" search={{ code: cert.code }}>
                <ShieldCheck className="size-4" /> Verify publicly
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
