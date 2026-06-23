import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export const runtime = "nodejs";

/**
 * Webhook de pagamento — recebe notificações de depósito (PIX), saque e MED.
 * URL pública: https://gta6.xdeals.online/webhook
 *
 * Payload de depósito (cash-in):
 * {
 *   "transactionId": 31484480,
 *   "transactionType": "DEPOSITO",
 *   "transactionMethod": "PIX",
 *   "clientName": "...",
 *   "clientDocument": "12345678909",
 *   "status": "COMPLETO",
 *   "value": 455,
 *   "fee": 23,
 *   "e2e": "..."
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const raw = await req.text();
    let payload: any;
    try {
      payload = JSON.parse(raw);
    } catch {
      // Payload inválido: respondemos 200 para não gerar retentativas infinitas
      return NextResponse.json({ ok: true, ignored: true, reason: "invalid-json" });
    }

    // Eventos de MED (infração) — apenas logamos e ack
    if (payload?.event === "INFRACTION") {
      console.warn("[webhook] INFRACTION recebida:", JSON.stringify(payload).slice(0, 400));
      return NextResponse.json({ ok: true, event: "INFRACTION" });
    }

    const txId = payload?.transactionId;
    const status = String(payload?.status || "").toUpperCase();
    const type = String(payload?.transactionType || "").toUpperCase();

    if (!txId) {
      return NextResponse.json({ ok: true, ignored: true, reason: "no-transactionId" });
    }

    // Só tratamos depósitos (cash-in) como confirmação de pedido
    if (type !== "DEPOSITO") {
      return NextResponse.json({ ok: true, ignored: true, reason: `type=${type}` });
    }

    // Procura o pedido pelo ID externo ou pelo nosso applicationTxId
    const order = store.findByTxId(txId);
    if (!order) {
      console.warn("[webhook] pedido não encontrado para txId:", txId);
      return NextResponse.json({ ok: true, ignored: true, reason: "order-not-found" });
    }

    if (status === "COMPLETO" || status === "CONCLUIDO" || status === "APROVADO") {
      if (order.status !== "PAID") {
        store.update(order.id, {
          status: "PAID",
          paidAt: Date.now(),
          e2e: payload?.e2e ? String(payload.e2e) : order.e2e,
        });
        console.log(`[webhook] pedido ${order.id} marcado como PAID`);
      }
      return NextResponse.json({ ok: true, status: "PAID" });
    }

    if (status === "REJEITADO" || status === "FALHOU" || status === "CANCELADO") {
      store.update(order.id, { status: "FAILED" });
      return NextResponse.json({ ok: true, status: "FAILED" });
    }

    // Outros status (ex: PENDENTE) — apenas ack
    return NextResponse.json({ ok: true, status });
  } catch (err) {
    console.error("[webhook] erro:", err);
    return NextResponse.json({ ok: false, error: "internal" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "pix-webhook",
    timestamp: new Date().toISOString(),
  });
}
