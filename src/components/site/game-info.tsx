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
    <section id="info" className="relative scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-3 border-neon-pink/40 bg-neon-pink/10 text-neon-pink">
              Sobre o jogo
            </Badge>
            <h2 className="font-display text-4xl tracking-tight text-white sm:text-5xl">
              A MAIOR <span className="text-gradient-vice">EVOLUÇÃO</span> DA SÉRIE
            </h2>
            <p className="mt-4 text-foreground/75">
              Grand Theft Auto VI leva você de volta ao estado ensolarado de
              Leonida, na cidade vibrante de Vice City. Pela primeira vez na
              franquia, acompanhe a história de dois protagonistas — Jason e
              Lucia — em um mundo aberto vivo, detalhado e repleto de
              possibilidades. A pré-venda oficial começa no dia 25 de junho nas
              lojas participantes, mas aqui na <span className="text-neon-pink font-semibold">XDeals</span> você garante a sua
              desde já com até <span className="text-neon-cyan font-semibold">50% de desconto</span>.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3">
              {FACTS.map((f) => (
                <div
                  key={f.label}
                  className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/50 p-4 backdrop-blur"
                >
                  <f.icon className="mt-0.5 h-5 w-5 shrink-0 text-neon-cyan" />
                  <div>
                    <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
                      {f.label}
                    </div>
                    <div className="text-sm font-semibold text-white">{f.value}</div>
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
                className="h-64 w-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              <div className="absolute bottom-3 left-4 text-sm font-semibold text-white">
                Vice City à noite
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl neon-border-pink">
              <img
                src="/images/car-drive.png"
                alt="Carro esporte em rodovia costeira ao pôr do sol"
                className="h-64 w-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              <div className="absolute bottom-3 left-4 text-sm font-semibold text-white">
                Ação no entardecer
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
