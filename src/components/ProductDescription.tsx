const tabelaTamanhos = "/images/tabela-tamanhos.png";

const ProductDescription = () => {
  return (
    <section className="container px-4 py-8 space-y-8">
      <div>
        <h2 className="text-lg font-extrabold text-foreground mb-3 tracking-tight">Descrição do Produto</h2>
        <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
          <p>
            O <strong className="text-foreground">Tênis Carbon Marathon Chunta</strong> é a escolha perfeita para corredores que buscam performance máxima.
            Equipado com placa de carbono de última geração, oferece retorno de energia excepcional e propulsão
            otimizada a cada passada.
          </p>
          <p>
            Design aerodinâmico com malha respirável de alta tecnologia que mantém seus pés frescos e secos
            durante toda a corrida. O sistema de amortecimento em espuma de alta densidade absorve impactos
            e proporciona conforto duradouro.
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-extrabold text-foreground mb-3 tracking-tight">Tabela de Tamanhos</h2>
        <img
          src={tabelaTamanhos}
          alt="Tabela de Tamanhos - Guia de medidas do calçado"
          className="w-full rounded-xl border border-border/60 shadow-sm"
          loading="lazy"
        />
      </div>
    </section>
  );
};

export default ProductDescription;
