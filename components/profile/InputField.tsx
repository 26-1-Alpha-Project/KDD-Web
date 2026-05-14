"use client";

import { Input } from "@/components/ui/input";

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  helperText?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  type?: string;
}

export default function InputField({
  label,
  value,
  onChange,
  placeholder,
  helperText,
  hint,
  error,
  disabled = false,
  required = false,
  type = "text",
}: InputFieldProps) {
  // Show hint only when user is typing but hasn't met the condition yet
  const showHint = !error && hint && value.length > 0;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-primary ml-0.5">*</span>}
      </label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={!!error}
        className={`h-11 border-0 bg-secondary shadow-none ${
          disabled ? "opacity-60" : ""
        }`}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
      {!error && showHint && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      {!error && !showHint && helperText && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}
