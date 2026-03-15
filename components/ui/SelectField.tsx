import type { SelectHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFieldProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label: string;
  options: ReadonlyArray<SelectOption>;
  containerClassName?: string;
}

export function SelectField({
  className,
  containerClassName,
  id,
  label,
  options,
  ...rest
}: SelectFieldProps) {
  const selectId = id ?? label;

  return (
    <div className={cn("flex w-full flex-col gap-2", containerClassName)}>
      <label className="typo-small-text text-text-primary" htmlFor={selectId}>
        {label}
      </label>
      <div className="relative w-full">
        <select
          className={cn(
            "h-[45px] w-full appearance-none rounded-lg border border-transparent bg-input-background px-3 pr-10 typo-small-text text-text-primary focus:border-kmu-blue focus:outline-none",
            className
          )}
          id={selectId}
          {...rest}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
        >
          ▾
        </span>
      </div>
    </div>
  );
}
