"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { buttonTap } from "@/lib/motion";

type Variant = "primary" | "secondary" | "ghost" | "warm";
type Size = "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary: "fx fx-liquid fx-primary bg-accent text-accent-ink",
  secondary: "fx fx-gooey bg-subtle text-ink",
  warm: "fx fx-liquid fx-warm bg-warm text-onwarm",
  ghost: "bg-transparent text-muted hover:bg-subtle hover:text-ink",
};

const SIZES: Record<Size, string> = {
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

interface ButtonProps {
  variant?: Variant;
  size?: Size;
  href?: string;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  ariaLabel?: string;
}

function Blobs() {
  return (
    <span className="fx-blobs" aria-hidden>
      <i />
      <i />
      <i />
    </span>
  );
}

export function Button({ variant = "primary", size = "md", href, loading, fullWidth, className = "", children, disabled, type = "button", onClick, ariaLabel }: ButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-lg font-medium disabled:cursor-not-allowed disabled:opacity-60 ${fullWidth ? "w-full" : ""} ${VARIANTS[variant]} ${SIZES[size]} ${className}`;
  const motionProps = { whileHover: { y: -1 }, whileTap: buttonTap };
  const blobs = variant === "secondary" ? <Blobs /> : null;

  if (href) {
    return (
      <motion.span {...motionProps} className={fullWidth ? "flex w-full" : "inline-flex"}>
        <Link href={href} className={classes} onClick={onClick} aria-label={ariaLabel}>
          {blobs}
          {children}
        </Link>
      </motion.span>
    );
  }

  return (
    <motion.button {...motionProps} type={type} onClick={onClick} disabled={disabled || loading} aria-label={ariaLabel} className={classes}>
      {blobs}
      {loading && <Spinner />}
      {children}
    </motion.button>
  );
}

export function Spinner({ className = "" }: { className?: string }) {
  return (
    <motion.span
      aria-hidden
      className={`inline-block h-4 w-4 rounded-full border-2 border-current border-t-transparent ${className}`}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
    />
  );
}
