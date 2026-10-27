import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { CommandPalette } from "@/components/CommandPalette";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Role } from "@/types";

export interface NavGroupItem {
  label: string;
  to: string;
  icon: ReactNode;
  badge?: number;
}

export function DashboardShell({
  items,
  title,
  subtitle,
  children,
  allow,
}: {
  items: NavGroupItem[];
  title: string;
  subtitle?: string;
  children: ReactNode;
  allow: Role[];
}) {
  const { user, hydrated, loading } = useApp();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate({
        to: "/auth",
        search: { mode: "login", redirect: pathname },
        replace: true,
      });
    }
  }, [loading, user, navigate, pathname]);

  if (!hydrated || loading) {
    return (
      <div className="min-h-screen pt-24">
        <div className="mx-auto max-w-6xl space-y-4 px-4">
          <div className="h-8 w-52 animate-pulse rounded-lg bg-surface-2" />
          <div className="grid gap-4 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-2xl bg-surface-2" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  if (!allow.includes(user.role)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="font-display text-2xl font-semibold">This workspace isn't for your role</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          You're signed in as <span className="font-medium capitalize">{user.role}</span>. This area
          is restricted to {allow.join(", ")} accounts.
        </p>
        <Button onClick={() => navigate({ to: "/" })}>Back to home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SiteHeader onOpenSearch={() => setSearchOpen(true)} />
      <CommandPalette open={searchOpen} onOpenChange={setSearchOpen} />
      <div className="mx-auto flex max-w-[1600px] gap-6 px-4 pt-20 pb-14 sm:px-6 lg:px-8">
        <aside className="sticky top-20 hidden h-[calc(100vh-6.5rem)] w-60 shrink-0 flex-col lg:flex">
          <div className="surface-card flex-1 overflow-y-auto p-3">
            <p className="px-2 pt-1 pb-3 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              {title}
            </p>
            <nav className="space-y-0.5">
              {items.map((item) => (
                <SidebarLink key={item.to} item={item} active={pathname === item.to} />
              ))}
            </nav>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-5 flex items-center gap-3 lg:hidden">
            <Button variant="outline" size="sm" onClick={() => setMobileNav(true)}>
              <Menu className="size-4" /> {title}
            </Button>
          </div>
          {subtitle && <p className="sr-only">{subtitle}</p>}
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {mobileNav && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 bg-background/70 backdrop-blur lg:hidden"
            onClick={() => setMobileNav(false)}
          >
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="h-full w-72 border-r border-border bg-card p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="font-display font-semibold">{title}</span>
                <Button variant="ghost" size="icon" onClick={() => setMobileNav(false)}>
                  <X className="size-4" />
                </Button>
              </div>
              <nav className="space-y-0.5">
                {items.map((item) => (
                  <div key={item.to} onClick={() => setMobileNav(false)}>
                    <SidebarLink item={item} active={pathname === item.to} />
                  </div>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SidebarLink({ item, active }: { item: NavGroupItem; active: boolean }) {
  return (
    <Link
      to={item.to}
      className={cn(
        "relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-primary/12 text-primary"
          : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
      )}
    >
      <span className="grid size-5 place-items-center [&_svg]:size-4">{item.icon}</span>
      <span className="truncate">{item.label}</span>
      {item.badge ? (
        <span className="ml-auto rounded-full bg-accent px-1.5 text-[10px] font-bold text-accent-foreground">
          {item.badge}
        </span>
      ) : null}
      {active && (
        <motion.span
          layoutId="sidebar-active"
          className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-primary"
        />
      )}
    </Link>
  );
}
