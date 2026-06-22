import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { EARLY_BIRD_LIMIT } from "@/lib/pricing";

export const runtime = "nodejs";

/**
 * GET /api/stats
 * Retorna a contagem de vagas early-bird ocupadas e restantes,
 * além do total de pedidos pagos (prova social).
 */
export async function GET() {
  const taken = await db.order.count({
    where: {
      tier: "early_bird",
      status: { in: ["PENDING", "PAID"] },
    },
  });

  const paid = await db.order.count({
    where: { status: "PAID" },
  });

  const remaining = Math.max(0, EARLY_BIRD_LIMIT - taken);

  return NextResponse.json({
    earlyBirdTaken: taken,
    earlyBirdRemaining: remaining,
    earlyBirdLimit: EARLY_BIRD_LIMIT,
    totalPaid: paid,
  });
}
