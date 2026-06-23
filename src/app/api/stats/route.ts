import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import { EARLY_BIRD_LIMIT } from "@/lib/pricing";

export const runtime = "nodejs";

/**
 * GET /api/stats
 * Contador de vagas early-bird ocupadas e restantes, além do total de pedidos
 * pagos (prova social).
 */
export async function GET() {
  const taken = store.countEarlyBirdTaken();
  const paid = store.countPaid();
  const remaining = Math.max(0, EARLY_BIRD_LIMIT - taken);

  return NextResponse.json({
    earlyBirdTaken: taken,
    earlyBirdRemaining: remaining,
    earlyBirdLimit: EARLY_BIRD_LIMIT,
    totalPaid: paid,
  });
}
