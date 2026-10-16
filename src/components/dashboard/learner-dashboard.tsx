"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Award, BookOpen, Clock, Flame, GraduationCap, Target } from "lucide-react";
import { ActivityHeatmap, BarChart, HorizontalBars } from "@/components/charts/charts";
import { CourseCard } from "@/components/courses/course-card";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/error-state";
import { Panel } from "@/components/ui/panel";
import { ProgressBar } from "@/components/ui/progress-bar";
import { CourseCardSkeleton, Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/ui/stat-card";
import { useAsync } from "@/components/ui/use-async";
import { thumbnailUrl } from "@/data/courses";
import { api } from "@/lib/api";
import { cardHover, fadeUp, stagger } from "@/lib/motion";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const WEEKLY_GOAL_HOURS = 25;
const ACHIEVEMENTS = [
  { id: "a1", title: "7 day streak", text: "Learned a full week in a row" },
  { id: "a2", title: "Quiz master", text: "Scored above 90% on 5 quizzes" },
  { id: "a3", title: "Fast starter", text: "Finished a course in 14 days" },
];

export function LearnerDashboard({ name }: { name: string }) {
  const { data, error, loading, reload } = useAsync("learner dashboard", api.getLearnerDashboard);

  if (error) return <ErrorState message={error.message} onRetry={reload} />;

  const learner = data?.learner;
  const weekly = learner ? learner.weeklyHours.map((value, index) => ({ label: DAYS[index], value })) : [];
  const weeklyTotal = weekly.reduce((sum, point) => sum + point.value, 0);
  const goalPercent = Math.min(100, Math.round((weeklyTotal / WEEKLY_GOAL_HOURS) * 100));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Welcome back, {name.split(" ")[0]}</h1>
        <p className="mt-1 text-muted">Your learning statistics and progress at a glance.</p>
      </div>

      <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {loading || !learner ? (
          Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-28 rounded-2xl" />)
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

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Learning hours this week" description={learner ? `${weeklyTotal} of ${WEEKLY_GOAL_HOURS} hours goal` : undefined} className="lg:col-span-2">
          {loading || !learner ? <Skeleton className="h-52" /> : <BarChart data={weekly} unit="h" />}
        </Panel>
        <Panel title="Weekly goal" description="Stay consistent to keep your streak.">
          {loading || !learner ? (
            <Skeleton className="h-40" />
          ) : (
            <div className="flex flex-col items-center gap-4">
              <p className="text-5xl font-semibold text-ink">{goalPercent}%</p>
              <div className="w-full">
                <ProgressBar value={goalPercent} />
              </div>
              <p className="text-sm text-muted">{Math.max(WEEKLY_GOAL_HOURS - weeklyTotal, 0)} hours to reach your goal</p>
            </div>
          )}
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Continue learning" className="lg:col-span-2">
          <div className="flex flex-col gap-4">
            {loading || !data ? (
              Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-24" />)
            ) : (
              <motion.div variants={stagger} initial="hidden" animate="visible" className="flex flex-col gap-4">
                {data.enrollments.map((enrollment) => (
                  <motion.div key={enrollment.courseId} variants={fadeUp} whileHover={cardHover}>
                    <Link href={`/courses/${enrollment.courseId}`} className="flex gap-4 rounded-xl border border-line p-3">
                      <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg bg-subtle">
                        <Image src={thumbnailUrl(enrollment.course.thumbnailVideoId)} alt="" fill sizes="128px" className="object-cover" unoptimized />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        <p className="truncate font-medium text-ink">{enrollment.course.title}</p>
                        <div>
                          <ProgressBar value={enrollment.progress} />
                          <p className="mt-1 text-xs text-muted">{enrollment.progress}% complete</p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </Panel>
        <Panel title="Skill levels" description="Based on completed lessons and quizzes.">
          {loading || !learner ? <Skeleton className="h-56" /> : <HorizontalBars data={learner.skills.map((entry) => ({ label: entry.skill, value: entry.level }))} />}
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Learning activity" description="Daily activity over the last 14 weeks." className="lg:col-span-2">
          {loading ? <Skeleton className="h-40" /> : <ActivityHeatmap />}
        </Panel>
        <Panel title="Achievements">
          <ul className="flex flex-col gap-4">
            {ACHIEVEMENTS.map((item) => (
              <li key={item.id} className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-warm text-onwarm">
                  <Award size={18} aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-medium text-ink">{item.title}</p>
                  <p className="text-xs text-muted">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">Recommended for you</h2>
          <Button href="/courses" variant="ghost">
            View all
          </Button>
        </div>
        <motion.div variants={stagger} initial="hidden" animate="visible" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading || !data ? Array.from({ length: 3 }).map((_, index) => <CourseCardSkeleton key={index} />) : data.recommended.map((course) => <CourseCard key={course.id} course={course} />)}
        </motion.div>
      </section>
    </div>
  );
}
