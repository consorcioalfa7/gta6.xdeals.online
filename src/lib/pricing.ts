/**
 * Configuração de preços e tiers da pré-venda GTA6 XDeals.
 */

export type Tier = "early_bird" | "regular";

export interface PricingTier {
  id: Tier;
  label: string;
  priceBRL: number;
  priceUSD: number;
  originalBRL?: number;
  originalUSD?: number;
  slots: number | null; // null = ilimitado
  highlight: boolean;
  perks: string[];
}

export const EARLY_BIRD_LIMIT = 50;

export const PRICING_TIERS: PricingTier[] = [
  {
    id: "early_bird",
    label: "Prevenda XDeals — Primeiros 50",
    priceBRL: 199.9,
    priceUSD: 39,
    originalBRL: 400,
    originalUSD: 80,
    slots: EARLY_BIRD_LIMIT,
    highlight: true,
    perks: [
      "Acesso imediato à reserva da pré-venda",
      "Mais de 50% de desconto (R$ 400 → R$ 199,90)",
      "Garantia de cópia no lançamento (19/11/2026)",
      "Suporte prioritário via WhatsApp",
      "Bônus digitais exclusivos XDeals",
    ],
  },
  {
    id: "regular",
    label: "Pré-venda Oficial — A partir de 25/06",
    priceBRL: 400,
    priceUSD: 80,
    slots: null,
    highlight: false,
    perks: [
      "Reserva oficial no preço de varejo",
      "Cópia garantida no lançamento (19/11/2026)",
      "Suporte padrão via e-mail",
    ],
  },
];

export const RELEASE_DATE = "2026-11-19T00:00:00-03:00"; // 19 nov 2026, horário Brasília
export const PRESALE_START_DATE = "2026-06-25T00:00:00-03:00"; // 25 jun 2026

export function getPricingTier(tier: Tier): PricingTier | undefined {
  return PRICING_TIERS.find((t) => t.id === tier);
}
