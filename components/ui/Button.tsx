import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary";
type ButtonSize = "lg" | "md";

export interface ButtonProps
  extends PropsWithChildren,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-kmu-blue text-white border border-kmu-blue",
  secondary: "bg-white text-text-primary border border-border-subtle",
};

const sizeClasses: Record<ButtonSize, string> = {
  lg: "h-[46px] rounded-2xl px-4 typo-small-text",
  md: "h-[41px] rounded-lg px-4 typo-small-text",
};

export function Button({
  children,
  className,
  fullWidth = true,
  size = "md",
  type = "button",
  variant = "primary",
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        fullWidth && "w-full",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      type={type}
      {...rest}
    >
      {children}
    </button>
  );
}
