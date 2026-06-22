"use client";

import { motion } from "framer-motion";
import { CalendarClock, Gamepad2, MapPin, Tag, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const FACTS = [
  {
    icon: CalendarClock,
    label: "Lançamento",
    value: "19 de Novembro de 2026",
  },
  {
    icon: MapPin,
    label: "Cenário",
    value: "Vice City (Leonida)",
  },
  {
    icon: Users,
    label: "Protagonistas",
    value: "Jason & Lucia",
  },
  {
    icon: Gamepad2,
    label: "Plataformas",
    value: "PS5 · Xbox Series X|S · PC",
  },
];

export function GameInfo() {
  return (
    <section id="info" className="relative scroll-mt-20 py-16 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-10">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-3 border-neon-pink/40 bg-neon-pink/10 text-neon-pink">
              Sobre o jogo
            </Badge>
            <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl md:text-5xl">
              A MAIOR <span className="text-gradient-vice">EVOLUÇÃO</span> DA SÉRIE
            </h2>
            <p className="mt-4 text-sm text-foreground/75 sm:text-base">
              Grand Theft Auto VI leva você de volta ao estado ensolarado de
              Leonida, na cidade vibrante de Vice City. Pela primeira vez na
              franquia, acompanhe a história de dois protagonistas — Jason e
              Lucia — em um mundo aberto vivo, detalhado e repleto de
              possibilidades. A pré-venda oficial começa no dia 25 de junho nas
              lojas participantes, mas aqui na <span className="text-neon-pink font-semibold">XDeals</span> você garante a sua
              desde já com até <span className="text-neon-cyan font-semibold">50% de desconto</span>.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-2 sm:mt-8 sm:gap-3">
              {FACTS.map((f) => (
                <div
                  key={f.label}
                  className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-card/50 p-3 backdrop-blur sm:p-4 sm:gap-3"
                >
                  <f.icon className="mt-0.5 h-4 w-4 shrink-0 text-neon-cyan sm:h-5 sm:w-5" />
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground sm:text-[11px]">
                      {f.label}
                    </div>
                    <div className="text-xs font-semibold text-white sm:text-sm">{f.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="grid gap-4"
          >
            <div className="relative overflow-hidden rounded-2xl neon-border-cyan">
              <img
                src="/images/city-night.png"
                alt="Ocean Drive à noite com luzes neon rosa e ciano"
                className="h-48 w-full object-cover transition-transform duration-700 hover:scale-105 sm:h-64"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              <div className="absolute bottom-3 left-4 text-xs font-semibold text-white sm:text-sm">
                Vice City à noite
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl neon-border-pink">
              <img
                src="/images/car-drive.png"
                alt="Carro esporte em rodovia costeira ao pôr do sol"
                className="h-48 w-full object-cover transition-transform duration-700 hover:scale-105 sm:h-64"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              <div className="absolute bottom-3 left-4 text-xs font-semibold text-white sm:text-sm">
                Ação no entardecer
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
