"use client";

import { motion } from "framer-motion";
import { ExternalLink, Newspaper, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const TRAILER_VIDEO_ID = "cv041_93_0Q";

const NEWS = [
  {
    source: "TecMundo / Voxel",
    title: "A que horas começa a pré-venda de GTA 6? Veja data e horário",
    url: "https://www.tecmundo.com.br/voxel/504644-que-horas-comeca-a-pre-venda-de-gta-6-veja-data-e-horario.htm",
    tag: "Data & Horário",
  },
  {
    source: "Times Brasil",
    title: "GTA VI entra em pré-venda no Brasil esta semana — veja estimativa de preço e data de lançamento",
    url: "https://timesbrasil.com.br/videos/entretenimento-videos/gta-vi-entra-em-pre-venda-no-brasil-esta-semana-veja-estimativa-de-preco-e-data-de-lancamento/",
    tag: "Preço & Brasil",
  },
  {
    source: "G1 / Globo",
    title: "GTA 6 ganha data de pré-venda e capa oficial — veja",
    url: "https://g1.globo.com/pop-arte/games/noticia/2026/06/18/gta-6-ganha-data-de-pre-venda-e-capa-oficial-veja.ghtml",
    tag: "Capa Oficial",
  },
];

export function TrailerSection() {
  return (
    <section id="trailer" className="relative scroll-mt-20 py-16 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center sm:mb-10"
        >
          <Badge className="mb-3 border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan">
            Trailer oficial
          </Badge>
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            BEM-VINDO A <span className="text-gradient-vice">VICE CITY</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-foreground/70 sm:text-base">
            Assista ao trailer e sinta o clima da maior pré-venda do ano.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="group relative mx-auto max-w-4xl overflow-hidden rounded-2xl neon-border-pink"
        >
          <div className="relative aspect-video w-full bg-black">
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube.com/embed/${TRAILER_VIDEO_ID}?rel=0&modestbranding=1`}
              title="Trailer oficial de GTA VI"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5" />
        </motion.div>

        {/* News links */}
        <div className="mt-10 sm:mt-14">
          <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground sm:mb-5 sm:text-sm sm:tracking-[0.25em]">
            <Newspaper className="h-4 w-4 text-neon-cyan" />
            Na imprensa
          </div>
          <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
            {NEWS.map((n, i) => (
              <motion.a
                key={n.url}
                href={n.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative flex flex-col justify-between rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur transition-all hover:-translate-y-1 hover:border-neon-cyan/50 hover:glow-cyan sm:p-5"
              >
                <div>
                  <div className="mb-2 flex items-center justify-between gap-2 sm:mb-3">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-neon-pink sm:text-xs">
                      {n.source}
                    </span>
                    <Badge variant="outline" className="border-neon-cyan/30 text-neon-cyan text-[10px] sm:text-xs">
                      {n.tag}
                    </Badge>
                  </div>
                  <h3 className="text-xs font-medium leading-snug text-foreground/90 group-hover:text-white sm:text-sm">
                    {n.title}
                  </h3>
                </div>
                <div className="mt-3 flex items-center gap-1 text-[11px] text-muted-foreground group-hover:text-neon-cyan sm:mt-4 sm:text-xs">
                  Ler matéria
                  <ExternalLink className="ml-1 h-3 w-3" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
