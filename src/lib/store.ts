/**
 * Store em memória para pedidos de pré-venda.
 *
 * Simplificação: removemos Prisma/SQLite/Turso. Para uma pré-venda de 50 vagas
 * com janela de pagamento curta (minutos), armazenamento em memória é suficiente.
 *
 * Nota: em serverless (Vercel), instâncias frias não compartilham estado. Isso
 * significa que se a instância reciclar entre a criação do pedido e o polling
 * de status, o pedido some. Para o MVP isso é aceitável — o webhook ainda
 * confirma pagamentos enquanto a instância está quente. Para persistência
 * total, considere Vercel KV ou Turso no futuro.
 */

export type OrderStatus = "PENDING" | "PAID" | "FAILED";

export interface OrderRecord {
  id: string;
  applicationTxId: string;
  misticpayTxId?: string;
  customerName: string;
  customerEmail: string;
  customerWhatsapp: string;
  customerDocument: string;
  tier: string;
  amountBRL: number;
  amountUSD: number;
  status: OrderStatus;
  qrCodeBase64?: string;
  qrcodeUrl?: string;
  copyPaste?: string;
  e2e?: string;
  createdAt: number;
  paidAt?: number;
}

// Persiste entre hot reloads em dev
const g = globalThis as unknown as { __gta6_orders?: Map<string, OrderRecord> };
const orders: Map<string, OrderRecord> = g.__gta6_orders ?? new Map();
if (process.env.NODE_ENV !== "production") g.__gta6_orders = orders;

export const store = {
  create(order: OrderRecord): void {
    orders.set(order.id, order);
  },

  getById(id: string): OrderRecord | undefined {
    return orders.get(id);
  },

  /** Busca por qualquer um dos IDs (applicationTxId ou misticpayTxId). */
  findByTxId(txId: string | number): OrderRecord | undefined {
    const key = String(txId);
    for (const o of orders.values()) {
      if (o.applicationTxId === key || o.misticpayTxId === key) return o;
    }
    return undefined;
  },

  update(id: string, patch: Partial<OrderRecord>): OrderRecord | undefined {
    const o = orders.get(id);
    if (!o) return undefined;
    Object.assign(o, patch);
    return o;
  },

  /** Conta vagas early-bird ocupadas (PENDING ou PAID). */
  countEarlyBirdTaken(): number {
    let n = 0;
    for (const o of orders.values()) {
      if (o.tier === "early_bird" && (o.status === "PENDING" || o.status === "PAID")) n++;
    }
    return n;
  },

  countPaid(): number {
    let n = 0;
    for (const o of orders.values()) {
      if (o.status === "PAID") n++;
    }
    return n;
  },
};
