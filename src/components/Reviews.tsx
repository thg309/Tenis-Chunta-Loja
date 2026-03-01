import { Star, ThumbsUp, Play } from "lucide-react";
import { useState, useRef, useCallback } from "react";

interface ReviewData {
  name: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
  media: { type: "image" | "video"; url: string }[];
  helpful: number;
}

const reviews: ReviewData[] = [
  {
    name: "wilcam50",
    avatar: "https://down-br.img.susercontent.com/file/6301821aa0d7c1b8888d7bf4a38b0aff_tn",
    rating: 5,
    date: "2026-01-05 12:41",
    text: "Tênis leve demais, acabamento perfeito, calço 43 e comprei o maior número e serviu perfeitamente.",
    media: [
      { type: "video", url: "https://down-tx-br.vod.susercontent.com/api/v4/11110103/mms/br-11110103-6v65f-mj4cux9wg8oze8.16000051767627625.mp4" },
      { type: "image", url: "https://down-br.img.susercontent.com/file/br-11134103-81ztc-mj4cu5y9cb2e50.webp" },
      { type: "image", url: "https://down-br.img.susercontent.com/file/br-11134103-81ztc-mj4cu5y99hxiea.webp" },
      { type: "image", url: "https://down-br.img.susercontent.com/file/br-11134103-81ztc-mj4cu5y8u1oma7.webp" },
      { type: "image", url: "https://down-br.img.susercontent.com/file/br-11134103-81ztc-mj4cu5y5y3nm28.webp" },
    ],
    helpful: 52,
  },
  {
    name: "taly_litah",
    avatar: "https://down-br.img.susercontent.com/file/br-11134233-7r98o-m6o0cl56doiv74_tn",
    rating: 5,
    date: "2026-01-22 11:39",
    text: "Muito bom mesmo agora vou ver s é confortável ,meu namorado gostou ! E é bem bonito ! Chegou rápido",
    media: [
      { type: "video", url: "https://down-tx-br.vod.susercontent.com/api/v4/11110103/mms/br-11110103-6v65f-mjsk3hx51af58e.16000051769092737.mp4" },
      { type: "image", url: "https://down-br.img.susercontent.com/file/br-11134103-81ztc-mjsk3p4d2rczcd.webp" },
      { type: "image", url: "https://down-br.img.susercontent.com/file/br-11134103-81ztc-mjsk3p4d45xf40.webp" },
      { type: "image", url: "https://down-br.img.susercontent.com/file/br-11134103-81ztc-mjsk3p4d5khv69.webp" },
    ],
    helpful: 34,
  },
  {
    name: "9ene9tbgfp",
    avatar: "https://down-br.img.susercontent.com/file/21fcc4f56109fe76084a68865d709500_tn",
    rating: 5,
    date: "2026-02-03 12:45",
    text: "O tênis é bem bonito e confortável, ele é muito leve também\n168 gramas\nFiz o teste da placa e ele voou longe\nRealmente cumpre o que promete",
    media: [
      { type: "video", url: "https://down-tx-br.vod.susercontent.com/api/v4/11110103/mms/br-11110103-6v65g-mk9r24yp12iq42.16000051770133398.mp4" },
      { type: "image", url: "https://down-br.img.susercontent.com/file/br-11134103-81ztc-mk9qznnzpeddc8.webp" },
      { type: "image", url: "https://down-br.img.susercontent.com/file/br-11134103-81ztc-mk9qzno25w5f19.webp" },
      { type: "image", url: "https://down-br.img.susercontent.com/file/br-11134103-81ztc-mk9qzno27apva1.webp" },
      { type: "image", url: "https://down-br.img.susercontent.com/file/br-11134103-81ztc-mk9qzno2a3ure4.webp" },
      { type: "image", url: "https://down-br.img.susercontent.com/file/br-11134103-81ztc-mk9qzno2bif71e.webp" },
    ],
    helpful: 47,
  },
  {
    name: "eu.zely",
    avatar: "https://down-br.img.susercontent.com/file/br-11134233-7r98o-m3uqe9wwvdbp05_tn",
    rating: 5,
    date: "2026-02-07 11:24",
    text: "Leve, lindo 🥰 e na medida. É um teste, se durar vale a pena e é o que espero. Ainda não treinei com ele, assim que usar reavaliarei... Editei a avaliação pq usei e me apaixonei ❤️é maravilhoso",
    media: [
      { type: "image", url: "https://down-br.img.susercontent.com/file/br-11134103-81ztc-mk5gccn354ard5.webp" },
      { type: "image", url: "https://down-br.img.susercontent.com/file/br-11134103-81ztc-mk5gccnc8em95f.webp" },
      { type: "image", url: "https://down-br.img.susercontent.com/file/br-11134103-81ztc-mk5gccnc9t6pe1.webp" },
      { type: "image", url: "https://down-br.img.susercontent.com/file/br-11134103-81ztc-mk5gccncb7r509.webp" },
    ],
    helpful: 28,
  },
  {
    name: "leideluci81",
    avatar: "https://down-br.img.susercontent.com/file/bfbc6ab72f3a4ea59882a4b285319be0_tn",
    rating: 5,
    date: "2026-01-10 11:31",
    text: "Que tênis maravilhoso senhores eu amei de uma maneira, ficou perfeito",
    media: [
      { type: "video", url: "https://down-tx-br.vod.susercontent.com/api/v4/11110103/mms/br-11110103-6v65e-mjbf9e78brie39.16000051768055388.mp4" },
      { type: "image", url: "https://down-br.img.susercontent.com/file/br-11134103-81ztc-mjbf9m3ohds600.webp" },
    ],
    helpful: 15,
  },
  {
    name: "silvimjunior93",
    avatar: "https://down-br.img.susercontent.com/file/18cc3d03b9d30e4dd2145cf6d9eb2bce_tn",
    rating: 5,
    date: "2026-02-03 09:58",
    text: "Otimo tenis, sinceramente nao me lembro de ter colocado em meus pés algo tão leve e confortável.\nCalço 38 e alguns calçados é 39, quem passar por isso compre o 38 a forma dele é um pouco maior.",
    media: [
      { type: "image", url: "https://down-br.img.susercontent.com/file/br-11134103-81ztc-mk9kvsitm48w0c.webp" },
    ],
    helpful: 22,
  },
  {
    name: "moisescutler",
    avatar: "https://down-br.img.susercontent.com/file/a841a32c8dcbeb48843e90f33941e5ed_tn",
    rating: 5,
    date: "2026-01-15 11:59",
    text: "Achei o tênis bem confortável, bom para corrida, inclusive eu tenho celite porém não senti nada de desconforto",
    media: [
      { type: "image", url: "https://down-br.img.susercontent.com/file/br-11134103-81ztc-mjil6vsj9edi4a.webp" },
      { type: "image", url: "https://down-br.img.susercontent.com/file/br-11134103-81ztc-mjil6vshutxf82.webp" },
    ],
    helpful: 19,
  },
  {
    name: "lcasadio8",
    avatar: "https://down-br.img.susercontent.com/file/13bc9bd8febc204322d7fa16af359bdc_tn",
    rating: 5,
    date: "2026-01-29 12:29",
    text: "Estreia com 10 km , excelente, levíssimo, recomendo.",
    media: [
      { type: "video", url: "https://down-zl-br.vod.susercontent.com/api/v4/11110103/mms/br-11110103-6v65g-mk2lm39a8t8h8a.16000051769700499.mp4" },
      { type: "image", url: "https://down-br.img.susercontent.com/file/br-11134103-81ztc-mk2llu5jf30iba.webp" },
    ],
    helpful: 11,
  },
  {
    name: "alessandramonteiro850",
    avatar: "https://down-br.img.susercontent.com/file/br-11134233-7r98o-lxhrpctcmbuecd_tn",
    rating: 5,
    date: "2026-01-29 00:51",
    text: "Que tênis incrível gente , maravilhoso estiloso e confortável , vontade de comprar outro de outra cor .",
    media: [
      { type: "video", url: "https://down-zl-br.vod.susercontent.com/api/v4/11110103/mms/br-11110103-6v65d-mk1woeot4ydcb2.16000051769658605.mp4" },
      { type: "image", url: "https://down-br.img.susercontent.com/file/br-11134103-81ztc-mk1wncnf8wzmbf.webp" },
      { type: "image", url: "https://down-br.img.susercontent.com/file/br-11134103-81ztc-mk1wncnkv6rk84.webp" },
      { type: "image", url: "https://down-br.img.susercontent.com/file/br-11134103-81ztc-mk1wncnkwlc0a9.webp" },
    ],
    helpful: 31,
  },
  {
    name: "madame_tupina1",
    avatar: "https://down-br.img.susercontent.com/file/br-11134233-7qukw-lh6ihigy47lh7f_tn",
    rating: 5,
    date: "2026-02-02 09:15",
    text: "Excelente, propulsão ótima, bem responsivo. A cor é um salmão, não laranjado, pra mim serve para longão",
    media: [
      { type: "image", url: "https://down-br.img.susercontent.com/file/br-11134103-81ztc-mk83hdj2lszna4.webp" },
      { type: "image", url: "https://down-br.img.susercontent.com/file/br-11134103-81ztc-mk83hdj2izurf3.webp" },
      { type: "image", url: "https://down-br.img.susercontent.com/file/br-11134103-81ztc-mk83hdj2kef712.webp" },
    ],
    helpful: 25,
  },
  {
    name: "audisantos20",
    avatar: "https://down-br.img.susercontent.com/file/ba39751858848c735ee0a6275f10e1db_tn",
    rating: 5,
    date: "2026-01-21 06:15",
    text: "Lindooo muito bom, super macio. So nao acho que dure muito, mais como revelou a utilização de tenis espero que dure pelo menos 1 ano.\nMais gostei bastante pensando em comprar o outro.",
    media: [
      { type: "video", url: "https://down-tx-br.vod.susercontent.com/api/v4/11110103/mms/br-11110103-6v65e-mjqt6vucp0qq00.16000051768986834.mp4" },
      { type: "image", url: "https://down-br.img.susercontent.com/file/br-11134103-81ztc-mjqt5nu7q9z70e.webp" },
      { type: "image", url: "https://down-br.img.susercontent.com/file/br-11134103-81ztc-mjqt5nu7rojn87.webp" },
    ],
    helpful: 17,
  },
  {
    name: "rbande",
    avatar: "https://down-br.img.susercontent.com/file/8cea3881d949fe59938a459ff70d7ae7_tn",
    rating: 5,
    date: "2026-01-05 10:07",
    text: "ele é maravilhoso!\nO tênis em si é muito bom e leve , mas é preciso ter um pouco de cuidado. Ele é um tênis de placa então você precisa saber correr com ele.",
    media: [
      { type: "image", url: "https://down-br.img.susercontent.com/file/br-11134103-81ztc-mj47eqygcphece.webp" },
      { type: "image", url: "https://down-br.img.susercontent.com/file/br-11134103-81ztc-mj47eqygbawyef.webp" },
      { type: "image", url: "https://down-br.img.susercontent.com/file/br-11134103-81ztc-mj47eqychn9fcb.webp" },
    ],
    helpful: 38,
  },
];

