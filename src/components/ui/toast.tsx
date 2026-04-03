"use client";

import { useState, useEffect, type ReactNode, type JSX } from "react";
import { cn } from "../../lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastVariant = "default" | "success" | "error" | "warning" | "info";
export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface ToastOptions {
  /** Main message text or node. */
  message: ReactNode;
  /** Optional secondary description. */
  description?: ReactNode;
  /** Visual style. Defaults to "default". */
  variant?: ToastVariant;
  /** Auto-dismiss duration in ms. Pass 0 to disable. Defaults to 4000. */
  duration?: number;
  /** Optional action button rendered on the right. */
  action?: { label: string; onClick: () => void };
}

interface ToastItem extends ToastOptions {
  id: number;
  /** Set to true while the exit animation plays, before the item is removed. */
  closing: boolean;
}

export interface ToastProviderProps {
  /** Where toasts appear on screen. Defaults to "bottom-right". */
  position?: ToastPosition;
  /** Max toasts visible at once. Oldest are dismissed first. Defaults to 5. */
  limit?: number;
  classNames?: {
    /** The fixed viewport container. */
    container?: string;
    /** Individual toast wrapper. */
    toast?: string;
  };
}

// ─── Singleton store ──────────────────────────────────────────────────────────
// Module-level state shared across the entire app.
// ToastProvider subscribes once; toast() / dismiss() push updates to it.

let _id = 0;
let _items: ToastItem[] = [];
let _listeners: Array<(items: ToastItem[]) => void> = [];

function _notify() {
  _listeners.forEach((l) => l([..._items]));
}

function _remove(id: number) {
  _items = _items.filter((t) => t.id !== id);
  _notify();
}

function _close(id: number) {
  // Mark closing → triggers exit animation class
  _items = _items.map((t) => (t.id === id ? { ...t, closing: true } : t));
  _notify();
  // Remove after animation (220 ms matches CSS)
  setTimeout(() => _remove(id), 220);
}

// ─── Public imperative API ────────────────────────────────────────────────────

export function toast(options: ToastOptions): number;
export function toast(
  message: string,
  options?: Omit<ToastOptions, "message">,
): number;
export function toast(
  messageOrOptions: string | ToastOptions,
  extra?: Omit<ToastOptions, "message">,
): number {
  const opts: ToastOptions =
    typeof messageOrOptions === "string"
      ? { message: messageOrOptions, ...extra }
      : messageOrOptions;

  const id = ++_id;
  const item: ToastItem = {
    variant: "default",
    duration: 4000,
    ...opts,
    id,
    closing: false,
  };

  _items = [..._items, item];
  _notify();

  if (item.duration && item.duration > 0) {
    setTimeout(() => _close(id), item.duration);
  }

  return id;
}

/** Convenience shorthands */
toast.success = (
  message: string,
  opts?: Omit<ToastOptions, "message" | "variant">,
) => toast({ message, variant: "success", ...opts });
toast.error = (
  message: string,
  opts?: Omit<ToastOptions, "message" | "variant">,
) => toast({ message, variant: "error", ...opts });
toast.warning = (
  message: string,
  opts?: Omit<ToastOptions, "message" | "variant">,
) => toast({ message, variant: "warning", ...opts });
toast.info = (
  message: string,
  opts?: Omit<ToastOptions, "message" | "variant">,
) => toast({ message, variant: "info", ...opts });

/** Programmatically dismiss a toast by its id. */
export function dismiss(id: number) {
  _close(id);
}

/** Dismiss all toasts immediately. */
export function dismissAll() {
  _items.forEach((t) => _close(t.id));
}

// ─── Class maps ───────────────────────────────────────────────────────────────

const POSITION_CLASSES: Record<ToastPosition, string> = {
  "top-left": "top-4 left-4 items-start",
  "top-center": "top-4 left-1/2 -translate-x-1/2 items-center",
  "top-right": "top-4 right-4 items-end",
  "bottom-left": "bottom-4 left-4 items-start",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 items-center",
  "bottom-right": "bottom-4 right-4 items-end",
};

// Enter animation depends on which edge the toasts slide from
const ENTER_ANIMATE: Record<ToastPosition, string> = {
  "top-left": "animate-[toast-in-left_200ms_ease-out_forwards]",
  "top-center": "animate-[toast-in-top_200ms_ease-out_forwards]",
  "top-right": "animate-[toast-in-right_200ms_ease-out_forwards]",
  "bottom-left": "animate-[toast-in-left_200ms_ease-out_forwards]",
  "bottom-center": "animate-[toast-in-bottom_200ms_ease-out_forwards]",
  "bottom-right": "animate-[toast-in-right_200ms_ease-out_forwards]",
};

