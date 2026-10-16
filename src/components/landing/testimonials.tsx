"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { REVIEWS } from "@/data/content";
import { cardHover, fadeUp, stagger } from "@/lib/motion";
import { SectionHeading, sectionViewport } from "./section-heading";

export function Testimonials() {
  return (
    <section id="stories" className="border-y border-line bg-peach">
      <div className="mx-auto max-w-page px-4 py-24 sm:px-8">
        <SectionHeading title="What our students" accent="say" description="Real success stories from our community of learners." />
        <motion.ul variants={stagger} initial="hidden" whileInView="visible" viewport={sectionViewport} className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {REVIEWS.map((review) => (
            <motion.li key={review.id} variants={fadeUp} whileHover={cardHover} className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-warm text-onwarm">
                <Quote size={18} aria-hidden />
              </span>
              <div className="flex gap-1 text-warm" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} size={14} fill="currentColor" aria-hidden />
                ))}
              </div>
              <p className="text-sm text-muted">{review.quote}</p>
              <div className="mt-auto flex items-center gap-3 border-t border-line pt-4">
                <Image src={review.image} alt="" width={40} height={40} unoptimized className="h-10 w-10 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-medium text-ink">{review.name}</p>
                  <p className="text-xs text-muted">{review.role}</p>
                </div>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
