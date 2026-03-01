import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "O Carbon Marathon Chique B é um tênis original?",
    answer:
      "Sim! O Carbon Marathon Chique B é um tênis original com certificado de autenticidade. Trabalhamos diretamente com o fabricante para garantir a qualidade e originalidade de todos os produtos.",
  },
  {
    question: "A placa de carbono realmente faz diferença?",
    answer:
      "Sim, a placa de carbono proporciona um retorno de energia excepcional a cada passada, melhorando sua performance em até 4%. É a mesma tecnologia utilizada por atletas profissionais em competições.",
  },
  {
    question: "O tênis é confortável para corridas longas?",
    answer:
      "Com certeza! O sistema de amortecimento em espuma de alta densidade foi desenvolvido para proporcionar conforto duradouro mesmo em corridas de longa distância. A malha respirável mantém seus pés frescos durante toda a atividade.",
  },
  {
    question: "Como funciona a entrega?",
    answer:
      "Oferecemos frete grátis para todo o Brasil. Para capitais, o prazo de entrega é de até 2 dias úteis. Para demais regiões, o prazo pode variar de 3 a 7 dias úteis.",
  },
  {
    question: "Qual é a política de garantia e devolução?",
    answer:
      "Oferecemos garantia de 90 dias contra defeitos de fabricação. Além disso, você tem 7 dias após o recebimento para solicitar troca ou devolução, sem custo adicional.",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="container px-4 py-8 scroll-mt-20">
      <h2 className="text-lg font-extrabold text-foreground mb-4 tracking-tight">Perguntas Frequentes</h2>
      <Accordion type="single" collapsible className="space-y-2">
        {faqs.map((faq, i) => (
          <AccordionItem
            key={i}
            value={`item-${i}`}
            className="bg-card border border-border/60 rounded-xl px-4 shadow-sm"
          >
            <AccordionTrigger className="text-sm font-bold text-foreground hover:no-underline py-4">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default FAQ;
