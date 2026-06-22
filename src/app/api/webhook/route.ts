import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

/**
 * Webhook da MisticPay — recebe notificações de depósito (PIX), saque e MED.
 * URL pública configurada no Vercel: https://gta6.xdeals.online/webhook
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
      // Mesmo payload inválido, respondemos 200 para a MisticPay não retentar indefinidamente
      return NextResponse.json({ ok: true, ignored: true, reason: "invalid-json" });
    }

    // Eventos de MED (infração) — apenas logamos e ack
    if (payload?.event === "INFRACTION") {
      console.warn("[misticpay/webhook] INFRACTION recebida:", JSON.stringify(payload).slice(0, 400));
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

    // Procura o pedido pelo ID da MisticPay ou pelo nosso applicationTxId
    const order = await db.order.findFirst({
      where: {
        OR: [
          { misticpayTxId: String(txId) },
          { applicationTxId: String(txId) },
        ],
      },
    });

    if (!order) {
      console.warn("[misticpay/webhook] pedido não encontrado para txId:", txId);
      return NextResponse.json({ ok: true, ignored: true, reason: "order-not-found" });
    }

    if (status === "COMPLETO" || status === "CONCLUIDO" || status === "APROVADO") {
      if (order.status !== "PAID") {
        await db.order.update({
          where: { id: order.id },
          data: {
            status: "PAID",
            paidAt: new Date(),
            e2e: payload?.e2e ? String(payload.e2e) : order.e2e,
          },
        });
        console.log(`[misticpay/webhook] pedido ${order.id} marcado como PAID`);
      }
      return NextResponse.json({ ok: true, status: "PAID" });
    }

    if (status === "REJEITADO" || status === "FALHOU" || status === "CANCELADO") {
      await db.order.update({
        where: { id: order.id },
        data: { status: "FAILED" },
      });
      return NextResponse.json({ ok: true, status: "FAILED" });
    }

    // Outros status (ex: PENDENTE) — apenas ack
    return NextResponse.json({ ok: true, status });
  } catch (err) {
    console.error("[misticpay/webhook] erro:", err);
    return NextResponse.json({ ok: false, error: "internal" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "misticpay-webhook",
    timestamp: new Date().toISOString(),
  });
}
