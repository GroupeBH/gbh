import * as React from "react";

import { cn } from "./utils";

type ButtonVariant = "default" | "outline" | "ghost" | "secondary";
type ButtonSize = "default" | "sm" | "lg" | "icon";

const baseClasses =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gbh-magenta)] focus-visible:ring-offset-2";

const variantClasses: Record<ButtonVariant, string> = {
  default:
    "bg-[linear-gradient(135deg,var(--gbh-violet-700),var(--gbh-magenta))] text-white shadow-[0_10px_24px_rgba(88,34,196,0.32)] hover:-translate-y-0.5 hover:brightness-110",
  outline:
    "border-2 border-[var(--gbh-magenta)] text-[var(--gbh-magenta-dark)] bg-white/70 hover:bg-[var(--gbh-magenta-light)] hover:-translate-y-0.5",
  ghost: "text-[var(--gbh-magenta)] hover:bg-[var(--gbh-magenta-light)] hover:-translate-y-0.5",
  secondary:
    "bg-[linear-gradient(135deg,#f2e8ff,#e0f7ff)] text-[var(--gbh-violet-800)] hover:-translate-y-0.5",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-10 px-4 py-2",
  sm: "h-8 px-3",
  lg: "h-12 px-6 text-base",
  icon: "h-10 w-10",
};

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  className,
  variant = "default",
  size = "default",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    />
  );
}
