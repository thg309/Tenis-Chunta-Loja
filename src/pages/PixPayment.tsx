import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, Copy, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const PixPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pixData = location.state as {
    qrcode: string | null;
    url: string | null;
    expirationDate: string | null;
    amount: number;
    transactionId: string;
  } | null;

  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!pixData) {
      navigate("/checkout");
      return;
    }

    if (pixData.expirationDate) {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const expiry = new Date(pixData.expirationDate!).getTime();
        const diff = expiry - now;

        if (diff <= 0) {
          setTimeLeft("Expirado");
          clearInterval(interval);
          return;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [pixData, navigate]);

  if (!pixData) return null;

  const pixCode = pixData.url || pixData.qrcode;

  const handleCopyCode = async () => {
    if (pixCode) {
      try {
        await navigator.clipboard.writeText(pixCode);
        setCopied(true);
        toast.success("Código PIX copiado!");
        setTimeout(() => setCopied(false), 3000);
      } catch {
        toast.error("Erro ao copiar código");
      }
    }
  };

  const amountFormatted = (pixData.amount / 100).toFixed(2).replace(".", ",");

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
            <p className="text-sm text-muted-foreground mt-1">
              Copie o código abaixo para pagar
            </p>
          </div>

          {timeLeft && (
            <div className="flex items-center justify-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-accent" />
              <span className={`font-semibold ${timeLeft === "Expirado" ? "text-destructive" : "text-accent"}`}>
                {timeLeft === "Expirado" ? "PIX expirado" : `Expira em ${timeLeft}`}
              </span>
            </div>
          )}
        </div>

        {pixCode && (
          <div className="bg-background rounded-xl p-4 border border-border space-y-3">
            <p className="text-sm font-bold text-foreground">📋 PIX Copia e Cola</p>
            <div className="bg-secondary rounded-lg p-3 text-xs text-muted-foreground break-all font-mono max-h-20 overflow-y-auto">
              {pixCode}
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
