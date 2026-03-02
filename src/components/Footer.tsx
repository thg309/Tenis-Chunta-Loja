import { Mail, Shield, Lock } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container px-4 py-10">
        <div className="flex justify-center mb-8">
          <h2 className="text-xl font-black tracking-tight">
            <span className="text-accent">WORLD</span>
            <span className="text-background"> TENNIS</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-sm mb-3 text-background/80 uppercase tracking-wider text-[11px]">Institucional</h3>
            <ul className="space-y-2 text-xs text-background/50">
              <li><a href="#" className="hover:text-background/90 transition-colors">Política de Privacidade</a></li>
              <li><a href="#" className="hover:text-background/90 transition-colors">Termos de Uso</a></li>
              <li><a href="#" className="hover:text-background/90 transition-colors">Política de Envio</a></li>
              <li><a href="#" className="hover:text-background/90 transition-colors">Política de Reembolso</a></li>
              <li><a href="#" className="hover:text-background/90 transition-colors">Trocas e Devoluções</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-sm mb-3 text-background/80 uppercase tracking-wider text-[11px]">Atendimento</h3>
            <div className="space-y-2 text-xs text-background/50">
              <a href="mailto:contato@worldtennis.com.br" className="flex items-center gap-2 hover:text-background/90 transition-colors">
                <Mail className="w-3.5 h-3.5" />
                contato@worldtennis.com.br
              </a>
              <p>Respondemos em menos de 10 min!</p>
              <p className="mt-2">Horário:</p>
              <p>Seg a Sex: 8h às 18h</p>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-sm mb-3 text-background/80 uppercase tracking-wider text-[11px]">Segurança</h3>
            <div className="space-y-2 text-xs text-background/50">
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5" />
                Site 100% Seguro
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5" />
                Conexão Criptografada (SSL)
              </div>
              <p className="mt-2">Seus dados são protegidos com criptografia de ponta a ponta.</p>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 pt-6 text-center text-[11px] text-background/30 space-y-1">
          <p>World Tennis Comércio de Calçados LTDA</p>
          <p>CNPJ: 49.808.535/0001-82</p>
          <p>Rua 24 de Maio, 240, Brás - São Paulo/SP - CEP 69010-080</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
