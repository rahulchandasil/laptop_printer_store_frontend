import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import HomeHero from "../components/home/HomeHero";
import SectionHeader from "../components/home/SectionHeader";
import CategoryCard from "../components/home/CategoryCard";
import ValueProps from "../components/home/ValueProps";
import CTASection from "../components/home/CTASection";
import HomeFooter from "../components/home/HomeFooter";
import FeaturedProducts from "../components/home/FeaturedProducts";

function Home() {
  const navigate = useNavigate();

  const categories = [
    {
      title: "Premium Laptops",
      description: "Powerful machines from Dell, HP, and Lenovo built for intense workloads and creativity.",
      image: "/logos/lenovo.png",
      accent: "blue",
      actionLabel: "Shop Laptops",
      onClick: () => navigate("/brands/laptop"),
    },
    {
      title: "Office Printers",
      description: "High-yield, reliable printers from Canon, HP, and Epson for your home or business.",
      image: "/logos/canon.png",
      accent: "slate",
      actionLabel: "Shop Printers",
      onClick: () => navigate("/brands/printer"),
    },
  ];

  const browseLaptops = () => navigate("/brands/laptop");
  const browsePrinters = () => navigate("/brands/printer");
  const browseProducts = () => navigate("/brands/laptop"); // Fallback for general browse

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-950 font-sans selection:bg-slate-200">
      <Navbar />

      <main className="flex-1">
        <HomeHero
          onBrowseLaptops={browseLaptops}
          onBrowsePrinters={browsePrinters}
        />

        <section className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              eyebrow="Curated Selection"
              title="Shop by Category"
              description="We specialize in bringing you the highest quality laptops and printers from industry-leading manufacturers."
            />

            <div className="mt-12 grid gap-8 lg:grid-cols-2">
              {categories.map((category) => (
                <CategoryCard
                  key={category.title}
                  title={category.title}
                  description={category.description}
                  image={category.image}
                  accent={category.accent}
                  actionLabel={category.actionLabel}
                  onClick={category.onClick}
                />
              ))}
            </div>
          </div>
        </section>

        <div className="bg-slate-50">
          <FeaturedProducts />
        </div>

        <div className="bg-white">
          <ValueProps />
        </div>

        <CTASection onBrowse={browseProducts} />
      </main>

      <HomeFooter />
    </div>
  );
}

export default Home;
