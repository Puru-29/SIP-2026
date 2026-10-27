import { motion } from "framer-motion";
import { useState, type ReactNode } from "react";

import { CommandPalette } from "@/components/CommandPalette";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export function PublicShell({ children, bare = false }: { children: ReactNode; bare?: boolean }) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader onOpenSearch={() => setSearchOpen(true)} />
      <CommandPalette open={searchOpen} onOpenChange={setSearchOpen} />
      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 pt-16"
      >
        {children}
      </motion.main>
      {!bare && <SiteFooter />}
    </div>
  );
}
