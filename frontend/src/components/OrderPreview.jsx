import { PackageIcon } from "lucide-react";
import { IK_PRESETS, imageKitOptimizedUrl } from "../lib/imagekitUrl.js";

const SIZES = {
  md: "h-[5.5rem] w-[5.5rem]",
  lg: "h-32 w-32 sm:h-36 sm:w-36",
};

export function OrderPreview({ items, size = "md" }) {
  const box = SIZES[size] ?? SIZES.md;
  const ikPreset = size === "lg" ? IK_PRESETS.orderPreviewLg : IK_PRESETS.orderPreviewMd;

  if (!items?.length) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center rounded-2xl border border-dashed border-base-300 bg-base-200/60 ${box}`}
      >
        <PackageIcon
          className={size === "lg" ? "size-12 text-base-content/25" : "size-8 text-base-content/25"}
          aria-hidden
        />
      </div>
    );
  }

  if (items.length === 1) {
    const p = items[0];
    return (
      <div
        className={`relative shrink-0 overflow-hidden rounded-2xl border border-base-300 bg-base-200 shadow-md ring-1 ring-base-300/40 ${box}`}
      >
        {p.imageUrl ? (
          <img
            src={imageKitOptimizedUrl(p.imageUrl, ikPreset)}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-base-300 to-base-200">
            <PackageIcon
              className={
                size === "lg" ? "size-12 text-base-content/25" : "size-8 text-base-content/25"
              }
              aria-hidden
            />
          </div>
        )}
      </div>
    );
  }

  const cap = 4;
  const show = items.slice(0, cap);
  const rest = items.length > cap ? items.length - cap : 0;

  return (
    <div
      className={`grid shrink-0 grid-cols-2 grid-rows-2 gap-0.5 overflow-hidden rounded-2xl border border-base-300 bg-base-200/90 p-0.5 shadow-md ring-1 ring-base-300/40 ${box}`}
    >
      {show.map((p, i) => (
        <div
          key={`${p.slug}-${i}`}
          className="relative min-h-0 overflow-hidden rounded-md bg-base-300"
        >
          {p.imageUrl ? (
            <img
              src={imageKitOptimizedUrl(p.imageUrl, ikPreset)}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="flex h-full min-h-[2rem] w-full items-center justify-center">
              <PackageIcon className="size-4 text-base-content/30" aria-hidden />
            </div>
          )}
          {i === cap - 1 && rest > 0 ? (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral/90 text-sm font-bold tabular-nums text-neutral-content">
              +{rest}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
