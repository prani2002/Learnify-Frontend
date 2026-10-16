"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Share2, Star, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { thumbnailUrl } from "@/data/courses";
import { createLogger } from "@/lib/logger";
import { cardHover, fadeUp } from "@/lib/motion";
import type { Course } from "@/types";

const log = createLogger("ui.course-card");

export function CourseCard({ course, href }: { course: Course; href?: string }) {
  const target = href ?? `/courses/${course.id}`;
  const lessonCount = course.modules.reduce((total, module) => total + module.lessons.length, 0);

  const share = async () => {
    const url = `${window.location.origin}/courses/${course.id}`;
    try {
      await navigator.clipboard.writeText(url);
      log.info("Course link copied", { courseId: course.id });
    } catch (error) {
      log.warn("Course link copy failed", { courseId: course.id, reason: String(error) });
    }
  };

  return (
    <motion.article variants={fadeUp} whileHover={cardHover} className="group h-full">
      <div className="card-fx flex h-full flex-col rounded-2xl border border-line bg-surface">
        <Link href={target} className="relative block aspect-[2/1] overflow-hidden bg-subtle" aria-label={course.title}>
          <Image src={thumbnailUrl(course.thumbnailVideoId)} alt="" fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-110" unoptimized />
        </Link>
        <div className="flex flex-1 flex-col p-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <Link href={target} className="block truncate text-sm font-semibold text-ink hover:text-accent">
                {course.title}
              </Link>
              <p className="mt-1 truncate text-xs text-muted">{course.instructor}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Badge>{course.level}</Badge>
              {course.learners > 20000 && <Badge tone="accent">Popular</Badge>}
            </div>
          </div>
          <p className="mt-2 line-clamp-2 text-xs text-muted">{course.summary}</p>
          <div className="mt-2 flex items-center gap-4 text-xs text-muted">
            <span className="inline-flex items-center gap-1"><Star size={14} aria-hidden /> {course.rating}</span>
            <span className="inline-flex items-center gap-1"><Clock size={14} aria-hidden /> {course.hours}h</span>
            <span className="inline-flex items-center gap-1"><Users size={14} aria-hidden /> {course.learners.toLocaleString()}</span>
          </div>
          <div className="mt-auto flex items-center gap-2 pt-3">
            <div className="flex-1">
              <Button href={target} fullWidth className="!h-9">
                View
              </Button>
            </div>
            <Button variant="secondary" className="!h-9" onClick={share} ariaLabel={`Share ${course.title}`}>
              <Share2 size={14} aria-hidden /> Share
            </Button>
          </div>
        </div>
        <p className="border-t border-line px-3 py-1.5 text-center text-[11px] text-muted">{lessonCount} lessons · Certificate included</p>
      </div>
    </motion.article>
  );
}
