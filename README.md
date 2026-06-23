# GTA VI — Pré-venda XDeals

> Site de pré-venda do **Grand Theft Auto VI** com checkout PIX via **MisticPay**, tema visual Vice City neon e confirmação automática de pagamento via webhook.

**Produção:** [https://gta6.xdeals.online](https://gta6.xdeals.online)

---

## Visão geral

Plataforma de pré-venda single-page construída em Next.js 16 que permite aos clientes reservar o GTA VI pagando via PIX. O fluxo é totalmente automatizado: o cliente preenche um formulário, a API da MisticPay gera o QR Code PIX e o código copia/cola, e um webhook confirma o pagamento em tempo real.

### Características principais

- **Tema visual Vice City** — estética neon (rosa/ciano/púrpura) com fonte display Anton, gradientes, grid animado, scanlines e glows.
- **Countdown ao vivo** até o lançamento (19 de novembro de 2026).
- **Trailer oficial** integrado via YouTube embed.
- **Cards de notícias** vinculados a fontes confiáveis (TecMundo, Times Brasil, G1).
- **Dois planos de preço**: Early Bird (R$ 199,90 — 50 vagas, 50% OFF) e Regular (R$ 400).
- **Contador de vagas** early-bird em tempo real via API.
- **Checkout PIX completo** — formulário → QR Code + copia/cola → polling de status → confirmação.
- **Webhook MisticPay** para confirmação automática de depósito, saque e MED (infração).
- **100% responsivo** — mobile-first com safe-area iOS, touch targets ≥ 44px, sem scroll horizontal.
- **SEO otimizado** — JSON-LD (Product/Offer), Open Graph, Twitter Cards, sitemap.xml, robots.txt, manifest PWA.

---

## Stack técnica

| Camada | Tecnologia |
|---|---|
| Framework | **Next.js 16** (App Router) |
| Linguagem | **TypeScript 5** |
| Estilo | **Tailwind CSS 4** + **shadcn/ui** (New York) |
| Animações | **Framer Motion** |
| Estado (checkout) | **Zustand** |
| Banco de dados | **Nenhum** (store em memória em `src/lib/store.ts`) |
| Pagamentos | **MisticPay API** (PIX) |
| Fontes | Geist (sans) + Anton (display) |
| Deploy | **Vercel** (output `standalone`) |
| Versionamento | **Git** + GitHub |

---

## Fluxo do PIX (MisticPay)

```
Cliente preenche form (Nome, Email, WhatsApp, CPF)
        │
        ▼
POST /api/checkout/create
        │  ┌─ valida campos
        │  ├─ controla 50 vagas early-bird (count no DB)
        │  ├─ cria Order (status=PENDING) no store em memória
        │  └─ chama MisticPay: POST /api/transactions/create
        │              headers: { ci, cs }
        │              body: { amount, payerName, payerDocument,
        │                      transactionId, description, projectWebhook }
        ▼
MisticPay retorna: { qrCodeBase64, qrcodeUrl, copyPaste, transactionId }
        │
        ▼
Frontend exibe QR + copia/cola e inicia POLLING
GET /api/checkout/status?id=<orderId>  (a cada 3,5s)
        │
        ▼  (paralelamente, o banco do cliente processa o PIX)
MisticPay envia webhook:
POST /webhook  { transactionId, status: "COMPLETO", e2e, ... }
        │  ┌─ busca Order por misticpayTxId OU applicationTxId
        │  └─ atualiza status=PAID, paidAt=now()
        ▼
Próximo poll do frontend detecta status=PAID → tela de sucesso
```

---

## Estrutura do projeto

```
.
├── prisma/
│   └── schema.prisma              # Modelo Order
├── public/
│   ├── icon.svg                   # Favicon/logo SVG temático
│   ├── favicon.png                # Favicon PNG (192/512)
│   └── images/
│       ├── hero-bg.png            # Background do hero
│       ├── city-night.png         # Vice City à noite
│       ├── car-drive.png          # Carro na rodovia
│       ├── character.png          # Personagem (CTA final)
│       ├── logo-emblem.png        # Logo emblema (OG/logo org)
│       └── og-banner.png          # Imagem Open Graph (1344×768)
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Metadata SEO + JSON-LD + viewport safe-area
│   │   ├── page.tsx               # Página única (monta todas as seções)
│   │   ├── globals.css            # Tema neon Vice City + utilitários
│   │   ├── sitemap.ts             # /sitemap.xml dinâmico
│   │   ├── robots.ts              # /robots.txt dinâmico
│   │   ├── manifest.ts            # /manifest.webmanifest (PWA)
│   │   └── api/
│   │       ├── checkout/create/route.ts   # Cria pedido + gera PIX
│   │       ├── checkout/status/route.ts   # Polling de status
│   │       ├── webhook/route.ts           # Webhook de confirmação PIX
│   │       └── stats/route.ts             # Contador de vagas early-bird
│   ├── lib/
│   │   ├── store.ts                # Store em memória (pedidos)
│   │   ├── misticpay.ts           # Integração API de pagamentos
│   │   ├── pricing.ts             # Config de preços/tiers/datas
│   │   └── utils.ts               # cn() helper
│   └── components/
│       ├── ui/                    # shadcn/ui (já incluído)
│       └── site/
│           ├── navbar.tsx         # Nav sticky + menu mobile
│           ├── hero.tsx           # Hero + countdown + CTAs
│           ├── countdown.tsx      # Timer regressivo responsivo
│           ├── trailer-section.tsx# YouTube embed + notícias
│           ├── game-info.tsx      # Fatos + galeria
│           ├── pricing.tsx        # 2 tiers + barra de vagas
│           ├── checkout-store.ts  # Zustand store do dialog
│           ├── checkout-dialog.tsx# Fluxo form→PIX→sucesso
│           ├── faq.tsx            # Accordion FAQ
│           ├── final-cta.tsx      # CTA final
│           └── footer.tsx         # Footer sticky + disclaimer
├── .env.example                   # Variáveis de ambiente (template)
├── next.config.ts                 # allowedDevOrigins + standalone
└── package.json
```

---

## Configuração local

### Pré-requisitos

- **Node.js 20+** ou **Bun**
- Credenciais do provedor de pagamentos PIX (`ci` / `cs`)

### Passos

```bash
# 1. Clonar
git clone https://github.com/consorcioalfa7/gta6.xdeals.online.git
cd gta6.xdeals.online

# 2. Instalar dependências
bun install        # ou npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais:
#   MISTICPAY_CLIENT_ID=seu_client_id
#   MISTICPAY_CLIENT_SECRET=seu_client_secret
#   MISTICPAY_WEBHOOK_URL=https://gta6.xdeals.online/webhook

# 4. Iniciar o dev server (sem necessidade de banco de dados)
bun run dev
```

Acesse: **http://localhost:3000**

> **Sem banco de dados:** o projeto usa armazenamento em memória (`src/lib/store.ts`). Não há `db:push` nem configuração de Turso/SQLite.

---

## Variáveis de ambiente

| Variável | Descrição | Exemplo |
|---|---|---|
| `MISTICPAY_CLIENT_ID` | Client ID do provedor (`ci` header) | `seu_client_id` |
| `MISTICPAY_CLIENT_SECRET` | Client Secret do provedor (`cs` header) | `seu_client_secret` |
| `MISTICPAY_WEBHOOK_URL` | URL pública do webhook | `https://gta6.xdeals.online/webhook` |

> **Atenção:** Nunca commite o arquivo `.env` real. Use o `.env.example` como template.

---

## Deploy na Vercel

1. **Conecte o repositório** em [vercel.com/new](https://vercel.com/new) (importe de `consorcioalfa7/gta6.xdeals.online`).
2. **Framework preset:** Next.js
3. **Build command:** automático (`next build`)
4. **Output:** `standalone` (já configurado em `next.config.ts`)
5. **Variáveis de ambiente** (Settings → Environment Variables):

   ```
   MISTICPAY_CLIENT_ID=<seu_client_id>
   MISTICPAY_CLIENT_SECRET=<seu_client_secret>
   MISTICPAY_WEBHOOK_URL=https://gta6.xdeals.online/webhook
   ```

6. **Domínio:** Adicione `gta6.xdeals.online` em Settings → Domains e configure o DNS (CNAME para `cname.vercel-dns.com`).
7. **Webhook:** No painel do provedor de pagamentos, cadastre a URL `https://gta6.xdeals.online/webhook`.
8. **Redeploy** após configurar as env vars (Deployments → ⋮ → Redeploy).

> **Nota sobre persistência:** o store é em memória. Em serverless, instâncias frias não compartilham estado, então um pedido pode se "perder" se a instância reciclar entre a criação e a confirmação do pagamento. Para um MVP de pré-venda isto é aceitável; para persistência total, integre [Vercel KV](https://vercel.com/docs/storage/vercel-kv) no futuro substituindo `src/lib/store.ts`.

---

## API Reference

### `POST /api/checkout/create`

Cria um pedido e gera o PIX na MisticPay.

**Body:**
```json
{
  "customerName": "João da Silva",
  "customerEmail": "joao@email.com",
  "customerWhatsapp": "11999999999",
  "customerDocument": "12345678909",
  "tier": "early_bird"
}
```

**Response 200:**
```json
{
  "orderId": "clx...",
  "applicationTxId": "gta6-early_bird-...",
  "misticpayTxId": "31484480",
  "tier": "early_bird",
  "amountBRL": 199.90,
  "amountUSD": 39,
  "qrCodeBase64": "data:image/png;base64,...",
  "qrcodeUrl": "https://api.qrserver.com/...",
  "copyPaste": "00020101021226...",
  "status": "PENDING"
}
```

### `GET /api/checkout/status?id=<orderId>`

Retorna o status atual do pedido (usado pelo polling do frontend).

```json
{ "id": "...", "status": "PAID", "tier": "early_bird", "amountBRL": 199.90, ... }
```

### `POST /api/webhook`

Recebe notificações da MisticPay. Status `COMPLETO` em `DEPOSITO` → marca o pedido como `PAID`.

### `GET /api/stats`

Contador de vagas early-bird e total de pedidos pagos.

```json
{ "earlyBirdTaken": 3, "earlyBirdRemaining": 47, "earlyBirdLimit": 50, "totalPaid": 1 }
```

---

## Modelo de dados (store em memória)

O armazenamento é feito em `src/lib/store.ts` — um `Map<string, OrderRecord>` em memória (persiste entre hot reloads em dev via `globalThis`). Sem banco de dados, sem migrações.

```ts
interface OrderRecord {
  id: string;
  applicationTxId: string;   // ID enviado ao provedor de pagamentos
  misticpayTxId?: string;    // ID retornado pelo provedor
  customerName: string;
  customerEmail: string;
  customerWhatsapp: string;
  customerDocument: string;  // CPF
  tier: string;              // early_bird | regular
  amountBRL: number;
  amountUSD: number;
  status: "PENDING" | "PAID" | "FAILED";
  qrCodeBase64?: string;
  qrcodeUrl?: string;
  copyPaste?: string;
  e2e?: string;
  createdAt: number;
  paidAt?: number;
}
```

---

## Otimizações implementadas

### Responsividade / Mobile
- Mobile-first em todos os componentes (breakpoints `sm`/`md`/`lg`).
- `viewport-fit=cover` + utilitários `safe-top`/`safe-bottom`/`safe-x` para notch iOS.
- `min-h-[100svh]` no hero (evita bug do 100vh em mobile).
- `overflow-x-hidden` no body (zero scroll horizontal).
- Touch targets ≥ 44px (botão menu 44×44, links do menu mobile com `py-3`).
- Countdown em `grid-cols-4` fluido (cabe em 320px).
- QR Code do checkout redimensiona (44→52 rem) conforme viewport.
- Input copia/cola com `min-w-0 flex-1` + botão `shrink-0` (nunca estoura).
- Tap highlight removido (`-webkit-tap-highlight-color: transparent`).
- Font smoothing e `text-rendering: optimizeLegibility`.

### SEO / Indexação
- `metadataBase` + canonical URL.
- JSON-LD estruturado: `Product` + `AggregateOffer` com 2 ofertas (preço/availability).
- Open Graph + Twitter Cards com imagem dedicada (1344×768).
- `robots` config com `max-image-preview: large`.
- `sitemap.xml` e `robots.txt` dinâmicos (Next.js metadata routes).
- `manifest.webmanifest` (PWA) com ícones e theme color.
- `lang="pt-BR"`, `<html class="dark">`, `colorScheme: dark`.
- HTML semântico (`header`, `nav`, `main`, `section`, `footer`).
- Alt text em todas as imagens; `loading="lazy"` nas imagens fora da dobra.
- `preconnect` para YouTube/i.ytimg.com (iframe mais rápido).
- Favicon SVG vetorial (nítido em qualquer DPI) + PNG fallback.

### Performance
- Fontes com `display: "swap"`.
- Imagens otimizadas via `next/image` onde aplicável; `loading="lazy"` nas decorativas.
- Polling de status a cada 3,5s (balanceia UX × custo de servidor).
- Store em memória singleton (evita recriar o Map a cada request).

---

## Scripts disponíveis

| Script | Descrição |
|---|---|
| `bun run dev` | Inicia o dev server (porta 3000) |
| `bun run build` | Build de produção (standalone) |
| `bun run start` | Inicia o server de produção |
| `bun run lint` | ESLint + regras Next.js |

---

## Segurança

- Credenciais MisticPay **apenas no servidor** (env vars, nunca no client).
- Validação de input no backend (nome ≥ 3 chars, email regex, CPF 11 dígitos, telefone ≥ 10).
- CPF sanitizado (só dígitos) antes de enviar à MisticPay.
- Webhook idempotente (re-confirmações não duplicam efeitos).
- `disallow: /api/` no robots ( endpoints internos não indexados).
- Disclaimer de marcas no footer (não afiliado à Rockstar Games).

> **Aviso:** Mantenha seu token de acesso GitHub e credenciais MisticPay em segredo. Se vazarem, **revogue imediatamente** no painel respectivo.

---

## Disclaimer legal

XDeals é uma loja independente de revenda de jogos. **Grand Theft Auto** e **GTA** são marcas registradas da Rockstar Games / Take-Two Interactive. Este projeto não é afiliado, patrocinado ou endossado pela Rockstar Games. Todo o conteúdo visual gerado (imagens, logo) é original e não utiliza assets copyrightados.

---

## Licença

MIT — uso livre. Veja [LICENSE](./LICENSE) (ou crie um arquivo LICENSE MIT se desejar formalizar).

---

## Repositório

**GitHub:** [consorcioalfa7/gta6.xdeals.online](https://github.com/consorcioalfa7/gta6.xdeals.online)

**Produção:** [https://gta6.xdeals.online](https://gta6.xdeals.online)

---

_Desenvolvido com Next.js 16 + MisticPay. Tema visual inspirado na estética Vice City._
