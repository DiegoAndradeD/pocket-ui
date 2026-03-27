"use client";

import { useState, useRef, useEffect, useId, type ReactNode } from "react";
import { cn } from "../../lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TrayTrigger = "click" | "hover";
export type TrayDirection = "up" | "down" | "left" | "right";
export type TrayAlign = "start" | "center" | "end";
export type TrayVariant = "default" | "alternative";

export interface TrayProps {
  /** Content rendered inside the trigger button. */
  trigger: ReactNode;

  /** Items / content rendered inside the expanded panel. */
  children: ReactNode;

  /** Whether opening happens on click or on mouse-enter. Defaults to "click". */
  expand?: TrayTrigger;

  /** Direction in which the panel expands. Defaults to "down". */
  direction?: TrayDirection;

  /**
   * Alignment of the panel relative to the trigger.
   * For vertical directions aligns horizontally; for horizontal directions aligns vertically.
   * Defaults to "start".
   */
  align?: TrayAlign;

  /** Color scheme. Defaults to "default". */
  variant?: TrayVariant;

  /** Controlled open state. When provided, `onOpenChange` must also be provided. */
  open?: boolean;

  /** Callback fired when the open state changes. */
  onOpenChange?: (open: boolean) => void;

  /** Uncontrolled initial open state. Defaults to false. */
  defaultOpen?: boolean;

  /** Disables trigger interaction. */
  isDisabled?: boolean;

  /** Gap between items inside the panel (Tailwind gap class value). Defaults to 1. */
  gap?: 0 | 1 | 2 | 3 | 4;

  /**
   * Delay in ms before closing when `expand="hover"`.
   * Gives the user time to move the cursor into the panel. Defaults to 120.
   */
  hoverCloseDelay?: number;

  classNames?: {
    /** Outermost wrapper. */
    wrapper?: string;
    /** The trigger button. */
    trigger?: string;
    /** The expanding panel. */
    panel?: string;
    /** Inner flex container holding the children. */
    inner?: string;
  };
}

// ─── Class maps ───────────────────────────────────────────────────────────────

// Panel positioning relative to the trigger
const DIRECTION_PANEL: Record<TrayDirection, string> = {
  down: "top-full pt-1.5",
  up: "bottom-full pb-1.5",
  right: "left-full pl-1.5",
  left: "right-full pr-1.5",
};

// Axis the panel stacks along
const DIRECTION_INNER: Record<TrayDirection, string> = {
  down: "flex-col",
  up: "flex-col",
  right: "flex-row",
  left: "flex-row",
};

// Alignment on the cross-axis
const ALIGN_CLASSES: Record<TrayDirection, Record<TrayAlign, string>> = {
  down: {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  },
  up: { start: "left-0", center: "left-1/2 -translate-x-1/2", end: "right-0" },
  right: {
    start: "top-0",
    center: "top-1/2 -translate-y-1/2",
    end: "bottom-0",
  },
  left: { start: "top-0", center: "top-1/2 -translate-y-1/2", end: "bottom-0" },
};

// Enter animation (transform origin matches the direction the panel grows from)
const OPEN_ANIMATE: Record<TrayDirection, string> = {
  down: "animate-[tray-in-down_180ms_ease-out_forwards]",
  up: "animate-[tray-in-up_180ms_ease-out_forwards]",
  right: "animate-[tray-in-right_180ms_ease-out_forwards]",
  left: "animate-[tray-in-left_180ms_ease-out_forwards]",
};

// Exit animation
const CLOSE_ANIMATE: Record<TrayDirection, string> = {
  down: "animate-[tray-out-down_140ms_ease-in_forwards]",
  up: "animate-[tray-out-up_140ms_ease-in_forwards]",
  right: "animate-[tray-out-right_140ms_ease-in_forwards]",
  left: "animate-[tray-out-left_140ms_ease-in_forwards]",
};

