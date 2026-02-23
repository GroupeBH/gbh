import * as React from "react";

import { cn } from "./utils";

type ButtonVariant = "default" | "outline" | "ghost" | "secondary";
type ButtonSize = "default" | "sm" | "lg" | "icon";

const baseClasses =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gbh-mint-deep)] focus-visible:ring-offset-2";

const variantClasses: Record<ButtonVariant, string> = {
  default:
    "bg-[linear-gradient(135deg,#6d24d9,#a33fff,#d060ff)] text-white shadow-[0_12px_30px_rgba(128,39,206,0.42)] hover:-translate-y-0.5 hover:brightness-110",
  outline:
    "border-2 border-purple-300 bg-[linear-gradient(135deg,#f2f0f5,#ece8f1)] text-[var(--gbh-violet-800)] hover:border-[var(--gbh-violet-500)] hover:bg-[linear-gradient(135deg,#f7f5fa,#f0ecf5)] hover:-translate-y-0.5",
  ghost:
    "bg-[linear-gradient(135deg,#f2f0f5,#ece8f1)] text-[var(--gbh-violet-800)] hover:bg-[linear-gradient(135deg,#f7f5fa,#f0ecf5)] hover:-translate-y-0.5",
  secondary:
    "bg-[linear-gradient(135deg,#0ebfa9,#37e3ce,#9b73ff)] text-white shadow-[0_12px_28px_rgba(38,188,169,0.36)] hover:-translate-y-0.5 hover:brightness-110",
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
