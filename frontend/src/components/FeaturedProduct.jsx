import { useMemo, useState } from "react";
import { Star, MousePointer2, Hand, Eye } from "lucide-react";
import { useFeaturedProducts } from "../hooks/useFeaturedProduct";
import { FeaturedCoverflow } from "./FeaturedCoverOverflow";

export default function FeaturedProducts() {
  const [page, setPage] = useState(1);
  const { products = [], hasMore, isLoading } = useFeaturedProducts(page, 5);

  const featuredSlides = useMemo(
    () =>
      products.slice(0, 5).map((p) => ({
        id: p.id,
        imageUrl: p.imageUrl,
        name: p.name,
        description: p.description,
        priceCents: p.priceCents,
        slug: p.slug,
      })),
    [products],
  );

  if (isLoading) {
    return (
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex justify-center py-12 md:py-20">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-base-100 via-base-200 to-base-100 py-12 md:py-20 lg:py-24">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 md:mb-12 lg:mb-16">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 md:px-5 md:py-2 text-xs md:text-sm font-medium text-primary backdrop-blur-sm">
              <Star size={14} className="md:w-4 md:h-4" fill="currentColor" />
              <span className="tracking-wide">Featured Collection</span>
            </div>

            {/* Title */}
            <h2 className="mt-4 md:mt-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Curated Products
              </span>
              <span className="block mt-1 md:mt-2 text-base-content">
                With a Premium Feel
              </span>
            </h2>

            {/* Description */}
            <p className="mt-3 md:mt-4 max-w-2xl mx-auto text-sm md:text-base text-base-content/70 leading-relaxed">
              Hand-picked items with smooth 3D coverflow interaction.
              <span className="block mt-1 text-xs md:text-sm text-base-content/60">
                Click on a product to view details and click on other products
                to navigate.
              </span>
            </p>
          </div>
        </div>

        {/* Coverflow Section */}
        <div className="relative">
          {/* Glass morphism container */}
          <div className="relative rounded-2xl md:rounded-3xl bg-gradient-to-br from-base-100/80 via-base-200/50 to-base-100/80 backdrop-blur-xl border border-base-300/20 shadow-2xl shadow-primary/5">
            {/* Inner padding container */}
            <div className="px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-12 lg:px-12 lg:py-16">
              <FeaturedCoverflow
                slides={featuredSlides}
                cardWidth={400}
                cardHeight={400}
                radius={3}
                tilt={12}
                sideTilt={8}
                gap={8}
                opacity={60}
                autoplay={true}
                autoplayDirection="rightToLeft"
                showTitle={true}
                titleFont={{
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontSize: "22px",
                  letterSpacing: "-0.02em",
                  lineHeight: "1.1em",
                }}
                titleColor="#ffffff"
                titlePosition={{
                  position: "bottomLeft",
                  paddingLeft: 22,
                  paddingRight: 22,
                  paddingTop: 24,
                  paddingBottom: 24,
                }}
              />
            </div>
          </div>

          {/* Decorative corner accents */}
          <div className="absolute top-4 left-4 w-16 h-16 md:w-24 md:h-24 border-t-2 border-l-2 border-primary/20 rounded-tl-2xl" />
          <div className="absolute bottom-4 right-4 w-16 h-16 md:w-24 md:h-24 border-b-2 border-r-2 border-primary/20 rounded-br-2xl" />
        </div>

        {/* Bottom feature indicators with Lucide icons */}
        <div className="mt-8 md:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {[
            {
              title: "3D Interaction",
              description: "Smooth coverflow with realistic depth",
              icon: MousePointer2,
              color: "text-blue-500",
              bgColor: "bg-blue-500/10",
            },
            {
              title: "Touch Enabled",
              description: "Swipe navigation on mobile devices",
              icon: Hand,
              color: "text-green-500",
              bgColor: "bg-green-500/10",
            },
            {
              title: "Quick Preview",
              description: "See details before making a choice",
              icon: Eye,
              color: "text-purple-500",
              bgColor: "bg-purple-500/10",
            },
          ].map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.title}
                className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-base-200/50 backdrop-blur-sm border border-base-300/30 hover:bg-base-200/80 hover:border-primary/20 transition-all duration-300 group"
              >
                <div
                  className={`p-2 md:p-2.5 rounded-lg ${feature.bgColor} group-hover:scale-110 transition-transform duration-300`}
                >
                  <IconComponent
                    size={20}
                    className={`md:w-5 md:h-5 ${feature.color}`}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-sm md:text-base group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-xs md:text-sm text-base-content/60">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
