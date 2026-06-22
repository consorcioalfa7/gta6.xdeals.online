"use client";

import { motion } from "framer-motion";
import { ChevronDown, Flame, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Countdown } from "./countdown";
import { useCheckout } from "./checkout-store";
import { RELEASE_DATE } from "@/lib/pricing";

export function Hero() {
  const openCheckout = useCheckout((s) => s.openCheckout);

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-20 safe-top"
    >
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/images/hero-bg.png"
          alt="Cenário de pôr do sol estilo Vice City com palmeiras e neon"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/40" />
        <div className="grid-overlay animate-grid-pan absolute inset-0 opacity-60" />
        <div className="scanlines absolute inset-0 opacity-30" />
      </div>

      {/* Floating neon orbs */}
      <div className="pointer-events-none absolute -left-20 top-1/3 h-72 w-72 rounded-full bg-neon-pink/20 blur-3xl animate-float-slow" />
      <div className="pointer-events-none absolute -right-20 top-1/4 h-80 w-80 rounded-full bg-neon-cyan/20 blur-3xl animate-float-slow" style={{ animationDelay: "1.5s" }} />

      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-neon-pink/40 bg-card/60 px-4 py-1.5 backdrop-blur"
          >
            <Flame className="h-4 w-4 text-neon-orange" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-neon-pink">
              Pré-venda exclusiva XDeals
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="font-display text-5xl leading-[0.95] tracking-tight text-white sm:text-7xl md:text-8xl"
          >
            GRAND THEFT
            <br />
            <span className="text-gradient-vice">AUTO VI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-4 max-w-xl text-sm text-foreground/80 sm:text-base md:text-lg"
          >
            De volta a Vice City. Reserve sua cópia antes de todo mundo na
            pré-venda XDeals e garanta o maior jogo da década no lançamento —
            <span className="font-semibold text-neon-cyan"> 19 de novembro de 2026</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-8"
          >
            <Countdown targetIso={RELEASE_DATE} label="Lançamento mundial" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center"
          >
            <Button
              onClick={() => openCheckout("early_bird")}
              size="lg"
              className="gradient-vice w-full text-white glow-pink hover:opacity-90 sm:w-auto"
            >
              <Flame className="mr-2 h-5 w-5" />
              Garantir por R$ 199,90
            </Button>
            <a href="#trailer" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/10"
              >
                Ver trailer
              </Button>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-5 flex flex-col gap-2 text-xs text-muted-foreground sm:mt-6 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
          >
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-neon-cyan" />
              Pagamento via PIX com confirmação instantânea
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon-pink" />
              Vagas limitadas — primeiros 50 membros
            </span>
          </motion.div>
        </div>
      </div>

      <a
        href="#trailer"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground transition-colors hover:text-neon-cyan"
        aria-label="Rolar para baixo"
      >
        <ChevronDown className="h-6 w-6 animate-bounce" />
      </a>
    </section>
  );
}
