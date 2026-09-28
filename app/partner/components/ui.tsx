"use client";

import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import Link from "next/link";
import { ArrowLeft, X } from "lucide-react";

export const GRADIENT_TEXT = {
  background: "linear-gradient(169.21deg, #FF6B6B 9%, #BA2121 77%, #670000 100%)",
  WebkitBackgroundClip: "text" as const,
  WebkitTextFillColor: "transparent" as const,
  backgroundClip: "text" as const,
};

export const GRADIENT_BG = {
  background: "linear-gradient(169.21deg, #FF6B6B 9%, #BA2121 77%, #670000 100%)",
};

const FIELD_LABEL = "block text-sm font-bold text-slate-700 mb-2";
const FIELD_ERROR = "mt-1.5 text-xs font-semibold text-red-600";

export function Field({
  label,
  error,
  children,
}: {
  label?: string;
  error?: string | null;
  children: ReactNode;
}) {
  return (
    <div>
      {label ? <label className={FIELD_LABEL}>{label}</label> : null}
      {children}
      {error ? <p className={FIELD_ERROR}>{error}</p> : null}
    </div>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl px-4 py-3 text-sm font-medium text-slate-900 input-gradient-focus placeholder:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed ${props.className ?? ""}`}
    />
  );
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-xl px-4 py-3 text-sm font-medium text-slate-900 input-gradient-focus placeholder:text-slate-400 resize-none disabled:opacity-50 ${props.className ?? ""}`}
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full rounded-xl px-4 py-3 text-sm font-medium text-slate-900 input-gradient-focus disabled:opacity-50 ${props.className ?? ""}`}
    />
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  loading?: boolean;
}

export function Button({ variant = "primary", loading, disabled, className, children, ...rest }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

  const variantClass = {
    primary: "text-white shadow-[0_10px_25px_-8px_rgba(186,33,33,0.5)] hover:scale-[1.02]",
    secondary: "bg-slate-900 text-white hover:bg-slate-800",
    outline: "border-2 border-[#BA2121]/20 text-[#BA2121] hover:bg-[#BA2121]/5",
    ghost: "text-slate-600 hover:bg-slate-100",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
  }[variant];

  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={`${base} ${variantClass} ${className ?? ""}`}
      style={variant === "primary" ? GRADIENT_BG : undefined}
    >
      {loading ? <Spinner /> : null}
      {children}
    </button>
  );
}

export function Spinner({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={`${className} animate-spin`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

export function Card({
  children,
  className = "",
  ...rest
}: { children: ReactNode; className?: string } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...rest}
      className={`bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.06)] p-6 lg:p-8 ${className}`}
    >
      {children}
    </div>
  );
}

export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "success" | "warning" | "danger" | "brand";
  children: ReactNode;
}) {
  const toneClass = {
    neutral: "bg-slate-100 text-slate-600",
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
    danger: "bg-red-50 text-red-700",
    brand: "bg-[#BA2121]/10 text-[#BA2121]",
  }[tone];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${toneClass}`}>
      {children}
    </span>
  );
}

export function OptionCard({
  icon,
  label,
  selected,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 px-4 py-5 text-center transition-all duration-200 active:scale-95 ${
        selected
          ? "border-transparent text-white shadow-[0_10px_25px_-8px_rgba(186,33,33,0.5)]"
          : "border-slate-100 text-slate-600 hover:border-[#BA2121]/20 hover:bg-[#BA2121]/5"
      }`}
      style={selected ? GRADIENT_BG : undefined}
    >
      <span className={`[&>svg]:w-6 [&>svg]:h-6 ${selected ? "text-white" : "text-[#BA2121]"}`}>{icon}</span>
      <span className="text-sm font-bold">{label}</span>
    </button>
  );
}

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      {icon ? <div className="w-12 h-12 mb-4 text-slate-300 [&>svg]:w-full [&>svg]:h-full">{icon}</div> : null}
      <h3 className="text-lg font-extrabold text-slate-900 mb-2">{title}</h3>
      {description ? <p className="text-sm text-slate-500 max-w-sm mb-6">{description}</p> : null}
      {action}
    </div>
  );
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  isLoading,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-6" onClick={isLoading ? undefined : onCancel}>
      <div
        className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-extrabold text-slate-900 mb-2">{title}</h3>
        {description ? <p className="text-sm text-slate-500 mb-6">{description}</p> : <div className="mb-4" />}
        <div className="flex gap-3">
          <Button variant="ghost" className="flex-1 justify-center bg-slate-100" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button className="flex-1 justify-center" onClick={onConfirm} loading={isLoading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Bottom-anchored on mobile (slides up from the bottom edge, rounded top
 * corners only), centered/modal-style from `sm:` up — same backdrop +
 * click-outside-to-close + `stopPropagation` on the panel as `ConfirmDialog`.
 */
export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/40 sm:p-6"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg max-h-[85vh] sm:max-h-[85vh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-[sheet-in_0.2s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 mb-4">
          {title ? <h3 className="text-lg font-extrabold text-slate-900">{title}</h3> : <span />}
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 shrink-0 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <X size={15} />
          </button>
        </div>
        {children}
      </div>
      <style jsx>{`
        @keyframes sheet-in {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-[#BA2121] transition-colors mb-4"
    >
      <ArrowLeft size={15} strokeWidth={2.4} />
      {label}
    </Link>
  );
}

const FOOD_TYPE_COLOR: Record<"VEG" | "EGG" | "NON_VEG" | "VEGAN", { border: string; dot: string }> = {
  VEG: { border: "border-emerald-600", dot: "bg-emerald-600" },
  VEGAN: { border: "border-emerald-600", dot: "bg-emerald-600" },
  EGG: { border: "border-amber-500", dot: "bg-amber-500" },
  NON_VEG: { border: "border-red-600", dot: "bg-red-600" },
};

/** The small square-with-dot indicator used on FSSAI labels — green for veg/vegan, amber for egg, red for non-veg. */
export function FoodTypeDot({ foodType, className = "" }: { foodType: "VEG" | "EGG" | "NON_VEG" | "VEGAN"; className?: string }) {
  const { border, dot } = FOOD_TYPE_COLOR[foodType];
  return (
    <span
      title={foodType.replace("_", " ")}
      className={`inline-flex items-center justify-center w-3.5 h-3.5 rounded-[3px] border-2 shrink-0 ${border} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
    </span>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
        {subtitle ? <p className="text-sm text-slate-500 mt-1">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}
