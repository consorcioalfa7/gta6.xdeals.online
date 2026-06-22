"use client";

import { Flame, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCheckout } from "./checkout-store";

export function FinalCta() {
  const openCheckout = useCheckout((s) => s.openCheckout);
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="absolute inset-0 -z-10">
        <img
          src="/images/character.png"
          alt="Personagem estilizado contra o pôr do sol de Vice City"
          className="h-full w-full object-cover object-top opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/60" />
      </div>
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="font-display text-4xl leading-tight tracking-tight text-white sm:text-6xl">
          NÃO PERCA A <span className="text-gradient-vice">PRÉ-VENDA</span>
          <br />
          MAIS BARATA DO BRASIL
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-foreground/75">
          Restam poucas vagas no lote promocional de 50 unidades. Garanta a sua
          por apenas R$ 199,90 antes que acabe.
        </p>
        <div className="mt-8 flex justify-center">
          <Button
            size="lg"
            onClick={() => openCheckout("early_bird")}
            className="gradient-vice text-white glow-pink hover:opacity-90"
          >
            <Flame className="mr-2 h-5 w-5" />
            Quero garantir por R$ 199,90
          </Button>
        </div>
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Zap className="h-3.5 w-3.5 text-neon-cyan" />
          Confirmação via PIX em segundos
        </div>
      </div>
    </section>
  );
}
