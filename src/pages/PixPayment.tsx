import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, Copy, CheckCircle, Clock, AlertCircle, Loader2 } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const POLL_INTERVAL = 7000; // 7 seconds
const MAX_POLL_DURATION = 15 * 60 * 1000; // 15 minutes

const PixPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pixData = location.state as {
    pixCode: string;
    transactionId: string;
    amount: number;
  } | null;

  const [copied, setCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"PENDING" | "COMPLETED">("PENDING");
  const [timeLeft, setTimeLeft] = useState("");
  const pollStartRef = useRef(Date.now());
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const checkStatus = useCallback(async () => {
    if (!pixData?.transactionId) return;

    try {
      const { data, error } = await supabase.functions.invoke("pix-status", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        body: undefined,
      });

      // Use GET with query param via fetch directly
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/pix-status?transactionId=${encodeURIComponent(pixData.transactionId)}`,
        {
          method: "GET",
          headers: {
            "apikey": anonKey,
            "Authorization": `Bearer ${anonKey}`,
          },
        }
      );
      const statusData = await res.json();

      if (statusData.status === "COMPLETED" || statusData.paid) {
        setPaymentStatus("COMPLETED");
        if (pollRef.current) {
          clearInterval(pollRef.current);
          pollRef.current = null;
        }
        toast.success("Pagamento confirmado! 🎉");
      }
    } catch (err) {
      console.error("Status check error:", err);
    }
  }, [pixData?.transactionId]);

  // Realtime subscription for instant confirmation
  useEffect(() => {
    if (!pixData?.transactionId) return;

    const channel = supabase
      .channel(`pix-${pixData.transactionId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "pix_transactions",
          filter: `transaction_id=eq.${pixData.transactionId}`,
        },
        (payload: any) => {
          if (payload.new?.status === "COMPLETED" && payload.new?.paid) {
            setPaymentStatus("COMPLETED");
            if (pollRef.current) {
              clearInterval(pollRef.current);
              pollRef.current = null;
            }
            toast.success("Pagamento confirmado! 🎉");
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [pixData?.transactionId]);

  // Polling fallback
  useEffect(() => {
    if (!pixData?.transactionId || paymentStatus === "COMPLETED") return;

    pollStartRef.current = Date.now();
    pollRef.current = setInterval(() => {
      if (Date.now() - pollStartRef.current > MAX_POLL_DURATION) {
        if (pollRef.current) clearInterval(pollRef.current);
        return;
      }
      checkStatus();
    }, POLL_INTERVAL);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [pixData?.transactionId, paymentStatus, checkStatus]);

  // Expiration timer (15 min from now)
  useEffect(() => {
    if (!pixData) {
      navigate("/checkout");
      return;
    }

    const expiresAt = Date.now() + MAX_POLL_DURATION;
    const interval = setInterval(() => {
      const diff = expiresAt - Date.now();
      if (diff <= 0) {
        setTimeLeft("Expirado");
        clearInterval(interval);
        return;
      }
      const minutes = Math.floor(diff / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [pixData, navigate]);

  if (!pixData) return null;

  const handleCopyCode = async () => {
    if (pixData.pixCode) {
      try {
        await navigator.clipboard.writeText(pixData.pixCode);
        setCopied(true);
        toast.success("Código PIX copiado!");
        setTimeout(() => setCopied(false), 3000);
      } catch {
        toast.error("Erro ao copiar código");
      }
    }
  };

  const amountFormatted = (pixData.amount / 100).toFixed(2).replace(".", ",");

  if (paymentStatus === "COMPLETED") {
    return (
      <div className="min-h-screen bg-secondary">
        <header className="sticky top-0 z-50 bg-background border-b border-border">
          <div className="container flex items-center justify-between h-14 px-4">
            <button onClick={() => navigate("/")} className="text-foreground" aria-label="Voltar">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-black tracking-tight">
              <span className="text-accent">WORLD</span>
              <span className="text-foreground"> TENNIS</span>
            </h1>
            <div className="w-5" />
          </div>
        </header>
        <main className="container max-w-lg mx-auto px-4 py-12 text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-black text-foreground">Pagamento Confirmado!</h2>
          <p className="text-muted-foreground">
            Seu pagamento de <strong className="text-accent">R$ {amountFormatted}</strong> foi confirmado com sucesso.
          </p>
          <p className="text-sm text-muted-foreground">Você receberá os detalhes do pedido por e-mail.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-3 px-8 rounded-xl text-sm transition-all"
          >
            Voltar para a loja
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary">
      <header className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="container flex items-center justify-between h-14 px-4">
          <button onClick={() => navigate("/checkout")} className="text-foreground" aria-label="Voltar">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-black tracking-tight">
            <span className="text-accent">WORLD</span>
            <span className="text-foreground"> TENNIS</span>
          </h1>
          <div className="w-5" />
        </div>
      </header>

      <main className="container max-w-lg mx-auto px-4 py-6 space-y-4">
        <div className="bg-background rounded-xl p-6 border border-border text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">PIX gerado com sucesso!</h2>
            <p className="text-sm text-muted-foreground mt-1">Copie o código abaixo para pagar</p>
          </div>

          {timeLeft && (
            <div className="flex items-center justify-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-accent" />
              <span className={`font-semibold ${timeLeft === "Expirado" ? "text-destructive" : "text-accent"}`}>
                {timeLeft === "Expirado" ? "PIX expirado" : `Expira em ${timeLeft}`}
              </span>
            </div>
          )}

          {/* Polling status indicator */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="w-3 h-3 animate-spin" />
            Aguardando pagamento...
          </div>
        </div>

        {pixData.pixCode && (
          <div className="bg-background rounded-xl p-4 border border-border space-y-3">
            <p className="text-sm font-bold text-foreground">📋 PIX Copia e Cola</p>
            <div className="bg-secondary rounded-lg p-3 text-xs text-muted-foreground break-all font-mono max-h-20 overflow-y-auto">
              {pixData.pixCode}
            </div>
            <button
              onClick={handleCopyCode}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-4 rounded-xl text-base transition-all flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copiar código PIX
                </>
              )}
            </button>
          </div>
        )}

        <div className="bg-background rounded-xl p-4 border border-border">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Valor a pagar</span>
            <span className="text-lg font-bold text-accent">R$ {amountFormatted}</span>
          </div>
        </div>

        <div className="bg-background rounded-xl p-4 border border-border space-y-3">
          <p className="text-sm font-bold text-foreground flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-accent" />
            Como pagar
          </p>
          <ol className="text-xs text-muted-foreground space-y-2 list-decimal list-inside">
            <li>Abra o app do seu banco ou carteira digital</li>
            <li>Escolha a opção <strong>PIX</strong></li>
            <li>Cole o código copiado</li>
            <li>Confirme o pagamento</li>
          </ol>
          <p className="text-xs text-emerald-600 font-medium">
            ✅ O pagamento é confirmado instantaneamente
          </p>
        </div>
      </main>
    </div>
  );
};

export default PixPayment;