const EXIT_ANIMATE: Record<ToastPosition, string> = {
  "top-left": "animate-[toast-out-left_200ms_ease-in_forwards]",
  "top-center": "animate-[toast-out-top_200ms_ease-in_forwards]",
  "top-right": "animate-[toast-out-right_200ms_ease-in_forwards]",
  "bottom-left": "animate-[toast-out-left_200ms_ease-in_forwards]",
  "bottom-center": "animate-[toast-out-bottom_200ms_ease-in_forwards]",
  "bottom-right": "animate-[toast-out-right_200ms_ease-in_forwards]",
};

// Left accent stripe color per variant
const VARIANT_ACCENT: Record<ToastVariant, string> = {
  default: "border-l-ring",
  success: "border-l-green-500",
  error: "border-l-red-500",
  warning: "border-l-amber-500",
  info: "border-l-blue-500",
};

// Icon color per variant
const VARIANT_ICON_COLOR: Record<ToastVariant, string> = {
  default: "text-muted-foreground",
  success: "text-green-500",
  error: "text-red-500",
  warning: "text-amber-500",
  info: "text-blue-500",
};

// ─── ToastProvider ────────────────────────────────────────────────────────────

export function ToastProvider({
  position = "bottom-right",
  limit = 5,
  classNames,
}: ToastProviderProps) {
  // Single useState — updated by the singleton store via _listeners
  const [items, setItems] = useState<ToastItem[]>([]);

  // Single useEffect — subscribes to the singleton on mount, cleans up on unmount
  useEffect(() => {
    _listeners.push(setItems);
    return () => {
      _listeners = _listeners.filter((l) => l !== setItems);
    };
  }, []);

  // Apply limit: show only the most recent N toasts
  const visible = items.slice(-limit);

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className={cn(
        "fixed z-100 flex flex-col gap-2 pointer-events-none",
        POSITION_CLASSES[position],
        classNames?.container,
      )}
    >
      {visible.map((item) => (
        <ToastItem
          key={item.id}
          item={item}
          position={position}
          onDismiss={() => _close(item.id)}
          className={classNames?.toast}
        />
      ))}
    </div>
  );
}

// ─── ToastItem (internal) ─────────────────────────────────────────────────────

interface ToastItemProps {
  item: ToastItem;
  position: ToastPosition;
  onDismiss: () => void;
  className?: string;
}

function ToastItem({ item, position, onDismiss, className }: ToastItemProps) {
  const Icon = VARIANT_ICONS[item.variant ?? "default"];

  return (
    <div
      role="alert"
      aria-atomic="true"
      className={cn(
        // Layout
        "pointer-events-auto flex items-start gap-3",
        "w-85 max-w-[calc(100vw-2rem)]",
        "rounded-lg border border-l-[3px] bg-background shadow-lg px-4 py-3",
        // Variant accent stripe
        VARIANT_ACCENT[item.variant ?? "default"],
        // Animation
        item.closing ? EXIT_ANIMATE[position] : ENTER_ANIMATE[position],
        className,
      )}
    >
      {/* Icon */}
      <Icon
        className={cn(
          "h-4 w-4 mt-0.5 shrink-0",
          VARIANT_ICON_COLOR[item.variant ?? "default"],
        )}
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground leading-snug">
          {item.message}
        </p>
        {item.description && (
          <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
            {item.description}
          </p>
        )}
      </div>

      {/* Action + close */}
      <div className="flex items-center gap-2 shrink-0">
        {item.action && (
          <button
            type="button"
            onClick={item.action.onClick}
            className="text-xs font-medium text-foreground underline-offset-2 hover:underline transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded"
          >
            {item.action.label}
          </button>
        )}
        <button
          type="button"
          aria-label="Dismiss"
          onClick={onDismiss}
          className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded"
        >
          <XIcon className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─── Inline SVG icons  ────────────────────────────────────

const VARIANT_ICONS: Record<
  ToastVariant,
  ({ className }: { className?: string }) => JSX.Element
> = {
  default: CircleIcon,
  success: CheckCircleIcon,
  error: XCircleIcon,
  warning: AlertTriangleIcon,
  info: InfoCircleIcon,
};

function CheckCircleIcon({ className }: { className?: string }) {
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
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="M22 4 12 14.01l-3-3" />
    </svg>
  );
}

function XCircleIcon({ className }: { className?: string }) {
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
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6M9 9l6 6" />
    </svg>
  );
}

function AlertTriangleIcon({ className }: { className?: string }) {
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
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  );
}

function InfoCircleIcon({ className }: { className?: string }) {
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
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}

function CircleIcon({ className }: { className?: string }) {
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
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
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
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
