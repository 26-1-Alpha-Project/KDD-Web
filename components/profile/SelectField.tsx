"use client";

import type { SelectOption } from "@/constants/profile";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectFieldProps<T extends string = string> {
  label: string;
  value: string;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  placeholder?: string;
  error?: string;
  required?: boolean;
}

export default function SelectField<T extends string = string>({
  label,
  value,
  onChange,
  options,
  placeholder = "선택해주세요",
  error,
  required = false,
}: SelectFieldProps<T>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-primary ml-0.5">*</span>}
      </label>
      <Select value={value || undefined} onValueChange={(v) => onChange(v as T)}>
        <SelectTrigger
          aria-invalid={!!error}
          className="h-11 w-full border-0 bg-secondary shadow-none"
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="">
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
