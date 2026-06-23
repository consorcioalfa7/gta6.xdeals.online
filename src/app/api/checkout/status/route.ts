import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export const runtime = "nodejs";

/**
 * GET /api/checkout/status?id=<orderId>
 * Retorna o status atual do pedido. O frontend faz polling para detectar
 * a confirmação que chega via webhook.
 */
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id é obrigatório." }, { status: 400 });
  }

  const order = store.getById(id);
  if (!order) {
    return NextResponse.json({ error: "Pedido não encontrado." }, { status: 404 });
  }

  return NextResponse.json({
    id: order.id,
    status: order.status,
    tier: order.tier,
    amountBRL: order.amountBRL,
    amountUSD: order.amountUSD,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    paidAt: order.paidAt,
  });
}
