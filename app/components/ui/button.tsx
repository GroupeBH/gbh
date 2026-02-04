import * as React from "react";

import { cn } from "./utils";

type ButtonVariant = "default" | "outline" | "ghost" | "secondary";
type ButtonSize = "default" | "sm" | "lg" | "icon";

const baseClasses =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gbh-magenta)] focus-visible:ring-offset-2";

const variantClasses: Record<ButtonVariant, string> = {
  default: "bg-[var(--gbh-magenta)] text-white hover:bg-[var(--gbh-magenta-dark)]",
  outline:
    "border-2 border-[var(--gbh-magenta)] text-[var(--gbh-magenta)] hover:bg-[var(--gbh-magenta-light)]",
  ghost: "text-[var(--gbh-magenta)] hover:bg-[var(--gbh-magenta-light)]",
  secondary: "bg-[var(--gbh-gray-ui)] text-[var(--gbh-black-soft)] hover:bg-white",
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
