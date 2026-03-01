

## Plano: Recriar a Loja CHIQUE B

A loja "CHIQUE B" é uma loja de tênis mobile-first com layout otimizado para celular (max 480px), carrinho de compras, checkout com formulário multi-etapas e pagamento via PIX integrado com Supabase.

---

### 1. 🎨 Configuração do Design System
- Atualizar as cores e variáveis CSS para o tema da loja (cores primárias azul, accent laranja, cores de sucesso/warning/oferta/estrela)
- Importar a fonte **Plus Jakarta Sans** do Google Fonts
- Configurar o Tailwind com as cores customizadas extras (success, warning, offer, star, etc.)

### 2. 🖼️ Upload das Imagens dos Produtos
- Fazer upload de todas as imagens de tênis (5 cores em .webp: verde, salmão, branco/azul, branco/laranja, azul)
- Fazer upload das imagens de reviews (review-1, review-2, review-camila, review-fernando, review-rafael, review-sabrina)
- Fazer upload da tabela de tamanhos e demais assets
- Adicionar vídeo hero (referência a `/videos/hero-video.mp4`)

### 3. 🛒 Contexto do Carrinho (CartContext)
- Criar o CartContext com gerenciamento de itens (adicionar, remover, atualizar quantidade)
- Persistência no localStorage
- Preço unitário fixo de R$ 77,12
- Dados do item: cor, tamanho, quantidade, imagem

### 4. 🏠 Página Inicial (Landing Page Mobile-First)
Recriar todos os componentes da página principal:
- **AnnouncementBar**: Barra de anúncio no topo
- **Header**: Logo "CHIQUE B", menu hambúrguer, ícone carrinho com badge
- **ProductHero**: Carrossel de imagens/vídeo, seletor de cor e tamanho, botão comprar, modal de oferta relâmpago
- **ProductDescription**: Descrição detalhada do produto
- **Reviews**: Avaliações de clientes com fotos
- **FAQ**: Perguntas frequentes com accordion
- **Guarantees**: Garantias da loja
- **Features**: Diferenciais do produto
- **Footer**: Rodapé da loja

### 5. 💳 Página de Checkout
- Formulário multi-etapas (Dados → Endereço → Pagamento)
- Barra de progresso entre etapas
- Campos: nome, CPF, telefone, email, endereço completo com busca por CEP
- Resumo do carrinho com edição de quantidade
- Depoimentos rotativos durante o checkout
- Integração com Supabase para criar pagamento PIX

### 6. 💰 Página de Pagamento PIX
- Exibição do código PIX (copia e cola)
- QR Code para pagamento
- Timer de expiração com contagem regressiva
- Botão copiar código com feedback visual

### 7. 🔌 Integração Supabase
- Configurar conexão com Supabase (variáveis de ambiente)
- Edge Function `create-pix-payment` para gerar cobrança PIX (integração com API FastSoft)
- Componente ScrollToTop para navegação entre páginas

### 8. 📱 Componentes Auxiliares
- **FlashOfferModal**: Modal de oferta relâmpago com urgência
- **ScrollToTop**: Scroll automático ao mudar de rota
- Navegação suave por âncoras na página inicial

---

### ⚠️ Observações Importantes
- **Imagens**: Você precisará fazer upload das imagens dos tênis e reviews, pois não é possível copiar binários do GitHub automaticamente
- **Supabase**: Será necessário conectar um projeto Supabase e configurar a Edge Function de pagamento PIX com as credenciais da API FastSoft
- **Vídeo**: O vídeo hero precisará ser adicionado manualmente em `public/videos/`