const GAP_CLASSES: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: "gap-0",
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Tray({
  trigger,
  children,
  expand = "click",
  direction = "down",
  align = "start",
  variant = "default",
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
  isDisabled = false,
  gap = 1,
  hoverCloseDelay = 120,
  classNames,
}: TrayProps) {
  const instanceId = useId();
  const panelId = `${instanceId}-panel`;

  // ── Open state (uncontrolled / controlled) ────────────────────────────────────
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  function setOpen(next: boolean) {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  }

  // ── Closing animation state ───────────────────────────────────────────────────
  // We keep the panel mounted briefly while the exit animation plays.
  const [isMounted, setIsMounted] = useState(defaultOpen);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const hoverTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (isOpen) {
      clearTimeout(closeTimer.current);
      setIsMounted(true);
      setIsClosing(false);
    } else if (isMounted) {
      // Let exit animation finish (140 ms) before unmounting
      setIsClosing(true);
      closeTimer.current = setTimeout(() => {
        setIsMounted(false);
        setIsClosing(false);
      }, 150);
    }
    return () => clearTimeout(closeTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // ── Outside click (click mode) ────────────────────────────────────────────────
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || expand !== "click") return;
    const handler = (e: PointerEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, expand]);

  // ── Hover handlers ────────────────────────────────────────────────────────────
  function onMouseEnter() {
    if (expand !== "hover" || isDisabled) return;
    clearTimeout(hoverTimer.current);
    setOpen(true);
  }

  function onMouseLeave() {
    if (expand !== "hover") return;
    hoverTimer.current = setTimeout(() => setOpen(false), hoverCloseDelay);
  }

  // ── Click handler ─────────────────────────────────────────────────────────────
  function onTriggerClick() {
    if (expand !== "click" || isDisabled) return;
    setOpen(!isOpen);
  }

  // ── Keyboard ──────────────────────────────────────────────────────────────────
  function onTriggerKeyDown(e: React.KeyboardEvent) {
    if (expand !== "click") return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(!isOpen);
    }
    if (e.key === "Escape") setOpen(false);
  }

  // ─── Variant flags ────────────────────────────────────────────────────────────
  //
  //  "default"     → background / foreground / border / muted / ring
  //  "alternative" → primary / primary-foreground / ring
  //
  const isAlt = variant === "alternative";

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <div
      ref={wrapperRef}
      className={cn("relative inline-flex", classNames?.wrapper)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* ── Trigger ── */}
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls={isMounted ? panelId : undefined}
        aria-disabled={isDisabled}
        disabled={isDisabled}
        onClick={onTriggerClick}
        onKeyDown={onTriggerKeyDown}
        className={cn(
          "inline-flex items-center justify-center gap-2 select-none outline-none",
          "transition-colors duration-150 cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          !isAlt && "text-foreground hover:text-foreground/80",
          isAlt && "text-primary-foreground hover:text-primary-foreground/80",
          isDisabled && "opacity-50 cursor-not-allowed pointer-events-none",
          classNames?.trigger,
        )}
      >
        {trigger}

        {/* Chevron indicator — rotates with the expand direction */}
        <ChevronIcon
          className={cn(
            "h-3.5 w-3.5 shrink-0 transition-transform duration-200",
            !isAlt && "text-muted-foreground",
            isAlt && "text-primary-foreground/60",
            // Rotate the chevron to point toward the expansion direction
            direction === "down" && (isOpen ? "rotate-180" : "rotate-0"),
            direction === "up" && (isOpen ? "rotate-0" : "rotate-180"),
            direction === "right" && (isOpen ? "-rotate-90" : "rotate-90"),
            direction === "left" && (isOpen ? "rotate-90" : "-rotate-90"),
          )}
        />
      </button>

      {/* ── Panel ── */}
      {isMounted && (
        <div
          id={panelId}
          role="region"
          className={cn(
            "absolute z-50",
            DIRECTION_PANEL[direction],
            ALIGN_CLASSES[direction][align],
            isClosing ? CLOSE_ANIMATE[direction] : OPEN_ANIMATE[direction],
            classNames?.panel,
          )}
        >
          <div
            className={cn(
              "flex rounded-lg border shadow-md p-1",
              DIRECTION_INNER[direction],
              GAP_CLASSES[gap],
              !isAlt && "bg-background border-border text-foreground",
              isAlt && "bg-primary border-primary text-primary-foreground",
              classNames?.inner,
            )}
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Inline SVG icons (zero dependencies) ────────────────────────────────────

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
