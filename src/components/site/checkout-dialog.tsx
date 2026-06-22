"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Copy,
  Info,
  Loader2,
  Lock,
  PartyPopper,
  QrCode,
  ShieldCheck,
  Timer,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useCheckout } from "./checkout-store";
import { getPricingTier, type Tier } from "@/lib/pricing";
import { useToast } from "@/hooks/use-toast";

type Step = "form" | "paying" | "paid" | "error";

interface PixData {
  orderId: string;
  qrCodeBase64: string;
  qrcodeUrl: string;
  copyPaste: string;
  amountBRL: number;
  amountUSD: number;
}

function formatCpf(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 13);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  return `+${d.slice(0, 2)} (${d.slice(2, 4)}) ${d.slice(4, 9)}-${d.slice(9, 13)}`;
}

export function CheckoutDialog() {
  const { open, tier, setOpen } = useCheckout();
  const { toast } = useToast();

  const [step, setStep] = useState<Step>("form");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pix, setPix] = useState<PixData | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [cpf, setCpf] = useState("");

  const pricing = getPricingTier(tier as Tier);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef<number>(0);
  const [elapsed, setElapsed] = useState(0);

  // Reset ao abrir
  useEffect(() => {
    if (open) {
      setStep("form");
      setSubmitting(false);
      setError(null);
      setPix(null);
    } else {
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, [open]);

  // Timer decorrido na etapa de pagamento
  useEffect(() => {
    if (step !== "paying") return;
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startRef.current) / 1000)), 1000);
    return () => clearInterval(id);
  }, [step]);

  // Polling do status
  function startPolling(orderId: string) {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const r = await fetch(`/api/checkout/status?id=${encodeURIComponent(orderId)}`);
        const d = await r.json();
        if (d.status === "PAID") {
          if (pollRef.current) clearInterval(pollRef.current);
          pollRef.current = null;
          setStep("paid");
        }
      } catch {
        /* ignora erros transientes */
      }
    }, 3500);
  }

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (name.trim().length < 3) return setError("Informe seu nome completo.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("E-mail inválido.");
    if (whatsapp.replace(/\D/g, "").length < 10) return setError("WhatsApp inválido.");
    if (cpf.replace(/\D/g, "").length !== 11) return setError("CPF deve ter 11 dígitos.");

    setSubmitting(true);
    try {
      const r = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name.trim(),
          customerEmail: email.trim(),
          customerWhatsapp: whatsapp.trim(),
          customerDocument: cpf.replace(/\D/g, ""),
          tier,
        }),
      });
      const d = await r.json();
      if (!r.ok) {
        setError(d?.error || "Falha ao iniciar o pagamento.");
        setStep("error");
        setSubmitting(false);
        return;
      }
      setPix({
        orderId: d.orderId,
        qrCodeBase64: d.qrCodeBase64,
        qrcodeUrl: d.qrcodeUrl,
        copyPaste: d.copyPaste,
        amountBRL: d.amountBRL,
        amountUSD: d.amountUSD,
      });
      startRef.current = Date.now();
      setElapsed(0);
      setStep("paying");
      startPolling(d.orderId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro de rede.");
      setStep("error");
    } finally {
      setSubmitting(false);
    }
  }

  async function copyPix() {
    if (!pix) return;
    try {
      await navigator.clipboard.writeText(pix.copyPaste);
      toast({ title: "Código PIX copiado!", description: "Cole no app do seu banco." });
    } catch {
      toast({ title: "Não foi possível copiar", variant: "destructive" });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[92vh] overflow-y-auto border-border/70 bg-card/95 backdrop-blur-xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl tracking-wide text-white">
            {step === "paid" ? "PAGAMENTO CONFIRMADO" : "FINALIZAR COMPRA"}
          </DialogTitle>
          <DialogDescription className="text-foreground/70">
            {pricing?.label} ·{" "}
            <span className="text-neon-cyan">
              R${" "}
              {pricing?.priceBRL.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>{" "}
            via PIX
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {/* FORM */}
          {step === "form" && (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <Label htmlFor="ck-name">Nome completo</Label>
                <Input
                  id="ck-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  autoComplete="name"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ck-email">E-mail</Label>
                <Input
                  id="ck-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@email.com"
                  autoComplete="email"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="ck-wa">WhatsApp</Label>
                  <Input
                    id="ck-wa"
                    inputMode="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(formatPhone(e.target.value))}
                    placeholder="(11) 99999-9999"
                    autoComplete="tel"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ck-cpf">CPF</Label>
                  <Input
                    id="ck-cpf"
                    inputMode="numeric"
                    value={cpf}
                    onChange={(e) => setCpf(formatCpf(e.target.value))}
                    placeholder="000.000.000-00"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="rounded-lg border border-neon-cyan/30 bg-neon-cyan/5 p-3 text-xs text-foreground/70">
                <p className="flex items-start gap-2">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-neon-cyan" />
                  O CPF é exigido pela API de pagamentos MisticPay para gerar o
                  QR Code PIX. Seus dados são usados apenas para esta transação.
                </p>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full gradient-vice text-white glow-pink hover:opacity-90"
                size="lg"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Gerando
                    PIX…
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" /> Pagar R${" "}
                    {pricing?.priceBRL.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    via PIX
                  </>
                )}
              </Button>

              <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-neon-cyan" />
                Pagamento criptografado · Confirmação automática
              </p>
            </motion.form>
          )}

          {/* PAYING */}
          {step === "paying" && pix && (
            <motion.div
              key="paying"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between rounded-lg border border-neon-cyan/30 bg-neon-cyan/5 px-3 py-2 text-sm">
                <span className="flex items-center gap-2 text-neon-cyan">
                  <Timer className="h-4 w-4" /> Aguardando pagamento
                </span>
                <span className="font-mono text-muted-foreground">
                  {Math.floor(elapsed / 60)}:
                  {String(elapsed % 60).padStart(2, "0")}
                </span>
              </div>

              <div className="flex flex-col items-center gap-3 rounded-xl border border-border/60 bg-background/50 p-4">
                <div className="rounded-xl bg-white p-3">
                  <img
                    src={pix.qrcodeUrl || pix.qrCodeBase64}
                    alt="QR Code PIX"
                    className="h-52 w-52"
                  />
                </div>
                <Badge className="border-neon-pink/40 bg-neon-pink/10 text-neon-pink">
                  <QrCode className="mr-1 h-3 w-3" /> Escaneie com seu banco
                </Badge>
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">
                  Ou copie o código PIX
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value={pix.copyPaste}
                    className="font-mono text-xs"
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                  />
                  <Button
                    type="button"
                    onClick={copyPix}
                    variant="outline"
                    className="border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/10"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-neon-cyan" />
                Verificando pagamento automaticamente…
              </div>
            </motion.div>
          )}

          {/* PAID */}
          {step === "paid" && (
            <motion.div
              key="paid"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4 py-6 text-center"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neon-cyan/15 glow-cyan">
                <CheckCircle2 className="h-12 w-12 text-neon-cyan" />
              </div>
              <h3 className="font-display text-2xl text-white">
                RESERVA CONFIRMADA!
              </h3>
              <p className="max-w-sm text-sm text-foreground/75">
                Recebemos seu pagamento de{" "}
                <strong className="text-neon-cyan">
                  R${" "}
                  {pix?.amountBRL.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </strong>
                . Um e-mail com os detalhes da sua pré-venda do GTA VI foi
                enviado para <strong className="text-white">{email}</strong>.
              </p>
              <div className="flex items-center gap-2 rounded-full border border-neon-pink/40 bg-neon-pink/10 px-4 py-1.5 text-xs text-neon-pink">
                <PartyPopper className="h-4 w-4" /> Você garantiu sua vaga
                XDeals!
              </div>
              <Button
                onClick={() => setOpen(false)}
                className="mt-2 gradient-vice text-white"
              >
                Concluir
              </Button>
            </motion.div>
          )}

          {/* ERROR */}
          {step === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4 py-6 text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/15">
                <Info className="h-8 w-8 text-destructive" />
              </div>
              <h3 className="font-display text-xl text-white">
                Não foi possível gerar o PIX
              </h3>
              <p className="max-w-sm text-sm text-foreground/70">{error}</p>
              <Button variant="outline" onClick={() => setStep("form")}>
                Voltar ao formulário
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