const ratingBars = [
  { stars: 5, count: 520 },
  { stars: 4, count: 45 },
  { stars: 3, count: 8 },
  { stars: 2, count: 3 },
  { stars: 1, count: 2 },
];

const totalReviews = 578;

const ReviewStars = ({ count }: { count: number }) => (
  <div className="flex">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < count ? "fill-star text-star" : "fill-muted text-muted"
        }`}
      />
    ))}
  </div>
);

const useDragToDismiss = (onClose: () => void) => {
  const startY = useRef(0);
  const currentY = useRef(0);
  const isDragging = useRef(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    currentY.current = 0;
    isDragging.current = true;
    if (contentRef.current) {
      contentRef.current.style.transition = 'none';
    }
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;
    currentY.current = e.touches[0].clientY - startY.current;
    if (contentRef.current) {
      contentRef.current.style.transform = `translateY(${currentY.current}px)`;
      contentRef.current.style.opacity = `${Math.max(0, 1 - Math.abs(currentY.current) / 300)}`;
    }
  }, []);

  const onTouchEnd = useCallback(() => {
    isDragging.current = false;
    if (Math.abs(currentY.current) > 100) {
      onClose();
    } else if (contentRef.current) {
      contentRef.current.style.transition = 'transform 0.2s ease, opacity 0.2s ease';
      contentRef.current.style.transform = 'translateY(0)';
      contentRef.current.style.opacity = '1';
    }
  }, [onClose]);

  return { contentRef, onTouchStart, onTouchMove, onTouchEnd };
};

const VideoModal = ({ url, onClose }: { url: string; onClose: () => void }) => {
  const { contentRef, onTouchStart, onTouchMove, onTouchEnd } = useDragToDismiss(onClose);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-3xl font-light z-10 w-10 h-10 flex items-center justify-center"
      >
        ✕
      </button>
      <div ref={contentRef}>
        <video
          src={url}
          className="max-h-[90vh] max-w-[95vw] rounded-lg"
          autoPlay
          controls
          playsInline
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
};

const ImageModal = ({ url, onClose }: { url: string; onClose: () => void }) => {
  const { contentRef, onTouchStart, onTouchMove, onTouchEnd } = useDragToDismiss(onClose);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-3xl font-light z-10 w-10 h-10 flex items-center justify-center"
      >
        ✕
      </button>
      <div ref={contentRef}>
        <img
          src={url}
          alt="Foto ampliada"
          className="max-h-[90vh] max-w-[95vw] object-contain rounded-lg"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
};

const MediaGallery = ({ media }: { media: { type: "image" | "video"; url: string }[] }) => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  if (media.length === 0) return null;

  return (
    <>
      <div className="ml-9 flex gap-2 overflow-x-auto pb-1 mb-3 scrollbar-hide snap-x snap-mandatory touch-pan-x" style={{ WebkitOverflowScrolling: 'touch' }}>
        {media.map((item, idx) => {
          if (item.type === "video") {
            return (
              <button
                key={idx}
                onClick={() => setActiveVideo(item.url)}
                className="relative w-20 h-20 rounded-md border border-border overflow-hidden shrink-0 snap-start bg-black/80 flex items-center justify-center"
              >
                <Play className="w-6 h-6 text-white fill-white" />
              </button>
            );
          }
          return (
            <button
              key={idx}
              onClick={() => setActiveImage(item.url)}
              className="shrink-0 snap-start"
            >
              <img
                src={item.url}
                alt="Foto da avaliação"
                className="w-20 h-20 object-cover rounded-md border border-border"
                loading="lazy"
              />
            </button>
          );
        })}
      </div>

      {activeVideo && (
        <VideoModal url={activeVideo} onClose={() => setActiveVideo(null)} />
      )}
      {activeImage && (
        <ImageModal url={activeImage} onClose={() => setActiveImage(null)} />
      )}
    </>
  );
};

const ReviewCard = ({ review }: { review: ReviewData }) => (
  <div className="py-4 border-b border-border last:border-b-0">
    <div className="flex items-center gap-2 mb-1">
      {review.avatar ? (
        <img
          src={review.avatar}
          alt={review.name}
          className="w-7 h-7 rounded-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">
          {review.name.charAt(0).toUpperCase()}
        </div>
      )}
      <span className="text-sm font-medium text-foreground">{review.name}</span>
    </div>

    <div className="ml-9 mb-1">
      <ReviewStars count={review.rating} />
    </div>

    <p className="ml-9 text-xs text-muted-foreground mb-2">
      {review.date}
    </p>

    {review.text && (
      <p className="ml-9 text-sm text-foreground leading-relaxed mb-3 whitespace-pre-line">
        {review.text}
      </p>
    )}

    <MediaGallery media={review.media} />

    <div className="ml-9">
      <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
        <ThumbsUp className="w-3.5 h-3.5" />
        <span>{review.helpful}</span>
      </button>
    </div>
  </div>
);

const Reviews = () => {
  return (
    <section id="avaliacoes" className="container px-4 py-8 scroll-mt-20">
      <h2 className="text-lg font-extrabold text-foreground mb-4 tracking-tight">
        Avaliações do Produto
      </h2>

      <div className="bg-card border border-border/60 rounded-xl p-4 mb-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-3xl font-black text-accent">4.9</p>
            <p className="text-[11px] text-muted-foreground">de 5</p>
            <div className="flex mt-1 justify-center">
              <ReviewStars count={5} />
            </div>
          </div>
          <div className="flex-1 space-y-1.5">
            {ratingBars.map((bar) => (
              <div key={bar.stars} className="flex items-center gap-2">
                <div className="flex items-center gap-0.5 w-10">
                  <Star className="w-2.5 h-2.5 fill-star text-star" />
                  <span className="text-[11px] text-muted-foreground font-medium">
                    {bar.stars}
                  </span>
                </div>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-star rounded-full transition-all"
                    style={{
                      width: `${(bar.count / totalReviews) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-[11px] text-muted-foreground w-8 text-right font-medium">
                  {bar.count}
                </span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-3 font-medium">
          {totalReviews} avaliações verificadas
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-hide">
        <span className="shrink-0 text-xs font-bold bg-accent text-accent-foreground px-3.5 py-1.5 rounded-full">
          Todos
        </span>
        <span className="shrink-0 text-xs font-semibold border border-border/60 text-muted-foreground px-3.5 py-1.5 rounded-full bg-card">
          5 Estrelas (520)
        </span>
        <span className="shrink-0 text-xs font-semibold border border-border/60 text-muted-foreground px-3.5 py-1.5 rounded-full bg-card">
          Com Foto (489)
        </span>
        <span className="shrink-0 text-xs font-semibold border border-border/60 text-muted-foreground px-3.5 py-1.5 rounded-full bg-card">
          4 Estrelas (45)
        </span>
      </div>

      <div className="bg-card border border-border/60 rounded-xl px-4 shadow-sm">
        {reviews.map((review, i) => (
          <ReviewCard key={i} review={review} />
        ))}
      </div>

      <button className="w-full text-center text-sm text-accent font-bold mt-4 py-3 bg-card rounded-xl border border-border/60 shadow-sm hover:bg-accent/5 transition-colors">
        Ver todas as avaliações (+{totalReviews - reviews.length})
      </button>
    </section>
  );
};

export default Reviews;
