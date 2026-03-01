const messages = [
  "🚚 FRETE GRÁTIS HOJE",
  "🔥 ATÉ 74% OFF",
  "💥 MENOR PREÇO DO ANO",
  "⚡ ÚLTIMAS UNIDADES",
  "🏃 CORRA ANTES QUE ACABE",
  "🎯 OFERTA IMPERDÍVEL",
];

const AnnouncementBar = () => {
  const repeatedMessages = [...messages, ...messages];

  return (
    <div className="bg-foreground text-background overflow-hidden whitespace-nowrap py-2.5 text-[11px] font-bold tracking-widest uppercase">
      <div className="animate-marquee flex gap-10">
        {repeatedMessages.map((msg, i) => (
          <span key={i} className="flex-shrink-0 px-2 opacity-90">
            {msg}
          </span>
        ))}
        {repeatedMessages.map((msg, i) => (
          <span key={`dup-${i}`} className="flex-shrink-0 px-2 opacity-90">
            {msg}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementBar;
