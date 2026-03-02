import { useState, useRef, useEffect, useMemo } from "react";
import { Star, ChevronLeft, ChevronRight, ShoppingCart, Truck, Shield, Zap, MessageCircle, X, Check } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import FlashOfferModal from "./FlashOfferModal";

// ─── Data ────────────────────────────────────────────────────────────────────

const HERO_VIDEOS = ["/videos/hero-video.mp4", "/videos/hero-video-2.mp4"];
const SIZE_TABLE_IMG = "/images/tabela-tamanhos.png";
const SIZES = [34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45] as const;

interface ColorOption {
  key: string;
  name: string;
  images: string[]; // first image = thumbnail
}

const COLORS: ColorOption[] = [
  { key: "azul",   name: "Azul",   images: ["/images/azul1.webp",   "/images/azul2.webp",   "/images/azul3.webp"] },
  { key: "bege",   name: "Bege",   images: ["/images/bege1.webp",   "/images/bege2.webp",   "/images/bege3.webp"] },
  { key: "branco", name: "Branco", images: ["/images/branco1.webp", "/images/branco2.webp", "/images/branco3.webp"] },
  { key: "rosa",   name: "Rosa",   images: ["/images/rosa1.webp",   "/images/rosa2.webp",   "/images/rosa3.webp"] },
  { key: "verde",  name: "Verde",  images: ["/images/verde1.webp",  "/images/verde2.webp",  "/images/verde3.webp"] },
];

interface Slide {
  type: "video" | "image";
  src: string;
  label: string;
}

/** Build a flat slide list: [video1, video2, azul1, azul2, ...] */
function buildSlides(): { slides: Slide[]; colorStartIndex: number[] } {
  const slides: Slide[] = HERO_VIDEOS.map((src) => ({ type: "video" as const, src, label: "Vídeo" }));
  const colorStartIndex: number[] = [];

  for (const color of COLORS) {
    colorStartIndex.push(slides.length);
    for (const img of color.images) {
      slides.push({ type: "image", src: img, label: color.name });
    }
  }

  return { slides, colorStartIndex };
}

const { slides: SLIDES, colorStartIndex: COLOR_START } = buildSlides();

// ─── Image preloader ─────────────────────────────────────────────────────────

