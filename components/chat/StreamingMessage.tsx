"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface StreamingMessageProps {
  className?: string;
}

export function StreamingMessage({ className }: StreamingMessageProps) {
  return (
    <div className={cn("flex items-center gap-1 px-4 py-3", className)}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-2 rounded-full bg-muted-foreground"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
