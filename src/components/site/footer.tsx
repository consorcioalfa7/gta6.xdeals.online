"use client";

import { ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-card/40 backdrop-blur safe-bottom">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <img src="/icon.svg" alt="" aria-hidden="true" className="h-8 w-8" />
            <span className="font-display text-base tracking-wider text-white sm:text-lg">
              X<span className="text-neon-pink">DEALS</span>
            </span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground sm:text-sm">
            <a href="#trailer" className="hover:text-neon-cyan">Trailer</a>
            <a href="#info" className="hover:text-neon-cyan">Sobre o jogo</a>
            <a href="#precos" className="hover:text-neon-cyan">Preços</a>
            <a href="#faq" className="hover:text-neon-cyan">FAQ</a>
          </nav>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-neon-cyan" />
            Pagamento seguro via PIX · MisticPay
          </div>
        </div>

        <div className="mt-6 border-t border-border/40 pt-6 text-center text-[11px] text-muted-foreground sm:text-xs">
          <p>
            XDeals é uma loja independente de revenda de jogos. Grand Theft Auto
            e GTA são marcas registradas da Rockstar Games / Take-Two
            Interactive. Este site não é afiliado nem patrocinado pela Rockstar
            Games.
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} XDeals · gta6.xdeals.online · Todos os
            direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
