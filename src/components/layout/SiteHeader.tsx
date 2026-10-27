import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import {
  Bell,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Route as RouteIcon,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
  User as UserIcon,
  X,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

const megaMenus: Record<
  string,
  { title: string; items: { label: string; to: string; desc: string; icon: typeof Sparkles }[] }
> = {
  Programs: {
    title: "Career tracks built with hiring partners",
    items: [
      {
        label: "All Programs",
        to: "/programs",
        desc: "10 tracks across engineering, data, design and growth",
        icon: GraduationCap,
      },
      {
        label: "Internships",
        to: "/internships",
        desc: "Paid and fellowship placements with real teams",
        icon: BriefcaseBusiness,
      },
      {
        label: "Mentorship",
        to: "/mentors",
        desc: "1:1 sessions with practitioners from top product teams",
        icon: Sparkles,
      },
      {
        label: "Certifications",
        to: "/verify",
        desc: "Verify any Unified Mentor certificate instantly",
        icon: ShieldCheck,
      },
    ],
  },
  "Career Tools": {
    title: "One connected career operating system",
    items: [
      {
        label: "ATS Resume Checker",
        to: "/career-tools/ats-checker",
        desc: "Score your resume against real ATS parsing rules",
        icon: ShieldCheck,
      },
      {
        label: "Resume Builder",
        to: "/career-tools/resume-builder",
        desc: "Four templates, live preview, instant export",
        icon: FileText,
      },
      {
        label: "Career Path Finder",
        to: "/career-tools/career-path",
        desc: "Get a personalised roadmap in six questions",
        icon: RouteIcon,
      },
      {
        label: "Job Match",
        to: "/career-tools/job-match",
        desc: "See which roles fit you and exactly why",
        icon: Target,
      },
    ],
  },
  Resources: {
    title: "Guides, playbooks and success stories",
    items: [
      {
        label: "Resource Library",
        to: "/resources",
        desc: "Interview kits, project briefs and salary data",
        icon: FileText,
      },
      {
        label: "Success Stories",
        to: "/resources",
        desc: "Where our learners landed and how they did it",
        icon: Sparkles,
      },
      {
        label: "Hiring Partners",
        to: "/resources",
        desc: "150+ companies hiring from the platform",
        icon: BriefcaseBusiness,
      },
      {
        label: "Certificate Verification",
        to: "/verify",
        desc: "Public verification for employers",
        icon: ShieldCheck,
      },
    ],
  },
};

const simpleLinks = [
  { label: "Home", to: "/" },
  { label: "Courses", to: "/courses" },
  { label: "Internships", to: "/internships" },
  { label: "Jobs", to: "/jobs" },
];

export function SiteHeader({ onOpenSearch }: { onOpenSearch: () => void }) {
  const {
    user,
    logout,
    theme,
    toggleTheme,
    notifications,
    unreadCount,
    markAllRead,
    markNotificationRead,
  } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 12));

  const dashboardHref =
    user?.role === "admin"
      ? "/admin"
      : user?.role === "mentor"
        ? "/mentor"
        : user?.role === "recruiter"
          ? "/recruiter"
          : "/dashboard";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "glass shadow-soft" : "border-b border-transparent bg-transparent",
      )}
      onMouseLeave={() => setOpenMenu(null)}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex shrink-0 items-center gap-2.5">
          <span className="relative grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-glow">
            <GraduationCap className="size-5" />
          </span>
          <span className="font-display text-lg leading-none font-semibold">
            Unified<span className="text-primary">Mentor</span>
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-0.5 lg:flex">
          {simpleLinks.slice(0, 1).map((l) => (
            <NavItem key={l.to} to={l.to} label={l.label} active={pathname === l.to} />
          ))}
          {Object.keys(megaMenus).map((key) => (
            <button
              key={key}
              onMouseEnter={() => setOpenMenu(key)}
              onClick={() => setOpenMenu((m) => (m === key ? null : key))}
              className={cn(
                "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground",
                openMenu === key && "bg-surface-2 text-foreground",
              )}
            >
              {key}
              <ChevronDown
                className={cn("size-3.5 transition-transform", openMenu === key && "rotate-180")}
              />
            </button>
          ))}
          {simpleLinks.slice(1).map((l) => (
            <NavItem
              key={l.to}
              to={l.to}
              label={l.label}
              active={pathname.startsWith(l.to) && l.to !== "/"}
            />
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenSearch}
            className="hidden items-center gap-2 rounded-lg border border-border bg-surface/70 text-muted-foreground sm:flex"
          >
            <Search className="size-4" />
            <span className="hidden text-xs md:inline">Search</span>
            <kbd className="hidden rounded border border-border bg-background px-1.5 py-0.5 text-[10px] md:inline">
              ⌘K
            </kbd>
          </Button>
          <Button variant="ghost" size="icon" onClick={onOpenSearch} className="sm:hidden">
            <Search className="size-4" />
          </Button>

          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                <Bell className="size-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 grid size-4 place-items-center rounded-full bg-accent text-[9px] font-bold text-accent-foreground">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0">
              <div className="flex items-center justify-between border-b border-border px-3 py-2">
                <span className="text-sm font-semibold">Notifications</span>
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <Check className="size-3" /> Mark all read
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.slice(0, 6).map((n) => (
                  <button
                    key={n.id}
                    onClick={() => {
                      markNotificationRead(n.id);
                      if (n.href) navigate({ to: n.href });
                    }}
                    className={cn(
                      "flex w-full gap-3 border-b border-border/60 px-3 py-2.5 text-left transition-colors hover:bg-surface-2",
                      !n.read && "bg-primary/5",
                    )}
                  >
                    <span className="text-base">{n.icon}</span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{n.title}</span>
                      <span className="block truncate text-xs text-muted-foreground">{n.body}</span>
                      <span className="text-[10px] text-muted-foreground">{n.time}</span>
                    </span>
                  </button>
                ))}
              </div>
              <Link
                to="/dashboard/notifications"
                className="block px-3 py-2 text-center text-xs font-medium text-primary hover:underline"
              >
                View notification center
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="ml-1 flex items-center gap-2 rounded-full border border-border bg-surface px-1 py-1 pr-2.5 transition-colors hover:bg-surface-2">
                  <span className="grid size-7 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {user.avatar}
                  </span>
                  <span className="hidden text-xs font-medium sm:inline">
                    {user.name.split(" ")[0]}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="text-xs">
                  <div className="font-semibold">{user.name}</div>
                  <div className="font-normal text-muted-foreground capitalize">{user.role}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate({ to: dashboardHref })}>
                  <LayoutDashboard className="size-4" /> Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: "/dashboard/profile" })}>
                  <UserIcon className="size-4" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: "/career-tools" })}>
                  <Target className="size-4" /> Career tools
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    logout();
                    navigate({ to: "/" });
                  }}
                >
                  <LogOut className="size-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button asChild variant="ghost" size="sm">
                <Link to="/auth" search={{ mode: "login" }}>
                  Login
                </Link>
              </Button>
              <Button asChild size="sm" className="shadow-glow">
                <Link to="/auth" search={{ mode: "register" }}>
                  Get Started
                </Link>
              </Button>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {openMenu && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="hidden lg:block"
          >
            <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
              <div className="glass rounded-2xl p-5 shadow-elevated">
                <p className="mb-4 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  {megaMenus[openMenu]?.title}
                </p>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                  {(megaMenus[openMenu]?.items ?? []).map((item) => (
                    <Link
                      key={item.label + item.to}
                      to={item.to}
                      onClick={() => setOpenMenu(null)}
                      className="group rounded-xl border border-transparent p-3 transition-all hover:border-border hover:bg-surface-2"
                    >
                      <span className="mb-2 grid size-9 place-items-center rounded-lg bg-primary/12 text-primary transition-transform group-hover:scale-105">
                        <item.icon className="size-4.5" />
                      </span>
                      <span className="block text-sm font-semibold">{item.label}</span>
                      <span className="mt-1 block text-xs leading-snug text-muted-foreground">
                        {item.desc}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border bg-background lg:hidden"
          >
            <div className="max-h-[75vh] space-y-4 overflow-y-auto px-4 py-4">
              <div className="grid grid-cols-2 gap-2">
                {simpleLinks.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl border border-border bg-surface px-3 py-2.5 text-sm font-medium"
                  >
                    {l.label}
                  </Link>
                ))}
                <Link
                  to="/programs"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl border border-border bg-surface px-3 py-2.5 text-sm font-medium"
                >
                  Programs
                </Link>
                <Link
                  to="/career-tools"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl border border-border bg-surface px-3 py-2.5 text-sm font-medium"
                >
                  Career Tools
                </Link>
              </div>
              {Object.entries(megaMenus).map(([key, menu]) => (
                <div key={key}>
                  <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    {key}
                  </p>
                  <div className="space-y-1">
                    {menu.items.map((item) => (
                      <Link
                        key={item.label + item.to}
                        to={item.to}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm hover:bg-surface-2"
                      >
                        <item.icon className="size-4 text-primary" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              {user ? (
                <Button asChild className="w-full">
                  <Link to={dashboardHref} onClick={() => setMobileOpen(false)}>
                    Go to dashboard
                  </Link>
                </Button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Button asChild variant="outline">
                    <Link
                      to="/auth"
                      search={{ mode: "login" }}
                      onClick={() => setMobileOpen(false)}
                    >
                      Login
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link
                      to="/auth"
                      search={{ mode: "register" }}
                      onClick={() => setMobileOpen(false)}
                    >
                      Get Started
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function NavItem({ to, label, active }: { to: string; label: string; active?: boolean }) {
  return (
    <Link
      to={to}
      className={cn(
        "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-surface-2 hover:text-foreground",
        active ? "text-foreground" : "text-muted-foreground",
      )}
    >
      {label}
    </Link>
  );
}