function usePreloadImages(urls: string[]) {
  useEffect(() => {
    urls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}

// ─── Component ───────────────────────────────────────────────────────────────

const ProductHero = () => {
  const { addItem } = useCart();
  const [colorIdx, setColorIdx] = useState(0);
  const [sizeVal, setSizeVal] = useState<number | null>(null);
  const [slideIdx, setSlideIdx] = useState(0);
  const [showFlash, setShowFlash] = useState(false);
  const [showSizeTable, setShowSizeTable] = useState(false);
  const [showError, setShowError] = useState(false);

  const dragStartX = useRef(0);
  const isDragging = useRef(false);
  const colorRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Preload all product images on mount
  const allImageUrls = useMemo(() => SLIDES.filter((s) => s.type === "image").map((s) => s.src), []);
  usePreloadImages(allImageUrls);

  // Autoplay video when it's visible
  // Play/pause videos based on active slide
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (SLIDES[slideIdx]?.type === "video" && SLIDES[slideIdx]?.src === video.src) {
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [slideIdx]);

  const slide = SLIDES[slideIdx];
  const totalSlides = SLIDES.length;

  // ─── Handlers ────────────────────────────────────────────────────────────

  const goNext = () => setSlideIdx((i) => (i + 1) % totalSlides);
  const goPrev = () => setSlideIdx((i) => (i - 1 + totalSlides) % totalSlides);

  const selectColor = (idx: number) => {
    setColorIdx(idx);
    setSlideIdx(COLOR_START[idx]);
  };

  const selectSize = (size: number) => {
    setSizeVal(size);
    setShowError(false);
  };

  const validateSelection = (): boolean => {
    if (sizeVal === null) {
      setShowError(true);
      colorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
    }
    setShowError(false);
    return true;
  };

  const handleBuyNow = () => {
    if (!validateSelection()) return;
    setShowFlash(true);
  };

  const handleAddToCart = () => {
    if (!validateSelection()) return;
    addItem(colorIdx, sizeVal!);
    toast.success(`${COLORS[colorIdx].name} - Tam. ${sizeVal} adicionado ao carrinho!`, {
      icon: <Check className="w-4 h-4" />,
    });
  };

  // Touch swipe
  const onTouchStart = (e: React.TouchEvent) => { dragStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = dragStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? goNext() : goPrev();
  };

  // Mouse drag
  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
  };
  const onMouseUp = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const diff = dragStartX.current - e.clientX;
    if (Math.abs(diff) > 50) diff > 0 ? goNext() : goPrev();
  };
  const onMouseLeave = () => { isDragging.current = false; };

  return (
    <section id="inicio" className="container px-4 pt-5 pb-6">
      {/* Badges */}
      <div className="flex gap-2 mb-3">
        <span className="text-[10px] font-bold text-success uppercase tracking-wider">● Oferta Exclusiva</span>
        <span className="text-[10px] font-bold text-accent uppercase tracking-wider">🔥 Em Alta</span>
      </div>

      {/* Title */}
      <h1 className="text-[22px] font-extrabold text-foreground leading-tight mb-1 tracking-tight">
        Tênis Carbon Marathon Chunta – Placa de Carbono Ultra Leve
      </h1>
      <p className="text-sm text-muted-foreground mb-3">Tecnologia de Placa de Carbono</p>

      {/* Rating */}
      <div className="flex items-center gap-2 mb-5 text-sm">
        <div className="flex items-center gap-1">
          <div className="flex">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-star text-star" />
            ))}
          </div>
          <span className="font-bold text-foreground">4.9</span>
        </div>
        <span className="text-border">•</span>
        <span className="text-muted-foreground flex items-center gap-1">
          <MessageCircle className="w-3.5 h-3.5" /> 548
        </span>
        <span className="text-border">•</span>
        <span className="text-muted-foreground font-semibold">4mil+ vendidos</span>
      </div>

      {/* ─── Carousel ──────────────────────────────────────────────────────── */}
      <div
        className="relative rounded-2xl overflow-hidden mb-5 aspect-square max-w-lg mx-auto bg-card shadow-sm select-none cursor-grab active:cursor-grabbing"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        {/* Render ALL slides stacked; only the active one is visible */}
        {SLIDES.map((s, i) => (
          s.type === "video" ? (
            <video
              key={i}
              ref={(el) => { videoRefs.current[i] = el; }}
              src={s.src}
              className={`absolute inset-0 w-full h-full object-cover ${i === slideIdx ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}
              loop playsInline preload="metadata"
              style={{ pointerEvents: "none" }}
            />
          ) : (
            <img
              key={i}
              src={s.src}
              alt={`Tênis ${s.label}`}
              className={`absolute inset-0 w-full h-full object-cover ${i === slideIdx ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}
            />
          )
        ))}

        <button
          onClick={goPrev}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 bg-card/80 backdrop-blur-md rounded-full p-2 shadow-lg hover:bg-card transition-colors"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-4 h-4 text-foreground" />
        </button>
        <button
          onClick={goNext}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 bg-card/80 backdrop-blur-md rounded-full p-2 shadow-lg hover:bg-card transition-colors"
          aria-label="Próximo"
        >
          <ChevronRight className="w-4 h-4 text-foreground" />
        </button>

        <div className="absolute top-3 right-3 z-20 bg-foreground/70 backdrop-blur-sm text-background text-[11px] font-bold px-2.5 py-1 rounded-full">
          {slideIdx + 1}/{totalSlides}
        </div>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlideIdx(i)}
              className={`rounded-full ${
                i === slideIdx ? "bg-accent w-6 h-2 shadow-md" : "bg-card/60 w-2 h-2"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ─── Color selector ────────────────────────────────────────────────── */}
      <div ref={colorRef} className="bg-card rounded-xl p-4 mb-3 shadow-sm border border-border/60">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-bold text-foreground">Cor:</span>
          <span className="text-sm text-accent font-semibold">{COLORS[colorIdx].name}</span>
        </div>
        {showError && (
          <p className="text-destructive text-xs font-semibold mb-2">⚠️ Selecione uma cor e um número antes de comprar</p>
        )}
        <div className="grid grid-cols-5 gap-2.5">
          {COLORS.map((color, i) => (
            <button
              key={color.key}
              onClick={() => selectColor(i)}
              className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                i === colorIdx
                  ? "border-accent ring-2 ring-accent/20 scale-105"
                  : "border-border/40 hover:border-border"
              }`}
            >
              <img src={color.images[0]} alt={color.name} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* ─── Size selector ─────────────────────────────────────────────────── */}
      <div className="bg-card rounded-xl p-4 mb-3 shadow-sm border border-border/60">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-foreground">Tamanho:</span>
          <button onClick={() => setShowSizeTable(true)} className="text-xs text-accent font-semibold hover:underline">
            📐 Guia de medidas
          </button>
        </div>
        <div className="grid grid-cols-6 gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => selectSize(size)}
              className={`py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                sizeVal === size
                  ? "bg-accent text-accent-foreground shadow-md scale-105"
                  : "bg-secondary text-foreground hover:bg-muted"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Price ─────────────────────────────────────────────────────────── */}
      <div id="comprar" className="scroll-mt-20 bg-card rounded-xl p-5 mb-4 shadow-sm border border-border/60">
        <div className="flex items-baseline gap-2.5 mb-1">
          <span className="text-[32px] font-black text-foreground tracking-tight">R$ 77,12</span>
          <span className="text-sm text-muted-foreground line-through">R$ 329,90</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-success text-success-foreground text-[11px] font-extrabold px-2 py-0.5 rounded">-63%</span>
          <span className="text-sm text-muted-foreground">à vista no PIX</span>
        </div>
        <p className="text-sm font-bold text-success flex items-center gap-1.5">💰 Economize R$ 252,78</p>
      </div>

      {/* ─── Benefits ──────────────────────────────────────────────────────── */}
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

      {/* ─── CTA ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        <button
          onClick={handleBuyNow}
          className="w-full bg-success text-success-foreground font-extrabold py-4 rounded-xl text-base animate-pulse-cta hover:brightness-110 transition-all shadow-lg"
        >
          🛒 Comprar agora
        </button>
        <button
          onClick={handleAddToCart}
          className="w-full border-2 border-success text-success font-bold py-3.5 rounded-xl text-base flex items-center justify-center gap-2 hover:bg-success/5 transition-colors"
        >
          <ShoppingCart className="w-5 h-5" />
          Adicionar ao carrinho
        </button>
      </div>

      {/* ─── Size Table Modal ──────────────────────────────────────────────── */}
      {showSizeTable && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setShowSizeTable(false)}>
          <button
            onClick={() => setShowSizeTable(false)}
            className="absolute top-4 right-4 text-background text-3xl font-light z-10 w-10 h-10 flex items-center justify-center"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={SIZE_TABLE_IMG}
            alt="Tabela de Tamanhos"
            className="max-h-[85vh] max-w-[95vw] object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <FlashOfferModal
        open={showFlash}
        onOpenChange={setShowFlash}
        selectedColor={colorIdx}
        selectedSize={sizeVal}
      />
    </section>
  );
};

export default ProductHero;
