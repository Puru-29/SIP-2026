import {
  Award,
  Bookmark,
  Bell,
  BriefcaseBusiness,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  UserRound,
  Users,
} from "lucide-react";

import type { NavGroupItem } from "@/components/layout/DashboardShell";
import { useApp } from "@/lib/store";

/** Live student sidebar: badges reflect the signed-in learner's own records. */
export function useStudentNav(): NavGroupItem[] {
  const { applications, projects, unreadCount, saved } = useApp();
  return studentNav({
    applications: applications.length,
    projects: projects.filter((p) => p.stage !== "Completed").length,
    notifications: unreadCount,
    saved: saved.length,
  });
}

export function studentNav(counts: {
  applications: number;
  projects: number;
  notifications?: number;
  saved?: number;
}): NavGroupItem[] {
  return [
    { label: "Overview", to: "/dashboard", icon: <LayoutDashboard /> },
    { label: "My Learning", to: "/dashboard/learning", icon: <GraduationCap /> },
    {
      label: "Projects",
      to: "/dashboard/projects",
      icon: <FolderKanban />,
      badge: counts.projects,
    },
    {
      label: "Applications",
      to: "/dashboard/applications",
      icon: <BriefcaseBusiness />,
      badge: counts.applications,
    },
    { label: "Mentorship", to: "/dashboard/mentorship", icon: <Users /> },
    {
      label: "Saved",
      to: "/dashboard/saved",
      icon: <Bookmark />,
      ...(counts.saved ? { badge: counts.saved } : {}),
    },
    { label: "Certificates", to: "/dashboard/certificates", icon: <Award /> },
    {
      label: "Notifications",
      to: "/dashboard/notifications",
      icon: <Bell />,
      ...(counts.notifications ? { badge: counts.notifications } : {}),
    },
    { label: "Profile", to: "/dashboard/profile", icon: <UserRound /> },
  ];
}
