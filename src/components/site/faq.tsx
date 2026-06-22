"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { HelpCircle } from "lucide-react";

const FAQS = [
  {
    q: "Quando o GTA VI será lançado?",
    a: "O lançamento mundial está confirmado para o dia 19 de novembro de 2026. A pré-venda oficial nas lojas participantes começa em 25 de junho, mas na XDeals você já pode garantir a sua hoje com desconto exclusivo.",
  },
  {
    q: "Como funciona a pré-venda da XDeals?",
    a: "Você preenche o formulário (nome, e-mail, WhatsApp e CPF), paga via PIX e recebe a confirmação automática na tela e por e-mail. Sua vaga fica reservada para a entrega no lançamento.",
  },
  {
    q: "Por que o preço é mais barato aqui?",
    a: "A XDeals disponibiliza um lote promocional limitado aos primeiros 50 membros, com mais de 50% de desconto sobre o preço oficial de varejo (R$ 400). Quando as 50 vagas se esgotarem, o preço volta ao valor normal.",
  },
  {
    q: "O pagamento é seguro?",
    a: "Sim. O PIX é gerado pela API da MisticPay, provedor de pagamentos homologado pelo Banco Central. A confirmação chega automaticamente via webhook assim que o banco confirma a transferência.",
  },
  {
    q: "Quais plataformas são suportadas?",
    a: "A reserva garante sua cópia para PlayStation 5, Xbox Series X|S ou PC. A escolha da plataforma é feita no momento do resgate, próximo ao lançamento.",
  },
  {
    q: "E se eu precisar de suporte?",
    a: "Clientes XDeals têm atendimento prioritário via WhatsApp. Use o número informado no e-mail de confirmação.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="relative scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <Badge className="mb-3 border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan">
            <HelpCircle className="mr-1 h-3 w-3" /> Perguntas frequentes
          </Badge>
          <h2 className="font-display text-4xl tracking-tight text-white sm:text-5xl">
            DÚVIDAS <span className="text-gradient-vice">FREQUENTES</span>
          </h2>
        </motion.div>

        <Accordion type="single" collapsible className="space-y-3">
          {FAQS.map((f, i) => (
            <motion.div
              key={f.q}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <AccordionItem
                value={`item-${i}`}
                className="rounded-xl border border-border/60 bg-card/50 px-5 backdrop-blur data-[state=open]:neon-border-cyan/60"
              >
                <AccordionTrigger className="text-left text-base font-medium text-white hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-foreground/75">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
