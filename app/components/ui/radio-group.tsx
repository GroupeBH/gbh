import * as React from "react";

import { cn } from "./utils";

type RadioGroupContextValue = {
  name: string;
  value: string;
  onValueChange: (value: string) => void;
};

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(
  null,
);

export type RadioGroupProps = React.HTMLAttributes<HTMLDivElement> & {
  value: string;
  onValueChange: (value: string) => void;
  name?: string;
};

export function RadioGroup({
  className,
  value,
  onValueChange,
  name,
  children,
  ...props
}: RadioGroupProps) {
  const autoName = React.useId();

  return (
    <RadioGroupContext.Provider
      value={{ name: name ?? autoName, value, onValueChange }}
    >
      <div
        role="radiogroup"
        className={cn("grid gap-3", className)}
        {...props}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

export type RadioGroupItemProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "onChange"
> & {
  value: string;
};

export function RadioGroupItem({
  className,
  value,
  ...props
}: RadioGroupItemProps) {
  const context = React.useContext(RadioGroupContext);

  if (!context) {
    throw new Error("RadioGroupItem must be used within a RadioGroup");
  }

  const checked = context.value === value;

  return (
    <input
      type="radio"
      name={context.name}
      value={value}
      checked={checked}
      onChange={() => context.onValueChange(value)}
      className={cn(
        "h-4 w-4 cursor-pointer accent-[var(--gbh-magenta)]",
        className,
      )}
      {...props}
    />
  );
}
