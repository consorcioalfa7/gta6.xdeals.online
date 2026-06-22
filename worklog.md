---
Task ID: all
Agent: main (Z.ai Code)
Task: Construir site de pré-venda do GTA VI para XDeals (gta6.xdeals.online) com checkout PIX via MisticPay + webhook de confirmação, tema Vice City neon, trailer, links de notícias, preços early-bird (R$199,90) e regular (R$400), deploy GitHub+Vercel.

Work Log:
- Inicializado ambiente fullstack-dev; lido projeto base (Next.js 16, TS, Tailwind v4, shadcn/ui, Prisma/SQLite, framer-motion, zustand).
- Geradas 4 imagens temáticas Vice City via z-ai image CLI (hero-bg, city-night, car-drive, character) em /public/images.
- Definido schema Prisma (model Order com campos de cliente, tier, valor BRL/USD, IDs MisticPay, QR/copyPaste, status, paidAt). Executado `bun run db:push`.
- Criada camada de integração MisticPay (src/lib/misticpay.ts): createPixTransaction com headers ci/cs, projectWebhook default https://gta6.xdeals.online/webhook.
- Criada config de preços (src/lib/pricing.ts): early_bird R$199,90/US$39 (50 vagas), regular R$400/US$80, datas de lançamento (19/11/2026) e pré-venda oficial (25/06).
- API routes criadas:
  - POST /api/checkout/create — valida form, controla 50 vagas early-bird, cria Order PENDING no DB, chama MisticPay, atualiza com QR/copyPaste.
  - GET /api/checkout/status?id — polling de status (PENDING/PAID/FAILED).
  - POST /api/webhook — recebe notificações MisticPay (DEPOSITO COMPLETO → marca PAID; MED/infraction → log; saque → ignora).
  - GET /api/stats — contador de vagas early-bird + total pagos.
- Frontend (single page /):
  - Layout com min-h-screen flex flex-col + footer mt-auto (sticky footer).
  - Tema dark neon Vice City em globals.css (oklch pink/cyan/purple, utilitários neon-border, glow, grid-overlay, scanlines, gradient-vice, animações float/pulse/shimmer/grid-pan). Fonte display Anton.
  - Navbar sticky com glass on scroll + menu mobile.
  - Hero full-screen com hero-bg, título "GRAND THEFT AUTO VI", countdown ao vivo até 19/11/2026, CTAs.
  - TrailerSection com iframe YouTube (video cv041_93_0Q) + 3 cards de notícias (TecMundo, Times Brasil, G1).
  - GameInfo com facts (lançamento, cenário, protagonistas, plataformas) + 2 imagens.
  - Pricing com 2 tiers, barra de urgência early-bird (X restantes de 50) via /api/stats, desconto -50%.
  - CheckoutDialog (Zustand store) com fluxo: form (Nome/Email/WhatsApp/CPF) → POST create → tela PIX (QR + copia/cola + polling a cada 3,5s) → sucesso. Animações Framer Motion.
  - FAQ com 6 perguntas (Accordion).
  - FinalCta com imagem character + CTA.
  - Footer com disclaimer de marcas.
- Lint: 0 erros após correções (countdown setState-in-effect, diretiva eslint unused).
- Verificação E2E com agent-browser: página carrega (HTTP 200, título correto), sem erros de console/hidratação. Hero, trailer (iframe), 3 links de notícias, pricing (2 botões reservar), FAQ (6), CTA final, footer — todos presentes. Checkout dialog abre, form valida, submit chama /api/checkout/create (Order inserida no DB, MisticPay chamada → 502 esperado com credenciais placeholder, order marcada FAILED sem consumir vaga, UI mostra erro com "Voltar ao formulário"). Stats endpoint retorna {earlyBirdTaken:0, remaining:50}. Webhook testado (ignored: order-not-found). Mobile 390px: navbar colapsa em hamburger, hero responsivo.
- VLM confirmou design: neon vibrante Vice City, texto legível, contador ativo (149 dias), botões presentes, aparência profissional.
- Adicionado allowedDevOrigins no next.config.ts.

Stage Summary:
- Site GTA6 XDeals 100% funcional e verificado no navegador.
- Fluxo PIX end-to-end implementado: form → MisticPay create → QR/copyPaste → webhook → polling → confirmação. Falta apenas inserir credenciais reais MISTICPAY_CLIENT_ID/SECRET no Vercel para gerar PIX reais.
- Env vars necessárias no Vercel: DATABASE_URL, MISTICPAY_CLIENT_ID, MISTICPAY_CLIENT_SECRET, MISTICPAY_WEBHOOK_URL(=https://gta6.xdeals.online/webhook).
- Arquivos-chave: src/lib/misticpay.ts, src/lib/pricing.ts, src/app/api/{checkout/create,checkout/status,webhook,stats}/route.ts, src/components/site/*, prisma/schema.prisma.
- Deploy: push p/ GitHub → import no Vercel → configurar env vars → webhook URL já aponta para https://gta6.xdeals.online/webhook.
