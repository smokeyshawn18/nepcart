"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";

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
    cardWidth = 400,
    cardHeight = 400,
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

  const tp = titlePosition || {};
  const corner = tp.position || "bottomLeft";
  const isTop = corner === "topLeft" || corner === "topRight";
  const isRight = corner === "topRight" || corner === "bottomRight";
  const padLeft = tp.paddingLeft ?? 22;
  const padRight = tp.paddingRight ?? 22;
  const padTop = tp.paddingTop ?? 24;
  const padBottom = tp.paddingBottom ?? 24;

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
    minWidth: 320,
    minHeight: 360,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    perspective: `${PERSPECTIVE}px`,
    overflow: "hidden",
    outline: "none",
  };

  if (!n) return null;

  return (
    <div
      style={rootStyle}
      tabIndex={0}
      role="group"
      aria-roledescription="carousel"
      onKeyDown={onKeyDown}
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
          const tx = rel * (gap * 30);
          const tz = -ax * DEPTH;
          const ry = -rel * tilt;
          const rz = rel * sideTilt;

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
          };

          const handleClick = () => {
            if (!isActive) {
              // First click: bring card to center
              lock();
              setActive(i);
            } else {
              // Second click on centered card: navigate to product page
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
                        ? "linear-gradient(0deg, rgba(0,0,0,0) 35%, rgba(0,0,0,0.7) 100%)"
                        : "linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,0.7) 100%)",
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
                        fontSize: 22,
                        fontWeight: 700,
                        lineHeight: "1.1em",
                        letterSpacing: "-0.02em",
                        textShadow: "0 2px 10px rgba(0,0,0,0.4)",
                        ...(titleFont || {}),
                      }}
                    >
                      {slide.name}
                    </div>
                    {slide.description && (
                      <div
                        style={{
                          marginTop: 8,
                          fontSize: 14,
                          color: "rgba(255,255,255,0.8)",
                        }}
                      >
                        {slide.description}
                      </div>
                    )}
                    <div
                      style={{
                        marginTop: 10,
                        fontSize: 16,
                        fontWeight: 600,
                        color: "#fff",
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
  );
}
