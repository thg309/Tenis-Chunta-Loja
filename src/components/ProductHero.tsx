import { useState, useRef, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, ShoppingCart, Truck, Shield, Zap, MessageCircle, X, Check } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import FlashOfferModal from "./FlashOfferModal";

const heroVideoUrl = "/videos/hero-video.mp4";

// Placeholder images - user needs to upload actual shoe images
const shoeGreen = "/placeholder.svg";
const shoeSalmon = "/placeholder.svg";
const shoeWhiteBlue = "/placeholder.svg";
const shoeWhiteOrange = "/placeholder.svg";
const shoeBlue = "/images/shoe-blue-1.webp";
const tabelaTamanhos = "/placeholder.svg";

const slides: { type: "video" | "image"; src: string; name: string }[] = [
  { type: "video", src: heroVideoUrl, name: "Vídeo" },
  { type: "image", src: shoeBlue, name: "Azul" },
  { type: "image", src: shoeSalmon, name: "Bege" },
  { type: "image", src: shoeWhiteBlue, name: "Branco" },
  { type: "image", src: shoeWhiteOrange, name: "Rosa" },
  { type: "image", src: shoeGreen, name: "Verde" },
];

const shoes = [
  { src: shoeBlue, name: "Azul" },
  { src: shoeSalmon, name: "Bege" },
  { src: shoeWhiteBlue, name: "Branco" },
  { src: shoeWhiteOrange, name: "Rosa" },
  { src: shoeGreen, name: "Verde" },
];

const sizes = [34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45];

