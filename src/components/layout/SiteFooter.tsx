import { Link } from "@tanstack/react-router";
import { GraduationCap, Linkedin, Twitter } from "lucide-react";

import { socialLinks } from "@/lib/site";

const columns = [
  {
    title: "Learn",
    links: [
      { label: "Programs", to: "/programs" },
      { label: "Courses", to: "/courses" },
      { label: "Mentorship", to: "/mentors" },
      { label: "Resources", to: "/resources" },
    ],
  },
  {
    title: "Experience",
    links: [
      { label: "Internships", to: "/internships" },
      { label: "Projects", to: "/dashboard/projects" },
      { label: "Certificates", to: "/dashboard/certificates" },
      { label: "Verify a certificate", to: "/verify" },
    ],
  },
  {
    title: "Career",
    links: [
      { label: "Job portal", to: "/jobs" },
      { label: "Resume builder", to: "/career-tools/resume-builder" },
      { label: "ATS checker", to: "/career-tools/ats-checker" },
      { label: "Career path finder", to: "/career-tools/career-path" },
    ],
  },
  {
    title: "Platform",
    links: [
      { label: "Student dashboard", to: "/dashboard" },
      { label: "Admin console", to: "/admin" },
      { label: "Mentor workspace", to: "/mentor" },
      { label: "Recruiter suite", to: "/recruiter" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
                <GraduationCap className="size-5" />
              </span>
              <span className="font-display text-lg font-semibold">Unified Mentor</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Learn. Build. Get Hired. One platform for structured learning, real-world experience
              and the career tools that turn skills into offers.
            </p>
            <div className="mt-5 flex gap-2">
              <a
                href={socialLinks.x}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Unified Mentor on X"
                title="Unified Mentor on X"
                className="grid size-9 cursor-pointer place-items-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:text-primary"
              >
                <Twitter className="size-4" />
              </a>
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Unified Mentor on LinkedIn"
                title="Unified Mentor on LinkedIn"
                className="grid size-9 cursor-pointer place-items-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:text-primary"
              >
                <Linkedin className="size-4" />
              </a>
            </div>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-semibold">{col.title}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Unified Mentor — an academic redesign prototype.</p>
          <p>Built with React, TanStack Start, Tailwind CSS and Framer Motion.</p>
        </div>
      </div>
    </footer>
  );
}
