import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "play" | "gold" | "card" | "ghost" | "danger";

const styles: Record<Variant, string> = {
  play: "bg-[image:var(--gradient-play)] text-primary-foreground shadow-[var(--shadow-toy)]",
  gold: "bg-[image:var(--gradient-gold)] text-accent-foreground shadow-[var(--shadow-toy)]",
  card: "bg-[image:var(--gradient-card)] text-foreground shadow-[var(--shadow-toy)] border border-border/60",
  ghost: "glass-pill text-foreground",
  danger: "bg-destructive text-destructive-foreground shadow-[var(--shadow-toy)]",
};

export function ToyButton({
  variant = "card",
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; children: ReactNode }) {
  return (
    <button
      {...rest}
      className={cn(
        "toy-press inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-extrabold tracking-wide uppercase select-none disabled:opacity-50",
        styles[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}