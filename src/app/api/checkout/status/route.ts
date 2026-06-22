import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

/**
 * GET /api/checkout/status?id=<orderId>
 * Retorna o status atual do pedido. O frontend faz polling para detectar
 * a confirmação que chega via webhook da MisticPay.
 */
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id é obrigatório." }, { status: 400 });
  }

  const order = await db.order.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
      tier: true,
      amountBRL: true,
      amountUSD: true,
      customerName: true,
      customerEmail: true,
      paidAt: true,
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Pedido não encontrado." }, { status: 404 });
  }

  return NextResponse.json(order);
}
