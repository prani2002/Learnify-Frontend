"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BookOpen, Star, Users } from "lucide-react";
import { TRAINERS } from "@/data/content";
import { cardHover, fadeUp, stagger } from "@/lib/motion";
import { SectionHeading, sectionViewport } from "./section-heading";

export function Trainers() {
  return (
    <section id="instructors" className="mx-auto max-w-page px-4 py-24 sm:px-8">
      <SectionHeading title="Our expert" accent="trainers" description="Learn from industry professionals with years of real world experience." />
      <motion.ul variants={stagger} initial="hidden" whileInView="visible" viewport={sectionViewport} className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {TRAINERS.map((trainer) => (
          <motion.li key={trainer.id} variants={fadeUp} whileHover={cardHover} className="overflow-hidden rounded-2xl border border-line bg-surface">
            <div className="relative aspect-square bg-accent-soft">
              <Image src={trainer.image} alt={trainer.name} fill sizes="(min-width: 1024px) 280px, (min-width: 640px) 50vw, 100vw" className="object-cover" unoptimized />
            </div>
            <div className="flex flex-col items-center gap-2 p-5 text-center">
              <h3 className="font-semibold text-ink">{trainer.name}</h3>
              <p className="text-sm text-accent">{trainer.role}</p>
              <p className="inline-flex items-center gap-1 text-sm text-muted">
                <Star size={14} className="text-warm" fill="currentColor" aria-hidden /> {trainer.rating}
              </p>
              <div className="flex gap-4 text-xs text-muted">
                <span className="inline-flex items-center gap-1"><BookOpen size={12} aria-hidden /> {trainer.courses} courses</span>
                <span className="inline-flex items-center gap-1"><Users size={12} aria-hidden /> {trainer.students}</span>
              </div>
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
