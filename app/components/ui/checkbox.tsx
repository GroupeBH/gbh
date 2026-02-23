import * as React from "react";

import { cn } from "./utils";

export type CheckboxProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  onCheckedChange?: (checked: boolean) => void;
};

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, onChange, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="checkbox"
        className={cn(
          "h-4 w-4 cursor-pointer rounded border-2 border-purple-200 text-[var(--gbh-magenta)] accent-[var(--gbh-magenta)] focus:outline-none focus:ring-2 focus:ring-[var(--gbh-mint-soft)]",
          className,
        )}
        onChange={(event) => {
          onChange?.(event);
          onCheckedChange?.(event.target.checked);
        }}
        {...props}
      />
    );
  },
);

Checkbox.displayName = "Checkbox";
