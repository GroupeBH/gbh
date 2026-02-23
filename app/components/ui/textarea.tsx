import * as React from "react";

import { cn } from "./utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full rounded-2xl border-2 border-purple-200 bg-white/90 px-4 py-3 text-base text-[var(--gbh-black-soft)] shadow-sm transition-all placeholder:text-[var(--gbh-gray-text)] focus:border-[var(--gbh-mint-deep)] focus:outline-none focus:ring-4 focus:ring-[var(--gbh-mint-soft)]",
          className,
        )}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";

