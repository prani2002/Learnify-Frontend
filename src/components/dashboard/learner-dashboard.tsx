"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Award, BookOpen, CalendarClock, Clock, Flame, GraduationCap, Target, Video } from "lucide-react";
import { ActivityHeatmap, BarChart, HorizontalBars, RingProgress } from "@/components/charts/charts";
import { CourseCard } from "@/components/courses/course-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/error-state";
import { Panel } from "@/components/ui/panel";
import { ProgressBar } from "@/components/ui/progress-bar";
import { CourseCardSkeleton, Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/ui/stat-card";
import { useAsync } from "@/components/ui/use-async";
import { thumbnailUrl } from "@/data/courses";
import { api } from "@/lib/api";
import { fadeUp, stagger } from "@/lib/motion";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const WEEKLY_GOAL_HOURS = 25;
const ACHIEVEMENTS = [
  { id: "a1", title: "7 day streak", text: "Learned a full week in a row" },
  { id: "a2", title: "Quiz master", text: "Scored above 90% on 5 quizzes" },
  { id: "a3", title: "Fast starter", text: "Finished a course in 14 days" },
];
const SCHEDULE = [
  { id: "s1", title: "React live Q&A", time: "Today · 4:00 PM", tag: "Live" },
  { id: "s2", title: "TypeScript quiz 3", time: "Tomorrow · 10:00 AM", tag: "Quiz" },
  { id: "s3", title: "Python project review", time: "Fri · 2:30 PM", tag: "Review" },
];

export function LearnerDashboard({ name }: { name: string }) {
  const { data, error, loading, reload } = useAsync("learner dashboard", api.getLearnerDashboard);

  if (error) return <ErrorState message={error.message} onRetry={reload} />;

  const learner = data?.learner;
  const weekly = learner ? learner.weeklyHours.map((value, index) => ({ label: DAYS[index], value })) : [];
  const weeklyTotal = weekly.reduce((sum, point) => sum + point.value, 0);
  const goalPercent = Math.min(100, Math.round((weeklyTotal / WEEKLY_GOAL_HOURS) * 100));

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold text-ink">Welcome back, {name.split(" ")[0]}</h1>
        <p className="text-sm text-muted">Your learning statistics and progress at a glance.</p>
      </div>

      <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {loading || !learner ? (
          Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-[112px] rounded-2xl" />)
        ) : (
          <>
            <StatCard label="In progress" value={String(learner.enrolled - learner.completed)} icon={BookOpen} />
            <StatCard label="Completed" value={String(learner.completed)} icon={GraduationCap} />
            <StatCard label="Hours learned" value={String(learner.hours)} change="+12%" trend="up" icon={Clock} />
            <StatCard label="Day streak" value={String(learner.streak)} icon={Flame} />
            <StatCard label="Average score" value={`${learner.avgScore}%`} change="+3%" trend="up" icon={Target} />
            <StatCard label="Certificates" value={String(learner.completed + 2)} icon={Award} />
          </>
        )}
      </motion.div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Panel title="Learning hours this week" description={learner ? `${weeklyTotal} of ${WEEKLY_GOAL_HOURS} hours goal` : undefined} className="lg:col-span-5">
          {loading || !learner ? <Skeleton className="h-40" /> : <BarChart data={weekly} unit="h" height={150} />}
        </Panel>
        <Panel title="Weekly goal" description="Stay consistent to keep your streak." className="lg:col-span-3">
          {loading || !learner ? (
            <Skeleton className="h-32" />
          ) : (
            <div className="flex items-center gap-4">
              <RingProgress value={goalPercent} label="of goal" size={104} />
              <div className="flex flex-col gap-1 text-xs text-muted">
                <p>
                  <span className="text-lg font-semibold text-ink">{Math.max(WEEKLY_GOAL_HOURS - weeklyTotal, 0)}h</span> to go
                </p>
                <p>{learner.streak} day streak</p>
                <p>Best day: {DAYS[learner.weeklyHours.indexOf(Math.max(...learner.weeklyHours))]}</p>
              </div>
            </div>
          )}
        </Panel>
        <Panel title="Upcoming" description="Sessions and deadlines." className="lg:col-span-4" action={<CalendarClock size={16} className="text-accent" aria-hidden />}>
          <ul className="flex flex-col gap-1">
            {SCHEDULE.map((item) => (
              <li key={item.id} className="row-fx -mx-2 flex items-center gap-3 rounded-lg px-2 py-1.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                  <Video size={15} aria-hidden />
                </span>
                <div className="min-w-0 flex-1 leading-tight">
                  <p className="truncate text-sm font-medium text-ink">{item.title}</p>
                  <p className="text-[11px] text-muted">{item.time}</p>
                </div>
                <Badge tone={item.tag === "Live" ? "warm" : "accent"}>{item.tag}</Badge>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Panel title="Continue learning" className="lg:col-span-5">
          {loading || !data ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-16" />
              ))}
            </div>
          ) : (
            <motion.div variants={stagger} initial="hidden" animate="visible" className="flex flex-col gap-2">
              {data.enrollments.map((enrollment) => (
                <motion.div key={enrollment.courseId} variants={fadeUp}>
                  <Link href={`/courses/${enrollment.courseId}`} className="group flex gap-3 rounded-xl border border-line p-2">
                    <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-lg bg-subtle">
                      <Image src={thumbnailUrl(enrollment.course.thumbnailVideoId)} alt="" fill sizes="96px" className="object-cover transition-transform duration-500 group-hover:scale-110" unoptimized />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <p className="truncate text-sm font-medium text-ink">{enrollment.course.title}</p>
                      <div className="flex items-center gap-2">
                        <ProgressBar value={enrollment.progress} />
                        <span className="text-[11px] text-muted">{enrollment.progress}%</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </Panel>
        <Panel title="Skill levels" description="Based on completed lessons and quizzes." className="lg:col-span-3">
          {loading || !learner ? <Skeleton className="h-40" /> : <HorizontalBars data={learner.skills.map((entry) => ({ label: entry.skill, value: entry.level }))} />}
        </Panel>
        <Panel title="Achievements" className="lg:col-span-4">
          <ul className="flex flex-col gap-1">
            {ACHIEVEMENTS.map((item) => (
              <li key={item.id} className="row-fx -mx-2 flex items-center gap-3 rounded-lg px-2 py-1.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-warm text-onwarm">
                  <Award size={15} aria-hidden />
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-medium text-ink">{item.title}</p>
                  <p className="text-[11px] text-muted">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel title="Learning activity" description="Daily activity over the last 20 weeks.">
        {loading ? <Skeleton className="h-28" /> : <ActivityHeatmap />}
      </Panel>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink">Recommended for you</h2>
          <Button href="/courses" variant="ghost" className="!h-8 !px-3">
            View all
          </Button>
        </div>
        <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {loading || !data ? Array.from({ length: 3 }).map((_, index) => <CourseCardSkeleton key={index} />) : data.recommended.map((course) => <CourseCard key={course.id} course={course} />)}
        </motion.div>
      </section>
    </div>
  );
}
