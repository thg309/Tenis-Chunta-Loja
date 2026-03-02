import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ChevronLeft, Lock, Trash2, Minus, Plus, Zap, MapPin, User, Star,
  Shield, CheckCircle, Loader2, CreditCard
} from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { Progress } from "@/components/ui/progress";

const testimonials = [
  {
    text: "Encontrei pelo TikTok, paguei via PIX e recebi antes do prazo. Excelente!",
    author: "Marcelo R.",
  },
  {
    text: "Melhor tênis que já comprei! Super leve e confortável para corrida.",
    author: "Ana Paula S.",
  },
  {
    text: "Entrega rápida e produto de qualidade. Recomendo demais!",
    author: "Carlos M.",
  },
];

interface CheckoutLocationState {
  cep?: string;
  localidade?: string;
  uf?: string;
}

const steps = [
  { icon: User, label: "Dados" },
  { icon: MapPin, label: "Endereço" },
  { icon: CreditCard, label: "Pagamento" },
];

const InputField = React.forwardRef<
  HTMLInputElement,
  {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    maxLength?: number;
    suffix?: React.ReactNode;
    hasError?: boolean;
    errorMessage?: string;
  }
>(({ label, value, onChange, type = "text", maxLength, suffix, hasError, errorMessage }, ref) => (
  <div>
    <div className="relative">
      <input
        ref={ref}
        type={type}
        placeholder={label}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        className={`w-full border rounded-lg py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent bg-background transition-all ${
          hasError ? "border-destructive ring-1 ring-destructive/30" : "border-border"
        }`}
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2">{suffix}</span>
      )}
    </div>
    {hasError && errorMessage && (
      <p className="text-destructive text-[11px] font-medium mt-0.5 ml-1">{errorMessage}</p>
    )}
  </div>
));
InputField.displayName = "InputField";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, totalPrice } = useCart();
  const state = (location.state as CheckoutLocationState) || {};

  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showErrors, setShowErrors] = useState(false);

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");

  const [cep, setCep] = useState(state.cep || "");
  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState(state.localidade || "");
  const [uf, setUf] = useState(state.uf || "");
  const [addressLoaded, setAddressLoaded] = useState(false);
  const [cepNotFound, setCepNotFound] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nomeRef = useRef<HTMLInputElement>(null);
  const cpfRef = useRef<HTMLInputElement>(null);
  const telefoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const cepRef = useRef<HTMLInputElement>(null);
  const logradouroRef = useRef<HTMLInputElement>(null);
  const numeroRef = useRef<HTMLInputElement>(null);
  const bairroRef = useRef<HTMLInputElement>(null);
  const cidadeRef = useRef<HTMLInputElement>(null);
  const ufRef = useRef<HTMLInputElement>(null);

  const validateCpf = (raw: string): boolean => {
    const digits = raw.replace(/\D/g, "");
    if (digits.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(digits)) return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i);
    let check = 11 - (sum % 11);
    if (check >= 10) check = 0;
    if (parseInt(digits[9]) !== check) return false;
    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i);
    check = 11 - (sum % 11);
    if (check >= 10) check = 0;
    return parseInt(digits[10]) === check;
  };

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const nomeError = nome.trim().length === 0 ? "Informe seu nome" : nome.trim().split(/\s+/).length < 2 ? "Informe nome e sobrenome" : "";
  const cpfError = cpf.replace(/\D/g, "").length === 0 ? "Informe seu CPF" : cpf.replace(/\D/g, "").length < 11 ? "CPF incompleto" : !validateCpf(cpf) ? "CPF inválido" : "";
  const telefoneError = telefone.replace(/\D/g, "").length === 0 ? "Informe seu telefone" : telefone.replace(/\D/g, "").length < 10 ? "Telefone incompleto" : "";
  const emailError = email.trim().length === 0 ? "Informe seu e-mail" : !emailRegex.test(email.trim()) ? "E-mail inválido" : "";
  const cepError = cep.replace(/\D/g, "").length === 0 ? "Informe seu CEP" : cep.replace(/\D/g, "").length < 8 ? "CEP incompleto" : "";
  const logradouroError = logradouro.trim().length === 0 ? "Informe a rua" : "";
  const numeroError = numero.trim().length === 0 ? "Informe o número" : "";
  const bairroError = bairro.trim().length === 0 ? "Informe o bairro" : "";
  const cidadeError = cidade.trim().length === 0 ? "Informe a cidade" : "";
  const ufError = uf.trim().length === 0 ? "Informe o UF" : uf.trim().length !== 2 ? "UF inválido" : "";

  const isNomeValid = nomeError === "";
  const isCpfValid = cpfError === "";
  const isTelefoneValid = telefoneError === "";
  const isEmailValid = emailError === "";
  const isCepValid = cepError === "";
  const isLogradouroValid = logradouroError === "";
  const isNumeroValid = numeroError === "";
  const isBairroValid = bairroError === "";
  const isCidadeValid = cidadeError === "";
  const isUfValid = ufError === "";

  const personalDataFilled = isNomeValid && isCpfValid && isTelefoneValid && isEmailValid;
  const addressFilled = isCepValid && isLogradouroValid && isNumeroValid && isBairroValid && isCidadeValid && isUfValid;
  const currentStep = addressFilled ? 2 : personalDataFilled ? 1 : 0;
  const progressPercent = addressFilled ? 100 : personalDataFilled ? 60 : 20;

  const isFormValid = personalDataFilled && addressFilled;

  useEffect(() => {
    if (items.length === 0) {
      navigate("/");
    }
  }, [items.length, navigate]);

  useEffect(() => {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length === 8) {
      setCepNotFound(false);
      fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
        .then((res) => res.json())
        .then((data) => {
          if (data.erro) {
            setCepNotFound(true);
            setAddressLoaded(false);
            setLogradouro("");
            setBairro("");
            setCidade("");
            setUf("");
          } else {
            setCepNotFound(false);
            setLogradouro(data.logradouro || "");
            setBairro(data.bairro || "");
            setCidade(data.localidade || "");
            setUf(data.uf || "");
            setAddressLoaded(true);
          }
        })
        .catch(() => {
          setCepNotFound(true);
          setAddressLoaded(false);
        });
    } else {
      setCepNotFound(false);
    }
  }, [cep]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 8) value = value.slice(0, 8);
    if (value.length > 5) value = value.slice(0, 5) + "-" + value.slice(5);
    setCep(value);
    setAddressLoaded(false);
    setCepNotFound(false);
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 9) value = value.slice(0, 3) + "." + value.slice(3, 6) + "." + value.slice(6, 9) + "-" + value.slice(9);
    else if (value.length > 6) value = value.slice(0, 3) + "." + value.slice(3, 6) + "." + value.slice(6);
    else if (value.length > 3) value = value.slice(0, 3) + "." + value.slice(3);
    setCpf(value);
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 6) value = "(" + value.slice(0, 2) + ") " + value.slice(2, 7) + "-" + value.slice(7);
    else if (value.length > 2) value = "(" + value.slice(0, 2) + ") " + value.slice(2);
    setTelefone(value);
  };

  const scrollToFirstInvalid = () => {
    const validations: [boolean, React.RefObject<HTMLInputElement | null>][] = [
      [isNomeValid, nomeRef],
      [isCpfValid, cpfRef],
      [isTelefoneValid, telefoneRef],
      [isEmailValid, emailRef],
      [isCepValid, cepRef],
      [isLogradouroValid, logradouroRef],
      [isNumeroValid, numeroRef],
      [isBairroValid, bairroRef],
      [isCidadeValid, cidadeRef],
      [isUfValid, ufRef],
    ];

    for (const [valid, ref] of validations) {
      if (!valid && ref.current) {
        ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
        ref.current.focus();
        break;
      }
    }
  };

  const handlePayment = async () => {
    setShowErrors(true);

    if (!isFormValid) {
      toast.error("Preencha todos os campos obrigatórios");
      scrollToFirstInvalid();
      return;
    }

    setIsSubmitting(true);

    try {
      const { supabase } = await import("@/integrations/supabase/client");

      const amountInCents = Math.round(totalPrice * 100);

      const { data, error } = await supabase.functions.invoke("create-pix", {
        body: {
          amount: amountInCents,
          customer: {
            name: nome,
            cpf: cpf,
            email: email,
            phone: telefone,
          },
          items: items.map((item) => ({
            colorName: item.colorName,
            size: item.size,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
          description: `World Tennis - ${items.map((i) => `${i.quantity}x ${i.colorName} Tam.${i.size}`).join(", ")}`,
        },
      });

      if (error) throw error;

      if (!data?.pixCode && !data?.transactionId) {
        throw new Error("Resposta inválida do gateway de pagamento");
      }

      navigate("/pix", {
        state: {
          pixCode: data.pixCode,
          transactionId: data.transactionId,
          amount: amountInCents,
        },
      });
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Erro ao processar pagamento. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen bg-secondary pb-28">
      <header className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
        <div className="container flex items-center justify-between h-14 px-4 max-w-lg mx-auto">
          <button onClick={() => navigate("/")} className="text-foreground p-1" aria-label="Voltar">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <h1 className="text-base font-black tracking-tight leading-none">
              <span className="text-accent">CHECKOUT</span>
              <span className="text-foreground"> SEGURO</span>
            </h1>
          </div>
          <div className="flex items-center gap-1 text-success text-[10px] font-bold">
            <Lock className="w-3 h-3" />
            <span>SSL</span>
          </div>
        </div>
        <Progress value={progressPercent} className="h-1 rounded-none" />
      </header>

      <main className="container max-w-lg mx-auto px-4 py-4 space-y-3">
        {/* Step indicator */}
        <div className="flex items-center gap-1 bg-background rounded-xl px-5 py-3 border border-border">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    i <= currentStep
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i < currentStep ? (
                    <CheckCircle className="w-3.5 h-3.5" />
                  ) : (
                    <step.icon className="w-3 h-3" />
                  )}
                </div>
                <span className={`text-[9px] font-semibold mt-0.5 ${
                  i <= currentStep ? "text-accent" : "text-muted-foreground"
                }`}>
                  {step.label}
                </span>
              </div>
              {i < 2 && (
                <div className={`h-px flex-1 -mt-3 ${i < currentStep ? "bg-accent" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Frete */}
        <div className="flex items-center justify-between bg-success/5 rounded-lg px-3 py-2 border border-success/20">
          <div className="flex items-center gap-2 text-xs">
            <Zap className="w-3.5 h-3.5 text-success" />
            <span className="font-bold text-foreground">Frete FULL</span>
            <span className="text-muted-foreground">• 1-2 dias úteis</span>
          </div>
          <span className="text-xs font-extrabold text-success">Grátis</span>
        </div>

        {/* Form: Dados pessoais */}
        <div className="bg-background rounded-xl border border-border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">Dados pessoais</h2>
            {personalDataFilled && <CheckCircle className="w-4 h-4 text-success" />}
          </div>
          <InputField ref={nomeRef} label="Nome completo" value={nome} onChange={(e) => setNome(e.target.value)} hasError={showErrors && !isNomeValid} errorMessage={showErrors ? nomeError : ""} />
          <div className="grid grid-cols-2 gap-2.5">
            <InputField ref={cpfRef} label="CPF" value={cpf} onChange={handleCpfChange} hasError={showErrors && !isCpfValid} errorMessage={showErrors ? cpfError : ""} />
            <InputField ref={telefoneRef} label="Telefone" value={telefone} onChange={handleTelefoneChange} hasError={showErrors && !isTelefoneValid} errorMessage={showErrors ? telefoneError : ""} />
          </div>
          <InputField ref={emailRef} label="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} type="email" hasError={showErrors && !isEmailValid} errorMessage={showErrors ? emailError : ""} />
        </div>

        {/* Form: Endereço */}
        <div className="bg-background rounded-xl border border-border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">Endereço de entrega</h2>
            {addressFilled && <CheckCircle className="w-4 h-4 text-success" />}
          </div>
          <InputField ref={cepRef} label="CEP" value={cep} onChange={handleCepChange} hasError={(showErrors && !isCepValid) || cepNotFound} errorMessage={cepNotFound ? "CEP não encontrado. Verifique e digite novamente." : showErrors ? cepError : ""} suffix={addressLoaded ? <CheckCircle className="w-4 h-4 text-success" /> : undefined} />
          <InputField ref={logradouroRef} label="Rua" value={logradouro} onChange={(e) => setLogradouro(e.target.value)} hasError={showErrors && !isLogradouroValid} errorMessage={showErrors ? logradouroError : ""} />
          <div className="grid grid-cols-[1fr,1fr] gap-2.5">
            <InputField ref={numeroRef} label="Número" value={numero} onChange={(e) => setNumero(e.target.value)} hasError={showErrors && !isNumeroValid} errorMessage={showErrors ? numeroError : ""} />
            <InputField label="Complemento" value={complemento} onChange={(e) => setComplemento(e.target.value)} />
          </div>
          <InputField ref={bairroRef} label="Bairro" value={bairro} onChange={(e) => setBairro(e.target.value)} hasError={showErrors && !isBairroValid} errorMessage={showErrors ? bairroError : ""} />
          <div className="grid grid-cols-[1fr,70px] gap-2.5">
            <InputField ref={cidadeRef} label="Cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} hasError={showErrors && !isCidadeValid} errorMessage={showErrors ? cidadeError : ""} />
            <InputField ref={ufRef} label="UF" value={uf} onChange={(e) => setUf(e.target.value)} maxLength={2} hasError={showErrors && !isUfValid} errorMessage={showErrors ? ufError : ""} />
          </div>
        </div>

        {/* Resumo do pedido */}
        <div className="bg-background rounded-xl border border-border p-4">
          <h2 className="text-sm font-bold text-foreground mb-3">Resumo do pedido</h2>
          <div className="space-y-3">
            {items.map((item, idx) => (
              <div key={item.id} className={`flex gap-3 ${idx > 0 ? "pt-3 border-t border-border/50" : ""}`}>
                <div className="w-16 h-16 bg-secondary rounded-lg p-1.5 shrink-0">
                  <img src={item.image} alt={item.colorName} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">Carbon Marathon Chunta</p>
                      <p className="text-[11px] text-muted-foreground">{item.colorName} • Tam. {item.size}</p>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive transition-colors p-0.5" aria-label="Remover">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <div className="flex items-center border border-border rounded overflow-hidden">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-1.5 py-0.5 text-muted-foreground hover:text-foreground">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 py-0.5 text-xs font-bold text-foreground border-x border-border">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-1.5 py-0.5 text-muted-foreground hover:text-foreground">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-accent font-extrabold text-sm">R$ {(item.unitPrice * item.quantity).toFixed(2).replace(".", ",")}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-border/50 mt-3 pt-2.5 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground font-medium">R$ {totalPrice.toFixed(2).replace(".", ",")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Frete</span>
              <span className="text-success font-bold">Grátis</span>
            </div>
          </div>
          <div className="border-t border-border mt-2.5 pt-3 flex justify-between items-baseline">
            <span className="font-bold text-foreground">Total</span>
            <div className="text-right">
              <span className="font-black text-accent text-xl">R$ {totalPrice.toFixed(2).replace(".", ",")}</span>
              <p className="text-[10px] text-muted-foreground">à vista no PIX</p>
            </div>
          </div>
        </div>

        {/* PIX method */}
        <div className="flex items-center gap-3 bg-background rounded-xl border border-border p-3">
          <div className="w-9 h-9 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
            <CreditCard className="w-4 h-4 text-accent" />
          </div>
          <div className="flex-1">
            <span className="text-sm font-bold text-foreground">PIX</span>
            <p className="text-[11px] text-muted-foreground">Aprovação instantânea • Sem taxas</p>
          </div>
          <div className="w-4 h-4 rounded-full border-2 border-accent flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-accent" />
          </div>
        </div>

        {/* Testimonial */}
        <div className="bg-background rounded-xl border border-border p-3 text-center">
          <div className="flex justify-center mb-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-star text-star" />
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground italic">
            "{testimonials[currentTestimonial].text}"
          </p>
          <p className="text-[10px] font-semibold text-foreground mt-0.5">
            — {testimonials[currentTestimonial].author}
          </p>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-4 py-2 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3" /> Site Seguro
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">🏆 RA1000</span>
          <span>•</span>
          <span className="flex items-center gap-1">🛡️ Blindado</span>
        </div>

        <div className="h-4" />
      </main>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        <div className="container max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Total:</span>
            <span className="font-black text-accent text-lg">R$ {totalPrice.toFixed(2).replace(".", ",")}</span>
          </div>
          <button
            onClick={handlePayment}
            disabled={isSubmitting}
            className="w-full bg-success hover:bg-success/90 disabled:bg-muted disabled:text-muted-foreground text-success-foreground font-extrabold py-3.5 rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Finalizar com PIX
              </>
            )}
          </button>
          {showErrors && !isFormValid && (
            <p className="text-center text-[10px] text-destructive mt-1.5 font-medium">
              Preencha os campos destacados em vermelho
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
