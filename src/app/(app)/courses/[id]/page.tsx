"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, FileText, LayoutGrid, Library, PlayCircle, Star, User, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { useAsync } from "@/components/ui/use-async";
import { INSTRUCTOR_PROFILES, SPOTLIGHT_TESTIMONIALS } from "@/data/content";
import { api } from "@/lib/api";
import { createLogger } from "@/lib/logger";
import { fadeUp, spring, stagger } from "@/lib/motion";

const log = createLogger("ui.course-detail");

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "curriculum", label: "Curriculum", icon: FileText },
  { id: "instructor", label: "Instructor", icon: User },
  { id: "reviews", label: "Reviews", icon: Star },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: course, error, loading, reload } = useAsync("course detail", () => api.getCourse(id), [id]);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [tab, setTab] = useState<TabId>("overview");
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    if (course) setVideoId(course.previewVideoId);
  }, [course]);

  if (error) return <ErrorState message={error.message} onRetry={reload} />;

  if (loading || !course) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Skeleton className="aspect-video rounded-2xl" />
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-full" />
        </div>
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  const instructor = INSTRUCTOR_PROFILES.find((person) => person.name === course.instructor) ?? INSTRUCTOR_PROFILES[0];
  const lessonCount = course.modules.reduce((total, module) => total + module.lessons.length, 0);
  const details = [
    { icon: User, label: "Instructor", value: course.instructor },
    { icon: Clock, label: "Duration", value: `${course.hours} hours` },
    { icon: Library, label: "Subject", value: course.category },
    { icon: Users, label: "Enrolled", value: course.learners.toLocaleString() },
    { icon: FileText, label: "Lessons", value: String(lessonCount) },
  ];

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="flex flex-col gap-4 lg:col-span-2">
        <motion.div variants={fadeUp} className="aspect-video overflow-hidden rounded-2xl border border-line bg-subtle">
          {videoId && (
            <iframe
              key={videoId}
              src={`https://www.youtube-nocookie.com/embed/${videoId}`}
              title={course.title}
              className="h-full w-full"
              allow="accelerometer; encrypted-media; picture-in-picture"
              allowFullScreen
              onLoad={() => log.info("Video player loaded", { courseId: course.id, videoId })}
            />
          )}
        </motion.div>

        <motion.div variants={fadeUp} className="flex flex-col gap-3">
          <div className="flex gap-2">
            <Badge tone="accent">{course.category}</Badge>
            <Badge>{course.level}</Badge>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">{course.title}</h1>
          <div className="flex items-center gap-3 text-sm text-muted">
            <Image src={instructor.image} alt="" width={32} height={32} unoptimized className="h-8 w-8 rounded-full object-cover" />
            <span>{course.instructor}</span>
            <span className="inline-flex items-center gap-1">
              <Star size={14} className="text-warm" fill="currentColor" aria-hidden /> {course.rating} ({course.reviewCount.toLocaleString()} reviews)
            </span>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} role="tablist" aria-label="Course sections" className="flex gap-1 overflow-x-auto rounded-xl bg-surface p-1">
          {TABS.map((item) => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setTab(item.id);
                  log.info("Course tab changed", { courseId: course.id, tab: item.id });
                }}
                className={`relative flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${active ? "text-accent-ink" : "text-muted hover:text-ink"}`}
              >
                {active && <motion.span layoutId="course-tab" transition={spring} className="absolute inset-0 rounded-lg bg-accent" />}
                <item.icon size={16} className="relative" aria-hidden />
                <span className="relative">{item.label}</span>
              </button>
            );
          })}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div key={tab} role="tabpanel" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0, transition: spring }} exit={{ opacity: 0, y: -4, transition: { duration: 0.1 } }} className="card-fx rounded-2xl border border-line bg-surface p-4">
            {tab === "overview" && (
              <div className="flex flex-col gap-6">
                <p className="text-muted">{course.summary}</p>
                <div>
                  <h2 className="text-lg font-semibold text-ink">What you will learn</h2>
                  <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {course.outcomes.map((outcome) => (
                      <li key={outcome} className="flex items-start gap-2 text-sm text-muted">
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-warm" aria-hidden />
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {tab === "curriculum" && (
              <div className="flex flex-col gap-6">
                {course.modules.map((module) => (
                  <div key={module.id}>
                    <h2 className="text-base font-semibold text-ink">{module.title}</h2>
                    <ul className="mt-2 flex flex-col">
                      {module.lessons.map((lesson) => (
                        <li key={lesson.id}>
                          <button
                            type="button"
                            onClick={() => {
                              setVideoId(lesson.videoId);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                              log.info("Lesson selected", { courseId: course.id, lessonId: lesson.id });
                            }}
                            className={`row-fx flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm ${videoId === lesson.videoId ? "text-accent" : "text-muted"}`}
                          >
                            <PlayCircle size={18} aria-hidden />
                            <span className="flex-1">{lesson.title}</span>
                            <span className="text-xs">{lesson.durationMinutes} min</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
            {tab === "instructor" && (
              <div className="flex flex-col items-start gap-4 sm:flex-row">
                <Image src={instructor.image} alt={instructor.name} width={96} height={96} unoptimized className="h-24 w-24 rounded-2xl object-cover" />
                <div>
                  <h2 className="text-lg font-semibold text-ink">{course.instructor}</h2>
                  <p className="text-sm text-muted">{instructor.role}</p>
                  <p className="mt-3 text-sm text-muted">Industry practitioner with over a decade of experience teaching and shipping production systems. Focuses on practical, project based instruction.</p>
                </div>
              </div>
            )}
            {tab === "reviews" && (
              <ul className="flex flex-col gap-6">
                {SPOTLIGHT_TESTIMONIALS.map((review) => (
                  <li key={review.id} className="flex gap-4">
                    <Image src={review.image} alt="" width={48} height={48} unoptimized className="h-12 w-12 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-medium text-ink">{review.name}</p>
                      <p className="mt-1 text-sm text-muted">{review.quote}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.aside variants={fadeUp} className="flex h-fit flex-col gap-4 lg:sticky lg:top-20">
        <div className="card-fx rounded-2xl border border-line bg-surface p-4">
          <p className="text-xl font-semibold text-ink">
            Free <span className="text-sm font-normal text-muted line-through">$80 USD</span>
          </p>
          <dl className="mt-3 flex flex-col divide-y divide-line border-t border-line">
            {details.map((detail) => (
              <div key={detail.label} className="flex items-center justify-between py-2 text-sm">
                <dt className="inline-flex items-center gap-3 text-muted">
                  <detail.icon size={15} aria-hidden /> {detail.label}
                </dt>
                <dd className="font-medium text-ink">{detail.value}</dd>
              </div>
            ))}
          </dl>
          <Button
            className="mt-3 w-full"
            disabled={enrolled}
            onClick={() => {
              setEnrolled(true);
              log.info("Enrollment confirmed", { courseId: course.id });
            }}
          >
            {enrolled ? "Enrolled" : "Start now"}
          </Button>
        </div>

        <div className="card-fx rounded-2xl border border-line bg-surface p-4">
          <h2 className="mb-2 text-sm font-semibold text-ink">Course content</h2>
          <div className="flex max-h-72 flex-col gap-2 overflow-y-auto pr-1">
            {course.modules.map((module) => (
              <div key={module.id}>
                <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted">{module.title}</p>
                <ul className="flex flex-col">
                  {module.lessons.map((lesson) => {
                    const playing = videoId === lesson.videoId;
                    return (
                      <li key={lesson.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setVideoId(lesson.videoId);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                            log.info("Lesson selected", { courseId: course.id, lessonId: lesson.id });
                          }}
                          className={`row-fx flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-xs ${playing ? "bg-accent-soft text-accent" : "text-muted"}`}
                        >
                          <PlayCircle size={15} className="shrink-0" aria-hidden />
                          <span className="flex-1 truncate">{lesson.title}</span>
                          <span className="shrink-0 text-[11px]">{lesson.durationMinutes}m</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </motion.aside>
    </motion.div>
  );
}
