"use client";

import { Textarea } from "@/components/ui/textarea";

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
}

export default function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  helperText,
  error,
  required = false,
}: TextAreaFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-primary ml-0.5">*</span>}
      </label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        aria-invalid={!!error}
        className="min-h-22 resize-none border-0 bg-secondary shadow-none"
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
      {!error && helperText && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}
