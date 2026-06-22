"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Flame, Loader2, Sparkles, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PRICING_TIERS, EARLY_BIRD_LIMIT } from "@/lib/pricing";
import { useCheckout } from "./checkout-store";

interface Stats {
  earlyBirdTaken: number;
  earlyBirdRemaining: number;
  earlyBirdLimit: number;
  totalPaid: number;
}

export function Pricing() {
  const openCheckout = useCheckout((s) => s.openCheckout);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    let active = true;
    const load = () =>
      fetch("/api/stats")
        .then((r) => r.json())
        .then((d) => active && setStats(d))
        .catch(() => {});
    load();
    const id = setInterval(load, 15000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  const taken = stats?.earlyBirdTaken ?? 0;
  const remaining = stats?.earlyBirdRemaining ?? EARLY_BIRD_LIMIT;
  const progressPct = Math.min(100, (taken / EARLY_BIRD_LIMIT) * 100);

  return (
    <section id="precos" className="relative scroll-mt-20 py-20 sm:py-28">
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-neon-pink/10 blur-3xl" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <Badge className="mb-3 border-neon-orange/40 bg-neon-orange/10 text-neon-orange">
            <Sparkles className="mr-1 h-3 w-3" /> Oferta de lançamento
          </Badge>
          <h2 className="font-display text-4xl tracking-tight text-white sm:text-5xl md:text-6xl">
            ESCOLHA SEU <span className="text-gradient-vice">PLANO</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-foreground/70">
            Pagamento único via PIX. Confirmação automática e instantânea.
          </p>
        </motion.div>

        {/* Early bird urgency bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-10 max-w-3xl rounded-2xl border border-neon-pink/40 bg-card/60 p-5 backdrop-blur"
        >
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 font-semibold text-neon-pink">
              <Timer className="h-4 w-4" /> Vagas XDeals (50 primeiros)
            </span>
            <span className="text-muted-foreground">
              <strong className="text-white">{remaining}</strong> restantes de{" "}
              {EARLY_BIRD_LIMIT}
            </span>
          </div>
          <Progress value={progressPct} className="h-2.5 bg-muted" />
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {PRICING_TIERS.map((tier, i) => {
            const soldOut =
              tier.id === "early_bird" && remaining <= 0;
            const discount =
              tier.originalBRL && tier.priceBRL
                ? Math.round(
                    ((tier.originalBRL - tier.priceBRL) / tier.originalBRL) * 100
                  )
                : 0;
            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                className={`relative flex flex-col rounded-3xl p-7 backdrop-blur transition-all ${
                  tier.highlight
                    ? "neon-border-pink bg-card/70 glow-pink"
                    : "border border-border/60 bg-card/50"
                }`}
              >
                {tier.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="gradient-vice px-4 py-1 text-xs font-bold uppercase tracking-wider text-white">
                      <Flame className="mr-1 h-3 w-3" /> Mais procurado
                    </Badge>
                  </div>
                )}

                <div className="mb-1 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  {tier.label}
                </div>

                <div className="mt-3 flex items-end gap-2">
                  <span className="font-display text-5xl text-white sm:text-6xl">
                    R$ {tier.priceBRL.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <span>≈ US$ {tier.priceUSD}</span>
                  {tier.originalBRL && (
                    <span className="inline-flex items-center gap-1">
                      · de{" "}
                      <span className="line-through">
                        R$ {tier.originalBRL.toLocaleString("pt-BR")}
                      </span>
                      <Badge className="bg-neon-pink/20 text-neon-pink">
                        -{discount}%
                      </Badge>
                    </span>
                  )}
                </div>

                <ul className="mt-6 flex-1 space-y-3">
                  {tier.perks.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-sm">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neon-cyan/15">
                        <Check className="h-3 w-3 text-neon-cyan" />
                      </span>
                      <span className="text-foreground/85">{p}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  size="lg"
                  disabled={soldOut}
                  onClick={() => openCheckout(tier.id)}
                  className={`mt-7 w-full ${
                    tier.highlight
                      ? "gradient-vice text-white glow-pink hover:opacity-90"
                      : "border border-neon-cyan/50 bg-transparent text-neon-cyan hover:bg-neon-cyan/10"
                  } ${soldOut ? "opacity-50" : ""}`}
                  variant={tier.highlight ? "default" : "outline"}
                >
                  {soldOut ? (
                    "Esgotado"
                  ) : stats === null ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Carregando
                    </>
                  ) : (
                    <>Reservar agora</>
                  )}
                </Button>
              </motion.div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Preços em Reais convertidos a título informativo. A cobrança no
          checkout é sempre em BRL via PIX.
        </p>
      </div>
    </section>
  );
}
