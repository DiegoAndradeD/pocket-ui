"use client";

import { useState, type ReactNode } from "react";
import { cn } from "../../lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SidebarSide = "left" | "right";
export type SidebarVariant = "default" | "alternative";
export type SidebarCollapse = "button" | "hover" | "none";

export interface SidebarProps {
  children: ReactNode;

  /** Which side of the layout the sidebar occupies. Defaults to "left". */
  side?: SidebarSide;

  /**
   * How the sidebar is collapsed/expanded.
   * - "button"  — a toggle button is rendered (default).
   * - "hover"   — expands on mouse-enter, collapses on mouse-leave.
   * - "none"    — always expanded, no collapse affordance.
   */
  collapse?: SidebarCollapse;

  /** Color scheme. Defaults to "default". */
  variant?: SidebarVariant;

  /** Controlled open state. Pair with `onOpenChange`. */
  open?: boolean;

  /** Fires when the open state should change. */
  onOpenChange?: (open: boolean) => void;

  /** Uncontrolled initial open state. Defaults to true. */
  defaultOpen?: boolean;

  /**
   * Width of the expanded sidebar (any valid CSS width value).
   * Defaults to "240px".
   */
  width?: string;

  /**
   * Width of the collapsed sidebar — visible when `collapse` is "button" or "hover".
   * Defaults to "56px" (enough for icon-only items).
   */
  collapsedWidth?: string;

  /**
   * Optional header slot rendered above the scrollable content area.
   * Receives `collapsed` so you can swap logo ↔ icon.
   */
  header?: (collapsed: boolean) => ReactNode;

  /**
   * Optional footer slot rendered below the scrollable content area.
   * Receives `collapsed` so you can show/hide labels.
   */
  footer?: (collapsed: boolean) => ReactNode;

  classNames?: {
    /** The root <aside> element. */
    root?: string;
    /** Header area. */
    header?: string;
    /** Scrollable content area. */
    content?: string;
    /** Footer area. */
    footer?: string;
    /** The collapse toggle button. */
    toggleButton?: string;
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Sidebar({
  children,
  side = "left",
  collapse = "button",
  variant = "default",
  open: controlledOpen,
  onOpenChange,
  defaultOpen = true,
  width = "240px",
  collapsedWidth = "70px",
  header,
  footer,
  classNames,
}: SidebarProps) {
  // ── Open state (uncontrolled / controlled) ────────────────────────────────────
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  function setOpen(next: boolean) {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  }

  // ── Collapse mode flags ────────────────────────────────────────────────────────
  const isCollapsible = collapse !== "none";
  // When collapsed: icon-only rail. When expanded: full width.
  const collapsed = isCollapsible && !isOpen;

  // ── Variant flags ─────────────────────────────────────────────────────────────
  //
  //  "default"     → background / foreground / border / muted / muted-foreground / ring
  //  "alternative" → primary / primary-foreground / ring
  //
  const isAlt = variant === "alternative";

  // ── Hover handlers (hover mode only) ─────────────────────────────────────────
  const hoverProps =
    collapse === "hover"
      ? {
          onMouseEnter: () => setOpen(true),
          onMouseLeave: () => setOpen(false),
        }
      : {};

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <aside
      data-collapsed={collapsed}
      data-side={side}
      {...hoverProps}
      style={{ width: collapsed ? collapsedWidth : width }}
      className={cn(
        // Layout
        "relative flex flex-col h-full shrink-0 overflow-hidden",
        // Smooth width transition driven purely by inline style + CSS transition
        "transition-[width] duration-200 ease-in-out",
        // Border on the appropriate edge
        side === "left" && "border-r",
        side === "right" && "border-l",
        // Colors
        !isAlt && "bg-background border-border text-foreground",
        isAlt && "bg-primary border-primary text-primary-foreground",
        classNames?.root,
      )}
    >
      {/* ── Header ── */}
      {header && (
        <div
          className={cn(
            "shrink-0 border-b",
            !isAlt && "border-border",
            isAlt && "border-primary-foreground/20",
            classNames?.header,
          )}
        >
          {header(collapsed)}
        </div>
      )}

      {/* ── Scrollable content ── */}
      <div
        className={cn(
          "flex-1 overflow-y-hidden overflow-x-hidden",
          classNames?.content,
        )}
      >
        {children}
      </div>

      {/* ── Footer ── */}
      {footer && (
        <div
          className={cn(
            "shrink-0 border-t",
            !isAlt && "border-border",
            isAlt && "border-primary-foreground/20",
            classNames?.footer,
          )}
        >
          {footer(collapsed)}
        </div>
      )}

      {/* ── Toggle button (collapse="button" only) ── */}
      {collapse === "button" && (
        <button
          type="button"
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          onClick={() => setOpen(!isOpen)}
          className={cn(
            // Pinned to the outer edge, vertically centered
            "absolute top-1/2 -translate-y-1/2 z-10",
            "flex items-center justify-center",
            "h-5 w-5 rounded-full border shadow-sm",
            "transition-[opacity,transform] duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "hover:scale-110 active:scale-95 cursor-pointer",
            side === "left" && "-right-2.5",
            side === "right" && "-left-2.5",
            !isAlt &&
              "bg-background border-border text-muted-foreground hover:text-foreground",
            isAlt &&
              "bg-primary border-primary-foreground/30 text-primary-foreground/60 hover:text-primary-foreground",
            classNames?.toggleButton,
          )}
        >
          <ChevronIcon
            className={cn(
              "h-3 w-3 transition-transform duration-200",
              // When left sidebar: chevron points left when open, right when closed
              side === "left" && (isOpen ? "rotate-180" : "rotate-0"),
              // When right sidebar: chevron points right when open, left when closed
              side === "right" && (isOpen ? "rotate-0" : "rotate-180"),
            )}
          />
        </button>
      )}
    </aside>
  );
}

// ─── Inline SVG icons  ────────────────────────────────────

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
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}
