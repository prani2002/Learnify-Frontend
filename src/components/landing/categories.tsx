"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Code2, Coins, PenTool, Sparkles } from "lucide-react";
import { CATEGORIES } from "@/data/content";
import { createLogger } from "@/lib/logger";
import { cardHover, fadeUp, stagger } from "@/lib/motion";
import { SectionHeading, sectionViewport } from "./section-heading";

const log = createLogger("ui.landing");
const ICONS = { web: Code2, data: Sparkles, design: PenTool, writing: BookOpen, finance: Coins } as const;

export function Categories() {
  const [active, setActive] = useState<string>(CATEGORIES[1].id);
  return (
    <section id="categories" className="border-y border-line bg-peach">
      <div className="mx-auto max-w-page px-4 py-24 sm:px-8">
        <SectionHeading title="Explore our course" accent="categories" description="For everyone, we offer a variety of distinctive learning paths." />
        <motion.ul variants={stagger} initial="hidden" whileInView="visible" viewport={sectionViewport} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {CATEGORIES.map((category) => {
            const Icon = ICONS[category.id];
            const selected = active === category.id;
            return (
              <motion.li key={category.id} variants={fadeUp} whileHover={cardHover}>
                <button
                  type="button"
                  onClick={() => {
                    setActive(category.id);
                    log.info("Category previewed", { category: category.name });
                  }}
                  className={`flex h-full w-full flex-col items-center gap-3 rounded-2xl p-6 text-center transition-colors duration-200 ${selected ? "bg-accent text-accent-ink" : "bg-surface text-ink hover:bg-accent-soft"}`}
                >
                  <Icon size={32} aria-hidden />
                  <span className="font-semibold">{category.name}</span>
                  <span className={`text-sm ${selected ? "text-accent-ink/80" : "text-muted"}`}>{category.text}</span>
                  <span className="text-xs font-medium">{category.courses} courses</span>
                </button>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
