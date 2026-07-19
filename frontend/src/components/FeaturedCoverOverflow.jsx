"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PERSPECTIVE = 1600;
const SCALE_STEP = 0.16;
const MAX_VISIBLE = 2;
const DEPTH = 240;

function getEffectiveRadius(radius, cardWidth, cardHeight) {
  const r = Math.max(0, Math.min(20, radius));
  return (r / 20) * (Math.min(cardWidth, cardHeight) / 2);
}

export function FeaturedCoverflow(props) {
  const {
    slides,
    cardWidth: desktopCardWidth = 400,
    cardHeight: desktopCardHeight = 400,
    radius = 3,
    tilt = 12,
    sideTilt = 8,
    gap = 8,
    opacity = 60,
    autoplay = false,
    autoplayDirection = "rightToLeft",
    showTitle = true,
    titleFont,
    titleColor = "#ffffff",
    titlePosition,
    style,
  } = props;

  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Responsive card sizing
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const cardWidth = isMobile
    ? Math.min(window.innerWidth * 0.75, 320)
    : desktopCardWidth;
  const cardHeight = isMobile ? cardWidth * 0.8 : desktopCardHeight;

  const tp = titlePosition || {};
  const corner = tp.position || "bottomLeft";
  const isTop = corner === "topLeft" || corner === "topRight";
  const isRight = corner === "topRight" || corner === "bottomRight";
  const padLeft = isMobile ? (tp.paddingLeft ?? 16) : (tp.paddingLeft ?? 22);
  const padRight = isMobile ? (tp.paddingRight ?? 16) : (tp.paddingRight ?? 22);
  const padTop = isMobile ? (tp.paddingTop ?? 16) : (tp.paddingTop ?? 24);
  const padBottom = isMobile
    ? (tp.paddingBottom ?? 16)
    : (tp.paddingBottom ?? 24);

  const list = slides || [];
  const n = list.length;

  const [active, setActive] = useState(0);
  const moveDur = 0.6;
  const lockRef = useRef(false);

  const lock = useCallback(() => {
    lockRef.current = true;
    window.setTimeout(
      () => {
        lockRef.current = false;
      },
      Math.max(50, moveDur * 1000),
    );
  }, [moveDur]);

  const step = useCallback(
    (dir) => {
      if (lockRef.current || n < 2) return;
      lock();
      setActive((a) => (((a + dir) % n) + n) % n);
    },
    [n, lock],
  );

  // Touch handlers for mobile
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        step(1); // Swipe left - next
      } else {
        step(-1); // Swipe right - previous
      }
    }
  };

  const delay = 2.5;
  useEffect(() => {
    if (!autoplay || n < 2) return;
    const ms = Math.max(0.3, delay) * 1000;
    const dir = autoplayDirection === "leftToRight" ? -1 : 1;
    const id = window.setInterval(() => step(dir), ms);
    return () => window.clearInterval(id);
  }, [autoplay, autoplayDirection, delay, n, step]);

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        step(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        step(-1);
      }
    },
    [step],
  );

  const transitionCss = `transform ${moveDur}s cubic-bezier(0.22, 1, 0.36, 1), opacity ${moveDur}s cubic-bezier(0.22, 1, 0.36, 1)`;
  const effectiveRadius = getEffectiveRadius(radius, cardWidth, cardHeight);
  const dim = 1 - Math.max(0, Math.min(100, opacity)) / 100;

  const rootStyle = {
    ...(style || {}),
    position: "relative",
    width: "100%",
    height: "100%",
    minWidth: isMobile ? 280 : 320,
    minHeight: isMobile ? 340 : 360,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    perspective: `${PERSPECTIVE}px`,
    overflow: "hidden",
    outline: "none",
    touchAction: "pan-y",
  };

  if (!n) return null;

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {/* Navigation Arrows */}
      {n > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            className={`absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110 active:scale-95 shadow-lg ${
              isMobile ? "w-8 h-8" : ""
            }`}
            aria-label="Previous slide"
          >
            <ChevronLeft size={isMobile ? 18 : 22} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            className={`absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110 active:scale-95 shadow-lg ${
              isMobile ? "w-8 h-8" : ""
            }`}
            aria-label="Next slide"
          >
            <ChevronRight size={isMobile ? 18 : 22} />
          </button>
        </>
      )}

      <div
        ref={containerRef}
        style={rootStyle}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        onKeyDown={onKeyDown}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          style={{
            position: "relative",
            width: cardWidth,
            height: cardHeight,
            transformStyle: "preserve-3d",
          }}
        >
          {list.map((slide, i) => {
            let rel = i - active;
            const loop = true;
            if (loop) {
              if (rel > n / 2) rel -= n;
              if (rel < -n / 2) rel += n;
            }

            const ax = Math.abs(rel);
            const visible = ax <= MAX_VISIBLE;
            const isActive = rel === 0;
            const sc = Math.max(0.4, 1 - ax * SCALE_STEP);

            // Adjust spacing for mobile
            const mobileGap = isMobile ? gap * 0.7 : gap;
            const tx = rel * (mobileGap * 30);
            const tz = -ax * DEPTH;
            const ry = -rel * (isMobile ? tilt * 0.8 : tilt);
            const rz = rel * (isMobile ? sideTilt * 0.8 : sideTilt);

            const cardStyle = {
              position: "absolute",
              left: "50%",
              top: "50%",
              width: cardWidth,
              height: cardHeight,
              borderRadius: effectiveRadius,
              overflow: "hidden",
              transformStyle: "preserve-3d",
              transformOrigin: "center center",
              transform: `translate(-50%, -50%) translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${sc})`,
              transition: transitionCss,
              opacity: visible ? 1 : 0,
              cursor: "pointer",
              pointerEvents: visible ? "auto" : "none",
              backgroundColor: "#1a1a1a",
              boxShadow: isActive
                ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                : "0 10px 30px -5px rgba(0, 0, 0, 0.3)",
            };

            const handleClick = () => {
              if (!isActive) {
                lock();
                setActive(i);
              } else {
                navigate(`/product/${slide.slug}`);
              }
            };

            return (
              <div
                key={slide.id}
                style={cardStyle}
                onClick={handleClick}
                aria-label={slide.name}
                aria-hidden={!visible}
              >
                <img
                  src={slide.imageUrl}
                  alt={slide.name}
                  draggable={false}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    userSelect: "none",
                  }}
                />

                {showTitle && (
                  <>
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: isTop
                          ? "linear-gradient(0deg, rgba(0,0,0,0) 35%, rgba(0,0,0,0.85) 100%)"
                          : "linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,0.85) 100%)",
                        pointerEvents: "none",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        left: padLeft,
                        right: padRight,
                        [isTop ? "top" : "bottom"]: isTop ? padTop : padBottom,
                        textAlign: isRight ? "right" : "left",
                        pointerEvents: "none",
                      }}
                    >
                      <div
                        style={{
                          color: titleColor,
                          fontSize: isMobile ? 18 : 22,
                          fontWeight: 700,
                          lineHeight: "1.2em",
                          letterSpacing: "-0.02em",
                          textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                          marginBottom: 4,
                          ...(titleFont || {}),
                        }}
                      >
                        {slide.name}
                      </div>
                      {slide.description && (
                        <div
                          style={{
                            fontSize: isMobile ? 12 : 14,
                            color: "rgba(255,255,255,0.9)",
                            lineHeight: "1.4em",
                            textShadow: "0 1px 4px rgba(0,0,0,0.5)",
                            marginBottom: 6,
                          }}
                        >
                          {slide.description}
                        </div>
                      )}
                      <div
                        style={{
                          fontSize: isMobile ? 15 : 18,
                          fontWeight: 700,
                          color: "#fff",
                          textShadow: "0 2px 8px rgba(0,0,0,0.5)",
                        }}
                      >
                        NPR {(slide.priceCents / 100).toLocaleString()}
                      </div>
                    </div>
                  </>
                )}

                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "#000000",
                    opacity: isActive ? 0 : dim,
                    transition: `opacity ${moveDur}s cubic-bezier(0.22, 1, 0.36, 1)`,
                    pointerEvents: "none",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Dot indicators */}
      {n > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          {list.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                lock();
                setActive(index);
              }}
              className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-300 ${
                index === active
                  ? "bg-white w-6 md:w-8"
                  : "bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
