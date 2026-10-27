import { useNavigate } from "@tanstack/react-router";
import {
  BriefcaseBusiness,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Route as RouteIcon,
  Search,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";
import { useEffect } from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { courses } from "@/data/courses";
import { internships, jobs, mentors } from "@/data/opportunities";
import { programs } from "@/data/programs";

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onOpenChange]);

  const go = (to: string) => {
    onOpenChange(false);
    navigate({ to });
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search programs, jobs, internships, mentors…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Quick actions">
          <CommandItem value="search everything" onSelect={() => go("/search")}>
            <Search /> Open full search page
          </CommandItem>
          <CommandItem onSelect={() => go("/dashboard")}>
            <LayoutDashboard /> Open student dashboard
          </CommandItem>
          <CommandItem onSelect={() => go("/career-tools/ats-checker")}>
            <ShieldCheck /> Check my ATS score
          </CommandItem>
          <CommandItem onSelect={() => go("/career-tools/resume-builder")}>
            <FileText /> Build my resume
          </CommandItem>
          <CommandItem onSelect={() => go("/career-tools/career-path")}>
            <RouteIcon /> Find my career path
          </CommandItem>
          <CommandItem onSelect={() => go("/career-tools/job-match")}>
            <Target /> See jobs matched for me
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Courses">
          {courses.map((c) => (
            <CommandItem
              key={c.id}
              value={`${c.title} ${c.category} ${c.skills.join(" ")}`}
              onSelect={() => go(`/courses/${c.id}`)}
            >
              <GraduationCap /> {c.title}
              <span className="ml-auto text-xs text-muted-foreground">{c.category}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Programs">
          {programs.map((p) => (
            <CommandItem
              key={p.id}
              value={`${p.title} ${p.category} ${p.skills.join(" ")}`}
              onSelect={() => go(`/programs/${p.slug}`)}
            >
              <GraduationCap /> {p.title}
              <span className="ml-auto text-xs text-muted-foreground">{p.category}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Jobs">
          {jobs.map((j) => (
            <CommandItem
              key={j.id}
              value={`${j.title} ${j.company} ${j.skills.join(" ")}`}
              onSelect={() => go(`/jobs/${j.id}`)}
            >
              <BriefcaseBusiness /> {j.title}
              <span className="ml-auto text-xs text-muted-foreground">{j.company}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Internships">
          {internships.map((i) => (
            <CommandItem
              key={i.id}
              value={`${i.title} ${i.company} ${i.skills.join(" ")}`}
              onSelect={() => go(`/internships/${i.id}`)}
            >
              <BriefcaseBusiness /> {i.title}
              <span className="ml-auto text-xs text-muted-foreground">{i.company}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Mentors">
          {mentors.map((m) => (
            <CommandItem
              key={m.id}
              value={`${m.name} ${m.expertise.join(" ")}`}
              onSelect={() => go(`/mentors/${m.id}`)}
            >
              <Users /> {m.name}
              <span className="ml-auto text-xs text-muted-foreground">{m.expertise[0]}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
