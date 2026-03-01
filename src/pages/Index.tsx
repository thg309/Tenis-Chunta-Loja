import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import ProductHero from "@/components/ProductHero";
import ProductDescription from "@/components/ProductDescription";
import Guarantees from "@/components/Guarantees";
import Features from "@/components/Features";
import Reviews from "@/components/Reviews";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background max-w-[480px] mx-auto shadow-[0_0_40px_rgba(0,0,0,0.08)]">
      <AnnouncementBar />
      <Header />
      <main>
        <ProductHero />
        <ProductDescription />
        <Reviews />
        <FAQ />
        <Guarantees />
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
