import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { X, Zap, Truck, CheckCircle, MapPin, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import {
  Dialog,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog";

interface FlashOfferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedColor: number;
  selectedSize: number | null;
}

type ModalStep = "cep" | "loading" | "approved";

interface CepData {
  localidade: string;
  uf: string;
}

let timerEndTimestamp: number | null = null;

const TIMER_DURATION = 10 * 60 * 1000;

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

const FlashOfferModal = ({ open, onOpenChange, selectedColor, selectedSize }: FlashOfferModalProps) => {
  const navigate = useNavigate();
  const { addItem, items } = useCart();
  const [cep, setCep] = useState("");
  const [step, setStep] = useState<ModalStep>("cep");
  const [cepData, setCepData] = useState<CepData | null>(null);
  const [cepError, setCepError] = useState("");
  const [timeLeft, setTimeLeft] = useState(600);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (open) {
      if (!timerEndTimestamp) {
        timerEndTimestamp = Date.now() + TIMER_DURATION;
      }

      const tick = () => {
        const remaining = Math.max(0, Math.round((timerEndTimestamp! - Date.now()) / 1000));
        setTimeLeft(remaining);
        if (remaining <= 0 && timerRef.current) {
          clearInterval(timerRef.current);
        }
      };

      tick();
      timerRef.current = setInterval(tick, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [open]);

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 8) value = value.slice(0, 8);
    if (value.length > 5) {
      value = value.slice(0, 5) + "-" + value.slice(5);
    }
    setCep(value);
    setCepError("");
  };

  const handleSubmitCep = async () => {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) return;

    setStep("loading");
    setCepError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cep-lookup?cep=${cleanCep}`, {
        headers: { "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
      });
      const data = await response.json();

      if (data.erro) {
        setStep("cep");
        setCepError("CEP não encontrado. Verifique e tente novamente.");
        return;
      }

      setCepData({ localidade: data.localidade, uf: data.uf });
    } catch {
      setStep("cep");
      setCepError("Erro ao consultar o CEP. Tente novamente.");
      return;
    }

    setTimeout(() => {
      setStep("approved");
    }, 2000);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep("cep");
      setCep("");
      setCepData(null);
      setCepError("");
    }, 300);
  };

  const handleBuyWithFrete = () => {
    if (selectedSize !== null) {
      const alreadyInCart = items.some(
        (item) => item.colorIndex === selectedColor && item.size === selectedSize
      );
      if (!alreadyInCart) {
        addItem(selectedColor, selectedSize);
      }
    }

    onOpenChange(false);
    navigate("/checkout", {
      state: {
        cep,
        localidade: cepData?.localidade || "",
        uf: cepData?.uf || "",
      },
    });
    setTimeout(() => {
      setStep("cep");
      setCep("");
      setCepData(null);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogPortal>
        <DialogOverlay />
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4">
          <div className="relative w-full max-w-md mx-auto animate-in slide-in-from-bottom-4 duration-300">
            {/* Orange/red gradient header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-t-2xl px-6 py-4 text-center relative">
              <button
                onClick={handleClose}
                className="absolute right-3 top-3 text-white/80 hover:text-white transition-colors"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center justify-center gap-2 text-white font-extrabold text-lg">
                OFERTA RELÂMPAGO <Zap className="w-5 h-5 fill-white" />
              </div>
              <p className="text-white/90 text-sm mt-0.5">
                O frete full acaba em <strong className="text-yellow-200 text-base">{formatTime(timeLeft)}</strong>
              </p>
            </div>

            {/* White body */}
            <div className="bg-background rounded-b-2xl px-6 py-6 shadow-2xl">
              {step === "cep" && (
                <>
                  <div className="flex justify-center mb-4">
                    <span className="inline-flex items-center gap-2 bg-emerald-500 text-white font-bold text-sm px-5 py-2.5 rounded-full shadow-md">
                      <Truck className="w-4 h-4" />
                      FRETE FULL DISPONÍVEL
                    </span>
                  </div>

                  <h3 className="text-center text-foreground font-extrabold text-lg mb-1">
                    Entrega em até 2 dias úteis!
                  </h3>
                  <p className="text-center text-muted-foreground text-sm mb-5">
                    Digite seu CEP para verificar se sua região é elegível para o{" "}
                    <span className="text-emerald-600 font-semibold">Frete Full</span> gratuito
                  </p>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Seu CEP
                    </label>
                    <input
                      type="text"
                      value={cep}
                      onChange={handleCepChange}
                      placeholder="00000-000"
                      className={`w-full border rounded-lg px-4 py-3 text-center text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent bg-background ${cepError ? "border-destructive" : "border-border"}`}
                    />
                    {cepError && (
                      <p className="text-destructive text-xs font-medium mt-1.5 text-center">{cepError}</p>
                    )}
                  </div>

                  <button
                    onClick={handleSubmitCep}
                    disabled={cep.replace(/\D/g, "").length !== 8}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 rounded-full text-base hover:brightness-110 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Aprovar Frete Full
                  </button>
                </>
              )}

              {step === "loading" && (
                <div className="flex flex-col items-center justify-center py-10">
                  <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
                  <p className="text-foreground font-bold text-lg">Verificando seu CEP...</p>
                  <p className="text-muted-foreground text-sm mt-1">Consultando disponibilidade na sua região</p>
                </div>
              )}

              {step === "approved" && cepData && (
                <div className="animate-in fade-in-0 zoom-in-95 duration-300">
                  <div className="flex justify-center mb-3">
                    <CheckCircle className="w-14 h-14 text-emerald-500" />
                  </div>

                  <h3 className="text-center text-emerald-600 font-extrabold text-xl mb-4">
                    Frete Full Aprovado! 🎉
                  </h3>

                  <div className="bg-secondary rounded-xl px-5 py-4 mb-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-foreground font-bold text-base mb-1">
                      <MapPin className="w-4 h-4" />
                      {cepData.localidade} - {cepData.uf}
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Sua região está elegível para entrega expressa
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl px-5 py-4 mb-5 text-center">
                    <p className="text-white text-xs font-semibold flex items-center justify-center gap-1 mb-1">
                      <Zap className="w-3.5 h-3.5 fill-white" />
                      ENTREGA GARANTIDA EM:
                    </p>
                    <p className="text-white font-black text-2xl">ATÉ 2 DIAS ÚTEIS</p>
                    <p className="text-white/80 text-xs mt-1">100% Grátis • Sem taxas adicionais</p>
                  </div>

                  <button
                    onClick={handleBuyWithFrete}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-full text-base transition-all shadow-lg mb-3"
                  >
                    Comprar com Frete FULL
                  </button>
                  <button
                    onClick={handleClose}
                    className="w-full text-muted-foreground text-sm font-medium py-2 hover:text-foreground transition-colors underline underline-offset-2"
                  >
                    Quero adicionar mais
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogPortal>
    </Dialog>
  );
};

export default FlashOfferModal;
