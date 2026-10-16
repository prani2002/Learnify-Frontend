"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IMAGES } from "@/data/content";
import { fadeUp, spring, stagger } from "@/lib/motion";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -30]);

  return (
    <section id="home" ref={ref} className="overflow-hidden bg-peach">
      <div className="mx-auto grid max-w-page items-center gap-12 px-4 py-16 sm:px-8 lg:grid-cols-2 lg:py-24">
        <motion.div style={{ y: textY }} variants={stagger} initial="hidden" animate="visible" className="flex flex-col items-start gap-6">
          <motion.span variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-sm text-accent">
            <ShieldCheck size={16} aria-hidden /> 100% satisfaction guarantee
          </motion.span>
          <motion.h1 variants={fadeUp} className="text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Learn and grow your <span className="text-accent">skills</span> anywhere
          </motion.h1>
          <motion.p variants={fadeUp} className="max-w-md text-lg text-muted">
            Discover a world of knowledge with our comprehensive online courses. Join over 10,000 students learning from expert instructors worldwide.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
            <Button size="lg" href="#courses">
              Explore courses
            </Button>
            <Button size="lg" variant="secondary" href="/login">
              Start free trial
            </Button>
          </motion.div>
        </motion.div>

        <motion.div style={{ y: imageY }} initial={{ opacity: 0, scale: 0.97, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0, transition: { ...spring, delay: 0.15 } }} className="relative">
          <span className="absolute -bottom-4 -right-4 h-full w-full rounded-3xl bg-accent/15" aria-hidden />
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-line bg-subtle">
            <Image src={IMAGES.hero} alt="Students collaborating in a bright study space" fill priority sizes="(min-width: 1024px) 600px, 100vw" className="object-cover" unoptimized />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
