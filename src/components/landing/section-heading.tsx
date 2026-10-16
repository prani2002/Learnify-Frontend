"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";

export const sectionViewport = { once: true, margin: "-80px" } as const;

interface SectionHeadingProps {
  title: string;
  accent: string;
  description?: string;
  align?: "left" | "center";
  action?: React.ReactNode;
  id?: string;
}

export function SectionHeading({ title, accent, description, align = "center", action, id }: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <motion.div
      id={id}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={sectionViewport}
      className={`flex gap-4 ${centered ? "flex-col items-center text-center" : "flex-col sm:flex-row sm:items-end sm:justify-between"}`}
    >
      <div className={`flex flex-col gap-2 ${centered ? "items-center" : ""}`}>
        <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {title} <span className="text-accent">{accent}</span>
        </h2>
        {description && <p className="max-w-xl text-muted">{description}</p>}
      </div>
      {action}
    </motion.div>
  );
}
