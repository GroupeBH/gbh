import * as React from "react";

import { cn } from "./utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3 text-base text-[var(--gbh-black-soft)] shadow-sm transition-all placeholder:text-[var(--gbh-gray-text)] focus:border-[var(--gbh-magenta)] focus:outline-none focus:ring-4 focus:ring-[var(--gbh-magenta-light)]",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
