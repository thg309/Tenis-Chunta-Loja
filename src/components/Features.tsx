import { Zap, Wind, Layers, Feather, Grip, Target } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Placa de Carbono",
    description: "Retorno de energia excepcional e propulsão otimizada",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: Wind,
    title: "Malha Respirável",
    description: "Mantém seus pés frescos e secos durante toda a corrida",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Layers,
    title: "Amortecimento Premium",
    description: "Espuma de alta densidade que absorve impactos",
    color: "bg-success/10 text-success",
  },
  {
    icon: Feather,
    title: "Ultra Leve",
    description: "Apenas 220g para máximo conforto e agilidade",
    color: "bg-warning/10 text-warning",
  },
  {
    icon: Grip,
    title: "Antiderrapante",
    description: "Solado de borracha para maior aderência",
    color: "bg-foreground/5 text-foreground",
  },
  {
    icon: Target,
    title: "Design Ergonômico",
    description: "Ideal para corridas longas e treinos intensos",
    color: "bg-accent/10 text-accent",
  },
];

const Features = () => {
  return (
    <section className="container px-4 py-8">
      <h2 className="text-lg font-extrabold text-foreground mb-4 tracking-tight">Características do Produto</h2>
      <div className="grid grid-cols-2 gap-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="bg-card rounded-xl p-4 flex flex-col gap-2.5 shadow-sm border border-border/60"
          >
            <div className={`w-10 h-10 rounded-lg ${feature.color} flex items-center justify-center`}>
              <feature.icon className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">{feature.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
