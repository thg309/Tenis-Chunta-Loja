import { ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";

const menuItems = [
  { label: "Início", href: "#inicio" },
  { label: "Comprar Agora", href: "#comprar" },
  { label: "Avaliações", href: "#avaliacoes" },
  { label: "Perguntas Frequentes", href: "#faq" },
  { label: "Garantia", href: "#garantias" },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems } = useCart();

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border/50 shadow-sm">
      <div className="container flex items-center justify-between h-14 px-4">
        <button
          className="text-foreground"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="flex-1 flex justify-center">
          <h1 className="text-xl font-black tracking-tight">
            <span className="text-accent">CHIQUE</span>
            <span className="text-foreground"> B</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const el = document.querySelector("#comprar");
              if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
            }}
            className="text-muted-foreground hover:text-foreground transition-colors relative"
            aria-label="Carrinho"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-accent text-accent-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-in zoom-in-50 duration-200">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-border/50 bg-card px-4 py-3 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleNavClick(item.href)}
              className="block w-full text-left text-sm font-semibold text-foreground py-2.5 hover:text-accent transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
