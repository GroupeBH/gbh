import * as React from "react";

import { cn } from "./utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3 text-base text-[var(--gbh-black-soft)] shadow-sm transition-all placeholder:text-[var(--gbh-gray-text)] focus:border-[var(--gbh-magenta)] focus:outline-none focus:ring-4 focus:ring-[var(--gbh-magenta-light)]",
          className,
        )}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";
