"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import { cn } from "../../lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ImageAspect = "video" | "square" | "portrait" | "wide" | "auto";
export type ImageFit = "cover" | "contain" | "fill" | "none";
export type ImageRadius = "none" | "sm" | "md" | "lg" | "xl" | "full";

export interface ImageProps {
  src?: string;
  alt?: string;

  /** Aspect ratio of the wrapper. Defaults to "video" (16/9). */
  aspect?: ImageAspect;

  /** CSS object-fit applied to the <img>. Defaults to "cover". */
  fit?: ImageFit;

  /** Border-radius shorthand applied to both wrapper and image. */
  radius?: ImageRadius;

  /**
   * Show a pulsing skeleton placeholder while the image is loading.
   * Automatically resolves once the image fires onLoad or onError.
   */
  isLoading?: boolean;

  /**
   * Makes the entire card interactive — adds cursor-pointer,
   * scale / brightness hover effect, and focus ring.
   */
  isClickable?: boolean;

  /** Dims the image and disables pointer events. */
  isDisabled?: boolean;

  /**
   * Zoom the image slightly on hover (only active when `isClickable` is true
   * or `zoomOnHover` is explicitly set).
   */
  zoomOnHover?: boolean;

  /** Called when the user clicks the component (requires `isClickable`). */
  onClick?: () => void;

  /**
   * Node rendered on top of the image as a persistent overlay.
   * Useful for badges, gradients, play-buttons, etc.
   * The wrapper is a plain positioning container — pointer events are NOT
   * blocked, so interactive overlay children work normally.
   */
  overlay?: ReactNode;

  /**
   * Custom fallback node rendered when `src` is absent or the image errors.
   * Replaces the default icon.
   */
  fallback?: ReactNode;

  /** Called once the underlying <img> fires its native `load` event. */
  onLoad?: () => void;

  /** Called if the underlying <img> fires its native `error` event. */
  onError?: () => void;

  classNames?: {
    /** Outermost wrapper div. */
    wrapper?: string;
    /** Inner aspect-ratio container. */
    inner?: string;
    /** The <img> element. */
    image?: string;
    /** Skeleton placeholder layer. */
    skeleton?: string;
    /** Fallback wrapper (no src / error). */
    fallbackWrapper?: string;
    /** Fallback icon. */
    fallbackIcon?: string;
    /** Overlay wrapper. */
    overlay?: string;
  };
}

// ─── Class maps ───────────────────────────────────────────────────────────────

const ASPECT_CLASSES: Record<ImageAspect, string> = {
  video: "aspect-video",
  square: "aspect-square",
  portrait: "aspect-[4/5]",
  wide: "aspect-video",
  auto: "",
};

const FIT_CLASSES: Record<ImageFit, string> = {
  cover: "object-cover",
  contain: "object-contain",
  fill: "object-fill",
  none: "object-none",
};

const RADIUS_CLASSES: Record<ImageRadius, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Image({
  src,
  alt = "image",
  aspect = "video",
  fit = "cover",
  radius = "none",
  isLoading = false,
  isClickable = false,
  isDisabled = false,
  zoomOnHover,
  onClick,
  overlay,
  fallback,
  onLoad,
  onError,
  classNames,
}: ImageProps) {
  // ── Internal load / error state ───────────────────────────────────────────────
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // ── Handle already-cached images ──────────────────────────────────────────────
  // When a URL is already in the browser cache, the native `onLoad` event fires
  // synchronously — before React can attach the handler — or not at all on
  // subsequent renders. Checking `img.complete` after mount reliably catches
  // this: `naturalWidth > 0` means success, `=== 0` means the src is broken.
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    if (img.complete && img.naturalWidth > 0) setImgLoaded(true);
    if (img.complete && img.naturalWidth === 0 && src) setImgError(true);
  }, [src]);

  const showSkeleton = isLoading || (!!src && !imgLoaded && !imgError);
  const showFallback = !src || imgError;

  // ── Derived flags ─────────────────────────────────────────────────────────────
  const shouldZoom = zoomOnHover ?? isClickable;
  const isInteractive = isClickable && !isDisabled;

  // ── Handlers ──────────────────────────────────────────────────────────────────
  function handleLoad() {
    setImgLoaded(true);
    onLoad?.();
  }

  function handleError() {
    setImgError(true);
    setImgLoaded(true); // stop showing skeleton
    onError?.();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (isInteractive && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick?.();
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <div
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      aria-disabled={isDisabled || undefined}
      onClick={isInteractive ? onClick : undefined}
      onKeyDown={handleKeyDown}
      className={cn(
        "relative overflow-hidden w-full",
        RADIUS_CLASSES[radius],
        isInteractive && [
          "group",
          "cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "transition-[filter,transform] duration-200",
          "hover:brightness-95 active:brightness-90 active:scale-[0.99]",
        ],
        isDisabled && "opacity-50 pointer-events-none",
        classNames?.wrapper,
      )}
    >
      {/* ── Aspect ratio inner container ── */}
      <div
        className={cn(
          "relative w-full overflow-hidden",
          ASPECT_CLASSES[aspect],
          RADIUS_CLASSES[radius],
          classNames?.inner,
        )}
      >
        {/* ── Skeleton ── */}
        {showSkeleton && (
          <div
            aria-hidden="true"
            className={cn(
              "absolute inset-0 z-10",
              "bg-muted animate-pulse",
              // Shimmer sweep via before: pseudo-element (requires @keyframes shimmer in globals.css)
              "before:absolute before:inset-0",
              "before:bg-linear-to-r before:from-transparent before:via-background/30 before:to-transparent",
              "before:-translate-x-full before:animate-[shimmer_1.4s_infinite]",
              RADIUS_CLASSES[radius],
              classNames?.skeleton,
            )}
          />
        )}

        {/* ── Fallback (no src or load error) ── */}
        {showFallback && !showSkeleton && (
          <div
            className={cn(
              "absolute inset-0 flex flex-col items-center justify-center gap-2",
              "bg-linear-to-br from-muted to-muted/60",
              "border border-border",
              RADIUS_CLASSES[radius],
              classNames?.fallbackWrapper,
            )}
          >
            {fallback ?? (
              <ImageIcon
                className={cn(
                  "w-10 h-10 text-muted-foreground/30",
                  classNames?.fallbackIcon,
                )}
              />
            )}
          </div>
        )}

        {/* ── Image ── */}
        {src && (
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            className={cn(
              "w-full h-full",
              FIT_CLASSES[fit],
              RADIUS_CLASSES[radius],
              // Fade in once loaded
              "transition-opacity duration-300",
              imgLoaded && !imgError ? "opacity-100" : "opacity-0",
              // Zoom on hover — scoped to the img so the wrapper keeps its shape
              shouldZoom && "transition-transform duration-300 ease-out",
              shouldZoom && isInteractive && "group-hover:scale-105",
              classNames?.image,
            )}
          />
        )}

        {/* ── Overlay ── */}
        {overlay && (
          <div
            className={cn(
              // Purely a positioning container — pointer events are intentionally
              // NOT blocked here so overlay children remain fully interactive.
              "absolute inset-0 z-20",
              classNames?.overlay,
            )}
          >
            {overlay}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Inline SVG icons (zero dependencies) ────────────────────────────────────

function ImageIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 16l5-5a2 2 0 0 1 3 0l5 5" />
      <circle cx="16" cy="8" r="1.5" />
    </svg>
  );
}
