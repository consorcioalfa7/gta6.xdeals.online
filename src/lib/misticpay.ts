/**
 * Integração com a API da MisticPay (PIX cash-in).
 * Docs: https://api.misticpay.com/api
 *
 * Credenciais (ci / cs) vem das env vars MISTICPAY_CLIENT_ID / MISTICPAY_CLIENT_SECRET.
 */

const MISTICPAY_BASE_URL = "https://api.misticpay.com/api";

export interface MisticPayCreateParams {
  amount: number; // valor em reais (ex: 199.90)
  payerName: string;
  payerDocument: string; // CPF só números
  transactionId: string; // ID da nossa aplicação
  description: string;
  projectWebhook?: string;
}

export interface MisticPayTransaction {
  transactionId: string;
  payerName: string;
  payerDocument: string;
  transactionFee: number;
  transactionType: string;
  transactionMethod: string;
  transactionAmount: number;
  transactionState: string;
  qrCodeBase64: string;
  qrcodeUrl: string;
  copyPaste: string;
}

export interface MisticPayResponse {
  message: string;
  data: MisticPayTransaction;
}

export interface MisticPayWebhookPayload {
  transactionId: number | string;
  transactionType: string; // DEPOSITO | RETIRADA
  transactionMethod: string;
  clientName: string;
  clientDocument: string;
  status: string; // COMPLETO, etc
  value: number;
  fee: number;
  e2e?: string;
}

function getCredentials() {
  const ci = process.env.MISTICPAY_CLIENT_ID;
  const cs = process.env.MISTICPAY_CLIENT_SECRET;
  if (!ci || !cs) {
    throw new Error(
      "MisticPay credentials missing. Defina MISTICPAY_CLIENT_ID e MISTICPAY_CLIENT_SECRET."
    );
  }
  return { ci, cs };
}

export function getWebhookUrl(): string {
  return (
    process.env.MISTICPAY_WEBHOOK_URL ||
    "https://gta6.xdeals.online/webhook"
  );
}

/**
 * Cria uma transação PIX (cash-in) na MisticPay.
 */
export async function createPixTransaction(
  params: MisticPayCreateParams
): Promise<MisticPayTransaction> {
  const { ci, cs } = getCredentials();

  const body = {
    amount: params.amount,
    payerName: params.payerName,
    payerDocument: params.payerDocument,
    transactionId: params.transactionId,
    description: params.description,
    projectWebhook: params.projectWebhook ?? getWebhookUrl(),
  };

  const res = await fetch(`${MISTICPAY_BASE_URL}/transactions/create`, {
    method: "POST",
    headers: {
      ci,
      cs,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const rawText = await res.text();
  if (!res.ok) {
    throw new Error(
      `MisticPay create failed (${res.status}): ${rawText.slice(0, 500)}`
    );
  }

  let json: MisticPayResponse;
  try {
    json = JSON.parse(rawText);
  } catch {
    throw new Error(`MisticPay: resposta inválida JSON: ${rawText.slice(0, 500)}`);
  }

  if (!json?.data?.transactionId) {
    throw new Error(`MisticPay: resposta sem transactionId: ${rawText.slice(0, 500)}`);
  }

  return json.data;
}
