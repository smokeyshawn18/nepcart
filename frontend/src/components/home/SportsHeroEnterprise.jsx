import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Flame,
  ArrowRight,
  Trophy,
  Sparkles,
  ShieldCheck,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export function SportsHeroEnterprise() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 18,
    minutes: 24,
    seconds: 50,
  });

  const slides = [
    {
      tag: "Pro Athlete Grade",
      title: "ENGINEERED FOR PEAK PERFORMANCE",
      subtitle:
        "Equip your training ground with tour-level football, gym, and recovery equipment.",
      cta: "Explore Pro Gear",
      category: "Fitness",
      badge: "Save Up to 45%",
      image:
        "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1920&q=85",
    },
    {
      tag: "Matchday Accessories",
      title: "DOMINATE THE FIELD WITH ELITE GEAR",
      subtitle:
        "Official match balls, protective shin guards, grip socks, and captain bands.",
      cta: "Shop Football",
      category: "Football",
      badge: "Official Match Specs",
      image:
        "https://plus.unsplash.com/premium_photo-1726812078047-a4216db80c44?q=80&w=865&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      tag: "Heavy Strength & Conditioning",
      title: "BUILD YOUR ULTIMATE HOME GYM",
      subtitle:
        "Precision dumbbells, power bands, wrist wraps, and high-density foam rollers.",
      cta: "Upgrade Gym Setup",
      category: "Gym Equipment",
      badge: "Free Delivery Over NRS 2500",
      image:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1920&q=85",
    },
  ];

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [slides.length, isPaused]);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0)
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  const handlePrev = () => {
    setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="space-y-6">
      {/* Premium Hero Carousel Container */}
      <div
        className="group relative overflow-hidden rounded-3xl border border-base-content/10 bg-black shadow-2xl"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${activeSlide * 100}%)` }}
        >
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className="relative min-w-full min-h-[460px] sm:min-h-[520px] lg:min-h-[580px] flex items-center px-6 py-14 sm:px-12 sm:py-20 lg:p-20 overflow-hidden"
            >
              {/* High-Resolution Background Imagery & Multi-stage Gradient */}
              <div className="absolute inset-0 z-0">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="h-full w-full object-cover object-center scale-100 group-hover:scale-105 transition-transform duration-1000 brightness-[0.45] contrast-125"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>

              {/* Foreground Hero Content Card */}
              <div className="relative z-10 max-w-2xl space-y-6 text-white">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-white border border-primary/40 shadow-lg">
                  <Trophy className="h-4 w-4 text-warning" />
                  <span className="uppercase tracking-wider">{slide.tag}</span>
                </div>

                <h1 className="text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl uppercase leading-[1.05] drop-shadow-lg text-white">
                  {slide.title}
                </h1>

                <p className="text-sm sm:text-base lg:text-lg text-white/90 font-medium max-w-xl leading-relaxed">
                  {slide.subtitle}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Link
                    to={`/catalog?category=${encodeURIComponent(
                      slide.category,
                    )}`}
                    className="btn btn-primary btn-md sm:btn-lg rounded-2xl px-8 font-extrabold shadow-xl hover:scale-105 transition-transform"
                  >
                    {slide.cta}
                    <ArrowRight className="h-5 w-5 ml-1" />
                  </Link>

                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-white bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20">
                    <Sparkles className="h-4 w-4 text-warning" />
                    <span>{slide.badge}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={handlePrev}
          aria-label="Previous slide"
          className="absolute left-4 top-1/2 z-20 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          onClick={handleNext}
          aria-label="Next slide"
          className="absolute right-4 top-1/2 z-20 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                activeSlide === idx
                  ? "w-10 bg-primary"
                  : "w-2.5 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Enterprise Social Proof Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 bg-base-100 p-4 rounded-2xl border border-base-content/10 shadow-sm">
        <div className="flex items-center gap-3 justify-center sm:justify-start">
          <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
          <span className="text-xs font-bold text-base-content">
            100% Verified Gear
          </span>
        </div>
        <div className="flex items-center gap-3 justify-center sm:justify-start">
          <Star className="h-5 w-5 text-warning fill-warning shrink-0" />
          <span className="text-xs font-bold text-base-content">
            4.9/5 Rating (12K+ Athletes)
          </span>
        </div>
        <div className="flex items-center gap-3 justify-center sm:justify-start">
          <Trophy className="h-5 w-5 text-primary shrink-0" />
          <span className="text-xs font-bold text-base-content">
            Official Nepal Distributor
          </span>
        </div>
        <div className="flex items-center gap-3 justify-center sm:justify-start">
          <Flame className="h-5 w-5 text-error shrink-0" />
          <span className="text-xs font-bold text-base-content">
            Express 24h Kathmandu Shipping
          </span>
        </div>
      </div>

      {/* Lightning Flash Sale Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-primary via-secondary to-primary p-5 px-6 text-primary-content shadow-xl">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shrink-0">
            <Flame className="h-6 w-6 text-warning fill-warning animate-bounce" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest opacity-90">
              NepCart Pro Flash Sale
            </span>
            <h3 className="text-lg font-black tracking-tight">
              Up to 60% Off Matchday & Gym Essentials
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-2 font-mono font-black text-base">
            <div className="bg-black/25 px-3 py-1.5 rounded-xl text-center">
              <span>{String(timeLeft.hours).padStart(2, "0")}</span>
              <span className="block text-[9px] opacity-70 font-sans font-normal">
                HRS
              </span>
            </div>
            <span className="self-center">:</span>
            <div className="bg-black/25 px-3 py-1.5 rounded-xl text-center">
              <span>{String(timeLeft.minutes).padStart(2, "0")}</span>
              <span className="block text-[9px] opacity-70 font-sans font-normal">
                MIN
              </span>
            </div>
            <span className="self-center">:</span>
            <div className="bg-black/25 px-3 py-1.5 rounded-xl text-center text-warning">
              <span>{String(timeLeft.seconds).padStart(2, "0")}</span>
              <span className="block text-[9px] opacity-70 font-sans font-normal">
                SEC
              </span>
            </div>
          </div>

          <Link
            to="/catalog?category=Deals"
            className="btn bg-base-100 text-base-content hover:bg-base-200 border-none rounded-xl font-bold px-5 shadow-md hover:scale-105 transition-transform"
          >
            Claim Deals
          </Link>
        </div>
      </div>
    </div>
  );
}
