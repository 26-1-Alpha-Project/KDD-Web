import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label: string;
  containerClassName?: string;
}

export function TextField({
  className,
  containerClassName,
  id,
  label,
  ...rest
}: TextFieldProps) {
  const inputId = id ?? label;

  return (
    <div className={cn("flex w-full flex-col gap-2", containerClassName)}>
      <label className="typo-small-text text-text-primary" htmlFor={inputId}>
        {label}
      </label>
      <input
        className={cn(
          "h-12 w-full rounded-lg border border-transparent bg-input-background px-3 typo-paragraph text-text-primary placeholder:text-text-muted focus:border-kmu-blue focus:outline-none",
          className
        )}
        id={inputId}
        {...rest}
      />
    </div>
  );
}
