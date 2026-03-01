import { Truck, RefreshCw, Shield, Lock } from "lucide-react";

const guarantees = [
  {
    icon: Truck,
    title: "Frete Grátis",
    description: "Entrega para todo o Brasil",
    color: "bg-success/10 text-success",
  },
  {
    icon: RefreshCw,
    title: "Troca Fácil",
    description: "7 dias para trocar ou devolver",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: Shield,
    title: "Garantia 90 Dias",
    description: "Proteção contra defeitos",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Lock,
    title: "Pagamento Seguro",
    description: "Ambiente 100% protegido",
    color: "bg-foreground/5 text-foreground",
  },
];

const Guarantees = () => {
  return (
    <section id="garantias" className="container px-4 py-8 scroll-mt-20">
      <h2 className="text-lg font-extrabold text-foreground mb-4 tracking-tight">Garantias</h2>
      <div className="grid grid-cols-2 gap-3">
        {guarantees.map((item) => (
          <div
            key={item.title}
            className="bg-card rounded-xl p-4 text-center flex flex-col items-center gap-2.5 shadow-sm border border-border/60"
          >
            <div className={`w-11 h-11 rounded-xl ${item.color} flex items-center justify-center`}>
              <item.icon className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">{item.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Guarantees;
