"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LANDING_COURSES } from "@/data/content";
import { cardHover, fadeUp, stagger } from "@/lib/motion";
import { SectionHeading, sectionViewport } from "./section-heading";

export function FeaturedCourses() {
  return (
    <section id="courses" className="mx-auto max-w-page px-4 py-24 sm:px-8">
      <SectionHeading
        align="left"
        title="Featured"
        accent="courses"
        description="Explore our most popular and highly rated courses."
        action={
          <Button href="/login" variant="secondary">
            View all courses
          </Button>
        }
      />
      <motion.ul variants={stagger} initial="hidden" whileInView="visible" viewport={sectionViewport} className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {LANDING_COURSES.map((course) => (
          <motion.li key={course.id} variants={fadeUp} whileHover={cardHover}>
            <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface">
              <div className="relative aspect-[4/3] bg-subtle">
                <Image src={course.image} alt="" fill sizes="(min-width: 1024px) 280px, (min-width: 640px) 50vw, 100vw" className="object-cover" unoptimized />
                <span className="absolute left-3 top-3 rounded-md bg-accent px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-accent-ink">{course.tag}</span>
              </div>
              <div className="flex flex-1 flex-col gap-4 p-5">
                <div className="flex items-center gap-4 text-xs text-muted">
                  <span className="inline-flex items-center gap-1"><Users size={14} aria-hidden /> {course.students} students</span>
                  <Badge>{course.level}</Badge>
                </div>
                <h3 className="font-semibold text-ink">{course.title}</h3>
                <div className="mt-auto">
                  <Button href="/login" fullWidth>
                    <Clock size={14} aria-hidden /> Enroll now
                  </Button>
                </div>
              </div>
            </article>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
