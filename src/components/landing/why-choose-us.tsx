"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Headphones, Infinity as InfinityIcon, Laptop } from "lucide-react";
import { FEATURES } from "@/data/content";
import { cardHover, fadeUp, stagger } from "@/lib/motion";
import { SectionHeading, sectionViewport } from "./section-heading";

const ICONS = { laptop: Laptop, infinity: InfinityIcon, badge: BadgeCheck, headphones: Headphones } as const;

export function WhyChooseUs() {
  return (
    <section id="about" className="mx-auto max-w-page px-4 py-24 sm:px-8">
      <SectionHeading title="Why choose" accent="us?" description="We are committed to providing the best learning experience for our students." />
      <motion.ul variants={stagger} initial="hidden" whileInView="visible" viewport={sectionViewport} className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((feature) => {
          const Icon = ICONS[feature.icon];
          return (
            <motion.li key={feature.title} variants={fadeUp} whileHover={cardHover} className="flex flex-col items-center gap-4 rounded-2xl border border-line bg-surface p-8 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft text-accent">
                <Icon size={28} aria-hidden />
              </span>
              <h3 className="font-semibold text-ink">{feature.title}</h3>
              <p className="text-sm text-muted">{feature.text}</p>
            </motion.li>
          );
        })}
      </motion.ul>
    </section>
  );
}
