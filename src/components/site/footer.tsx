"use client";

import { Zap, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-card/40 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg gradient-vice">
              <Zap className="h-4 w-4 text-white" fill="currentColor" />
            </span>
            <span className="font-display text-lg tracking-wider text-white">
              X<span className="text-neon-pink">DEALS</span>
            </span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
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

        <div className="mt-8 border-t border-border/40 pt-6 text-center text-xs text-muted-foreground">
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
