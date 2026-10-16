"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Award, BookOpen, Clock, GraduationCap, LifeBuoy, Search, Star, Target, UserPlus, Users } from "lucide-react";
import { AreaChart, BarChart, DonutChart, HorizontalBars } from "@/components/charts/charts";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ErrorState } from "@/components/ui/error-state";
import { Panel } from "@/components/ui/panel";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SegmentedTabs } from "@/components/ui/segmented-tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/ui/stat-card";
import { useAsync } from "@/components/ui/use-async";
import { api } from "@/lib/api";
import { createLogger } from "@/lib/logger";
import { stagger } from "@/lib/motion";
import type { LearnerRecord } from "@/types";
import { LearnerDetail } from "./learner-detail";

const log = createLogger("ui.admin-dashboard");
const TABS = [
  { id: "analytics", label: "Portal analytics" },
  { id: "learners", label: "Learners" },
] as const;
type TabId = (typeof TABS)[number]["id"];
const KPI_ICONS = [Users, GraduationCap, Target, Star, Clock, UserPlus, Award, LifeBuoy];
const STATUS_FILTERS = ["All", "Active", "At risk", "Inactive"] as const;

export function AdminDashboard({ name }: { name: string }) {
  const { data, error, loading, reload } = useAsync("admin dashboard", api.getAdminDashboard);
  const [tab, setTab] = useState<TabId>("analytics");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof STATUS_FILTERS)[number]>("All");
  const [selected, setSelected] = useState<LearnerRecord | null>(null);

  const learners = useMemo(() => {
    const term = query.trim().toLowerCase();
    return (data?.learners ?? []).filter((learner) => (status === "All" || learner.status === status) && (!term || `${learner.name} ${learner.department}`.toLowerCase().includes(term)));
  }, [data, query, status]);

  if (error) return <ErrorState message={error.message} onRetry={reload} />;

  const analytics = data?.analytics;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Administration overview</h1>
          <p className="mt-1 text-muted">Signed in as {name}. Portal health for the last 12 months.</p>
        </div>
        <SegmentedTabs
          tabs={TABS}
          value={tab}
          layoutId="admin-tab"
          onChange={(next) => {
            setTab(next);
            log.info("Admin tab changed", { tab: next });
          }}
        />
      </div>

      {tab === "analytics" && (
        <motion.div key="analytics" variants={stagger} initial="hidden" animate="visible" className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            {loading || !analytics
              ? Array.from({ length: 8 }).map((_, index) => <Skeleton key={index} className="h-32 rounded-2xl" />)
              : analytics.kpis.map((kpi, index) => <StatCard key={kpi.label} {...kpi} icon={KPI_ICONS[index]} goodWhenDown={kpi.label === "Support tickets"} />)}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Panel title="Monthly enrollments" description="New course enrollments per month." className="lg:col-span-2">
              {loading || !analytics ? <Skeleton className="h-60" /> : <AreaChart data={analytics.enrollmentTrend} />}
            </Panel>
            <Panel title="Category share" description="Enrollments by subject.">
              {loading || !analytics ? <Skeleton className="h-40" /> : <DonutChart data={analytics.categoryShare} centerLabel="5 areas" />}
            </Panel>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Panel title="Active learners" description="Monthly active learners." className="lg:col-span-2">
              {loading || !analytics ? <Skeleton className="h-60" /> : <AreaChart data={analytics.activeLearnersTrend} color="rgb(var(--warm))" />}
            </Panel>
            <Panel title="Learning funnel" description="From visit to completion.">
              {loading || !analytics ? <Skeleton className="h-40" /> : <HorizontalBars data={analytics.funnel} />}
            </Panel>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Panel title="Completion by course">{loading || !analytics ? <Skeleton className="h-52" /> : <HorizontalBars data={analytics.completionByCourse} />}</Panel>
            <Panel title="Engagement by weekday" description="Index of active sessions.">
              {loading || !analytics ? <Skeleton className="h-52" /> : <BarChart data={analytics.weekdayEngagement} />}
            </Panel>
            <Panel title="Device split">{loading || !analytics ? <Skeleton className="h-40" /> : <DonutChart data={analytics.deviceSplit} centerLabel="Devices" />}</Panel>
          </div>

          <Panel title="Top courses" description="Ranked by enrolled learners.">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="text-muted">
                  <tr className="border-b border-line">
                    <th className="pb-3 font-medium">Course</th>
                    <th className="pb-3 font-medium">Instructor</th>
                    <th className="pb-3 font-medium">Learners</th>
                    <th className="pb-3 font-medium">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {loading || !data
                    ? Array.from({ length: 4 }).map((_, index) => (
                        <tr key={index}>
                          <td colSpan={4} className="py-2">
                            <Skeleton className="h-6" />
                          </td>
                        </tr>
                      ))
                    : data.topCourses.map((course) => (
                        <tr key={course.id} className="border-b border-line last:border-0">
                          <td className="py-3 font-medium text-ink">{course.title}</td>
                          <td className="py-3 text-muted">{course.instructor}</td>
                          <td className="py-3 text-muted">{course.learners.toLocaleString()}</td>
                          <td className="py-3 text-muted">
                            <span className="inline-flex items-center gap-1">
                              <Star size={14} className="text-warm" fill="currentColor" aria-hidden /> {course.rating}
                            </span>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </motion.div>
      )}

      {tab === "learners" && (
        <motion.div key="learners" variants={stagger} initial="hidden" animate="visible" className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {loading || !data ? (
              Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-28 rounded-2xl" />)
            ) : (
              <>
                <StatCard label="Total learners" value={String(data.learners.length)} icon={Users} />
                <StatCard label="Active" value={String(data.learners.filter((l) => l.status === "Active").length)} icon={BookOpen} />
                <StatCard label="At risk" value={String(data.learners.filter((l) => l.status === "At risk").length)} icon={Target} />
                <StatCard label="Avg. score" value={`${Math.round(data.learners.reduce((sum, l) => sum + l.avgScore, 0) / data.learners.length)}%`} icon={Star} />
              </>
            )}
          </div>

          <Panel title="Learner statistics" description="Select a learner to view detailed statistics.">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row">
              <label className="relative flex-1">
                <span className="sr-only">Search learners</span>
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name or department" className="h-10 w-full rounded-lg border border-line bg-surface pl-9 pr-3 text-sm text-ink focus:border-accent" />
              </label>
              <div className="flex flex-wrap gap-2">
                {STATUS_FILTERS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setStatus(item);
                      log.info("Learner status filter changed", { status: item });
                    }}
                    className={`rounded-full px-3 py-1.5 text-sm transition-colors ${status === item ? "bg-accent-soft text-accent" : "bg-subtle text-muted hover:bg-accent-soft hover:text-accent"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead className="text-muted">
                  <tr className="border-b border-line">
                    <th className="pb-3 font-medium">Learner</th>
                    <th className="pb-3 font-medium">Department</th>
                    <th className="pb-3 font-medium">Courses</th>
                    <th className="pb-3 font-medium">Completion</th>
                    <th className="pb-3 font-medium">Hours</th>
                    <th className="pb-3 font-medium">Score</th>
                    <th className="pb-3 font-medium">Last active</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading || !data
                    ? Array.from({ length: 6 }).map((_, index) => (
                        <tr key={index}>
                          <td colSpan={8} className="py-2">
                            <Skeleton className="h-10" />
                          </td>
                        </tr>
                      ))
                    : learners.map((learner) => {
                        const completion = Math.round((learner.completed / learner.enrolled) * 100);
                        return (
                          <tr
                            key={learner.id}
                            tabIndex={0}
                            onClick={() => {
                              setSelected(learner);
                              log.info("Learner detail opened", { learnerId: learner.id });
                            }}
                            onKeyDown={(event) => event.key === "Enter" && setSelected(learner)}
                            className="cursor-pointer border-b border-line transition-colors last:border-0 hover:bg-subtle"
                          >
                            <td className="py-3">
                              <div className="flex items-center gap-3">
                                <Avatar src={learner.avatar} name={learner.name} size={36} />
                                <div>
                                  <p className="font-medium text-ink">{learner.name}</p>
                                  <p className="text-xs text-muted">{learner.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 text-muted">{learner.department}</td>
                            <td className="py-3 text-muted">
                              {learner.completed}/{learner.enrolled}
                            </td>
                            <td className="w-40 py-3 pr-6">
                              <ProgressBar value={completion} />
                            </td>
                            <td className="py-3 text-muted">{learner.hours}</td>
                            <td className="py-3 text-muted">{learner.avgScore}%</td>
                            <td className="py-3 text-muted">{learner.lastActive}</td>
                            <td className="py-3">
                              <Badge tone={learner.status === "Active" ? "accent" : "neutral"}>{learner.status}</Badge>
                            </td>
                          </tr>
                        );
                      })}
                </tbody>
              </table>
              {!loading && learners.length === 0 && <p className="py-12 text-center text-muted">No learners match your filters.</p>}
            </div>
          </Panel>
        </motion.div>
      )}

      <LearnerDetail learner={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