const ProductHero = () => {
  const { addItem } = useCart();
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [showFlashOffer, setShowFlashOffer] = useState(false);
  const [showSizeTable, setShowSizeTable] = useState(false);
  const [validationError, setValidationError] = useState(false);
  const touchStartX = useRef(0);
  const colorSectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || slides[currentImage]?.type !== "video") return;

    const attemptAutoplay = async () => {
      try {
        video.muted = true;
        await video.play();
      } catch {
        // Autoplay blocked
      }
    };

    attemptAutoplay();
  }, [currentImage]);

  const handleBuyNow = () => {
    if (selectedSize === null) {
      setValidationError(true);
      colorSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setValidationError(false);
    setShowFlashOffer(true);
  };

  const handleColorSelect = (index: number) => {
    setSelectedColor(index);
    setCurrentImage(index + 1);
  };

  const handleSizeSelect = (size: number) => {
    setSelectedSize(size);
    setValidationError(false);
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % slides.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? nextImage() : prevImage();
    }
  };

  return (
    <section id="inicio" className="container px-4 pt-5 pb-6">
      {/* Badges */}
      <div className="flex gap-2 mb-3">
        <span className="text-[10px] font-bold text-success uppercase tracking-wider">
          ● Oferta Exclusiva
        </span>
        <span className="text-[10px] font-bold text-accent uppercase tracking-wider">
          🔥 Em Alta
        </span>
      </div>

      {/* Title */}
      <h1 className="text-[22px] font-extrabold text-foreground leading-tight mb-1 tracking-tight">
        Tênis Carbon Marathon Chunta - Placa de Carbono Ultra Leve
      </h1>
      <p className="text-sm text-muted-foreground mb-3">Tecnologia de Placa de Carbono</p>

      {/* Rating + Stats */}
      <div className="flex items-center gap-2 mb-5 text-sm">
        <div className="flex items-center gap-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${i < 5 ? "fill-star text-star" : "text-muted"}`}
              />
            ))}
          </div>
          <span className="font-bold text-foreground">4.9</span>
        </div>
        <span className="text-border">•</span>
        <span className="text-muted-foreground flex items-center gap-1">
          <MessageCircle className="w-3.5 h-3.5" />
          548
        </span>
        <span className="text-border">•</span>
        <span className="text-muted-foreground font-semibold">4mil+ vendidos</span>
      </div>

      {/* Carousel */}
      <div
        className="relative rounded-2xl overflow-hidden mb-5 aspect-square max-w-lg mx-auto bg-card shadow-sm"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {slides[currentImage].type === "video" ? (
          <video
            ref={videoRef}
            src={slides[currentImage].src}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          />
        ) : (
          <img
            src={slides[currentImage].src}
            alt={`Tênis ${slides[currentImage].name}`}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
        )}
        <button
          onClick={prevImage}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 bg-card/80 backdrop-blur-md rounded-full p-2 shadow-lg hover:bg-card transition-colors"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-4 h-4 text-foreground" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-card/80 backdrop-blur-md rounded-full p-2 shadow-lg hover:bg-card transition-colors"
          aria-label="Próximo"
        >
          <ChevronRight className="w-4 h-4 text-foreground" />
        </button>

        <div className="absolute top-3 right-3 bg-foreground/70 backdrop-blur-sm text-background text-[11px] font-bold px-2.5 py-1 rounded-full">
          {currentImage + 1}/{slides.length}
        </div>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentImage(i)}
              className={`rounded-full transition-all duration-300 ${
                i === currentImage
                  ? "bg-accent w-6 h-2 shadow-md"
                  : "bg-card/60 w-2 h-2"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Color selector */}
      <div ref={colorSectionRef} className="bg-card rounded-xl p-4 mb-3 shadow-sm border border-border/60">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-bold text-foreground">Cor:</span>
          <span className="text-sm text-accent font-semibold">{shoes[selectedColor].name}</span>
        </div>
        {validationError && (
          <p className="text-destructive text-xs font-semibold mb-2">⚠️ Selecione uma cor e um número antes de comprar</p>
        )}
        <div className="grid grid-cols-5 gap-2.5">
          {shoes.map((shoe, i) => (
            <button
              key={i}
              onClick={() => handleColorSelect(i)}
              className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                i === selectedColor
                  ? "border-accent ring-2 ring-accent/20 scale-105"
                  : "border-border/40 hover:border-border"
              }`}
            >
              <img src={shoe.src} alt={shoe.name} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Size selector */}
      <div className="bg-card rounded-xl p-4 mb-3 shadow-sm border border-border/60">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-foreground">Tamanho:</span>
          <button
            onClick={() => setShowSizeTable(true)}
            className="text-xs text-accent font-semibold hover:underline"
          >
            📐 Guia de medidas
          </button>
        </div>
        <div className="grid grid-cols-6 gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => handleSizeSelect(size)}
              className={`py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                selectedSize === size
                  ? "bg-accent text-accent-foreground shadow-md scale-105"
                  : "bg-secondary text-foreground hover:bg-muted"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div id="comprar" className="scroll-mt-20 bg-card rounded-xl p-5 mb-4 shadow-sm border border-border/60">
        <div className="flex items-baseline gap-2.5 mb-1">
          <span className="text-[32px] font-black text-foreground tracking-tight">R$ 77,12</span>
          <span className="text-sm text-muted-foreground line-through">R$ 329,90</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-success text-success-foreground text-[11px] font-extrabold px-2 py-0.5 rounded">-63%</span>
          <span className="text-sm text-muted-foreground">à vista no PIX</span>
        </div>
        <p className="text-sm font-bold text-success flex items-center gap-1.5">
          💰 Economize R$ 252,78
        </p>
      </div>

      {/* Benefits */}
      <div className="bg-card rounded-xl p-4 mb-6 shadow-sm border border-border/60 space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4 text-success" />
          </div>
          <div>
            <span className="font-bold text-foreground">Frete grátis</span>
            <span className="text-muted-foreground"> para todo o Brasil</span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-accent" />
          </div>
          <div>
            <span className="font-bold text-foreground">Envio rápido</span>
            <span className="text-muted-foreground"> — Capitais em até 2 dias</span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Shield className="w-4 h-4 text-primary" />
          </div>
          <div>
            <span className="font-bold text-foreground">Garantia 90 dias</span>
            <span className="text-muted-foreground"> contra defeitos</span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-destructive fill-destructive" />
          </div>
          <span className="text-destructive font-bold">Apenas 19 pares disponíveis</span>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col gap-3">
        <button
          onClick={handleBuyNow}
          className="w-full bg-success text-success-foreground font-extrabold py-4 rounded-xl text-base animate-pulse-cta hover:brightness-110 transition-all shadow-lg"
        >
          🛒 Comprar agora
        </button>
        <button
          onClick={() => {
            if (selectedSize === null) {
              setValidationError(true);
              colorSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
              return;
            }
            setValidationError(false);
            addItem(selectedColor, selectedSize);
            toast.success(`${shoes[selectedColor].name} - Tam. ${selectedSize} adicionado ao carrinho!`, {
              icon: <Check className="w-4 h-4" />,
            });
          }}
          className="w-full border-2 border-success text-success font-bold py-3.5 rounded-xl text-base flex items-center justify-center gap-2 hover:bg-success/5 transition-colors"
        >
          <ShoppingCart className="w-5 h-5" />
          Adicionar ao carrinho
        </button>
      </div>

      {/* Size Table Modal */}
      {showSizeTable && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setShowSizeTable(false)}
        >
          <button
            onClick={() => setShowSizeTable(false)}
            className="absolute top-4 right-4 text-background text-3xl font-light z-10 w-10 h-10 flex items-center justify-center"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={tabelaTamanhos}
            alt="Tabela de Tamanhos"
            className="max-h-[85vh] max-w-[95vw] object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <FlashOfferModal
        open={showFlashOffer}
        onOpenChange={setShowFlashOffer}
        selectedColor={selectedColor}
        selectedSize={selectedSize}
      />
    </section>
  );
};

export default ProductHero;
