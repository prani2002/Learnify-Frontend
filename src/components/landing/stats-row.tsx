"use client";

import { motion } from "framer-motion";
import { Award, BookOpen, Star, Users } from "lucide-react";
import { STATS } from "@/data/content";
import { fadeUp, stagger } from "@/lib/motion";
import { CountUp } from "./scroll-effects";
import { sectionViewport } from "./section-heading";

const ICONS = { users: Users, book: BookOpen, award: Award, star: Star } as const;

export function StatsRow() {
  return (
    <section className="border-y border-line bg-subtle">
      <motion.dl variants={stagger} initial="hidden" whileInView="visible" viewport={sectionViewport} className="mx-auto grid max-w-page grid-cols-2 gap-10 px-4 py-16 sm:px-8 md:grid-cols-4">
        {STATS.map((stat) => {
          const Icon = ICONS[stat.icon];
          return (
            <motion.div key={stat.label} variants={fadeUp} className="flex flex-col items-center gap-3 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent">
                <Icon size={22} aria-hidden />
              </span>
              <dd className="text-3xl font-semibold text-ink">
                <CountUp value={stat.value} suffix={stat.suffix} decimals={"decimals" in stat ? stat.decimals : 0} />
              </dd>
              <dt className="text-sm text-muted">{stat.label}</dt>
            </motion.div>
          );
        })}
      </motion.dl>
    </section>
  );
}
