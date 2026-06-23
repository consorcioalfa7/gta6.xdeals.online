import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { createPixTransaction } from "@/lib/misticpay";
import { getPricingTier, EARLY_BIRD_LIMIT, type Tier } from "@/lib/pricing";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

interface CreateBody {
  customerName: string;
  customerEmail: string;
  customerWhatsapp: string;
  customerDocument: string; // CPF
  tier: Tier;
}

function sanitizeCpf(value: string): string {
  return (value || "").replace(/\D/g, "");
}

function sanitizePhone(value: string): string {
  const plus = value?.trim().startsWith("+") ? "+" : "";
  return plus + (value || "").replace(/[^\d]/g, "");
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || "");
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => null)) as CreateBody | null;
    if (!body) {
      return NextResponse.json(
        { error: "Corpo da requisição inválido." },
        { status: 400 }
      );
    }

    const name = (body.customerName || "").trim();
    const email = (body.customerEmail || "").trim();
    const whatsapp = sanitizePhone(body.customerWhatsapp || "");
    const cpf = sanitizeCpf(body.customerDocument || "");
    const tier: Tier = body.tier === "regular" ? "regular" : "early_bird";

    if (name.length < 3) {
      return NextResponse.json({ error: "Informe seu nome completo." }, { status: 400 });
    }
    if (!isEmail(email)) {
      return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
    }
    if (whatsapp.replace("+", "").length < 10) {
      return NextResponse.json({ error: "WhatsApp inválido." }, { status: 400 });
    }
    if (cpf.length !== 11) {
      return NextResponse.json({ error: "CPF deve conter 11 dígitos." }, { status: 400 });
    }

    const pricing = getPricingTier(tier);
    if (!pricing) {
      return NextResponse.json({ error: "Plano inválido." }, { status: 400 });
    }

    if (tier === "early_bird") {
      const taken = store.countEarlyBirdTaken();
      if (taken >= EARLY_BIRD_LIMIT) {
        return NextResponse.json(
          {
            error:
              "As 50 vagas da pré-venda XDeals se esgotaram. Selecione a pré-venda oficial.",
            soldOut: true,
          },
          { status: 409 }
        );
      }
    }

    const applicationTxId = `gta6-${tier}-${randomUUID()}`;
    const orderId = `ord_${randomUUID()}`;

    const order = {
      id: orderId,
      applicationTxId,
      customerName: name,
      customerEmail: email,
      customerWhatsapp: whatsapp,
      customerDocument: cpf,
      tier,
      amountBRL: pricing.priceBRL,
      amountUSD: pricing.priceUSD,
      status: "PENDING" as const,
      createdAt: Date.now(),
    };
    store.create(order);

    let pix;
    try {
      pix = await createPixTransaction({
        amount: pricing.priceBRL,
        payerName: name,
        payerDocument: cpf,
        transactionId: applicationTxId,
        description: `Pré-venda GTA6 XDeals — ${pricing.label}`,
      });
    } catch (err) {
      store.update(orderId, { status: "FAILED" });
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      return NextResponse.json(
        { error: "Não foi possível gerar o QR Code PIX.", detail: message },
        { status: 502 }
      );
    }

    store.update(orderId, {
      misticpayTxId: String(pix.transactionId),
      qrCodeBase64: pix.qrCodeBase64,
      qrcodeUrl: pix.qrcodeUrl,
      copyPaste: pix.copyPaste,
    });

    return NextResponse.json({
      orderId,
      applicationTxId,
      misticpayTxId: pix.transactionId,
      tier,
      amountBRL: pricing.priceBRL,
      amountUSD: pricing.priceUSD,
      qrCodeBase64: pix.qrCodeBase64,
      qrcodeUrl: pix.qrcodeUrl,
      copyPaste: pix.copyPaste,
      status: "PENDING",
    });
  } catch (err) {
    console.error("[checkout/create] erro:", err);
    const message = err instanceof Error ? err.message : "Erro interno.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
