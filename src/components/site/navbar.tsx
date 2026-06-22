"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCheckout } from "./checkout-store";

const LINKS = [
  { href: "#trailer", label: "Trailer" },
  { href: "#info", label: "Sobre o Jogo" },
  { href: "#precos", label: "Preços" },
  { href: "#faq", label: "FAQ" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const openCheckout = useCheckout((s) => s.openCheckout);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 safe-top ${
        scrolled ? "glass border-b border-border/60" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6 sm:py-3">
        <a href="#top" className="group flex items-center gap-2" aria-label="XDeals GTA VI — início">
          <img
            src="/icon.svg"
            alt=""
            aria-hidden="true"
            className="h-9 w-9 sm:h-10 sm:w-10"
          />
          <span className="font-display text-lg tracking-wider text-white sm:text-xl">
            X<span className="text-neon-pink">DEALS</span>
          </span>
          <span className="ml-1 hidden text-[10px] uppercase tracking-[0.25em] text-muted-foreground sm:inline">
            | GTA VI
          </span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-neon-cyan"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => openCheckout("early_bird")}
            className="hidden gradient-vice text-white glow-pink hover:opacity-90 sm:inline-flex"
          >
            Comprar agora
          </Button>
          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border/60 text-foreground md:hidden"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass border-b border-border/60 md:hidden"
        >
          <div className="flex flex-col gap-1 px-4 py-3 safe-bottom">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-sm font-medium text-foreground/90 hover:bg-accent/10 hover:text-neon-cyan"
              >
                {l.label}
              </a>
            ))}
            <Button
              onClick={() => {
                setOpen(false);
                openCheckout("early_bird");
              }}
              className="mt-2 gradient-vice text-white"
            >
              Comprar agora
            </Button>
          </div>
        </motion.div>
      )}
    </header>
  );
}
