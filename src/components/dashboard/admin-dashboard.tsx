"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Award, BookOpen, Clock, GraduationCap, LifeBuoy, Star, Target, UserPlus, Users } from "lucide-react";
import { AreaChart, BarChart, DonutChart, HorizontalBars } from "@/components/charts/charts";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ErrorState } from "@/components/ui/error-state";
import { Panel } from "@/components/ui/panel";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SearchInput } from "@/components/ui/search-input";
import { SegmentedTabs } from "@/components/ui/segmented-tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { SortHeader, useSort } from "@/components/ui/sortable";
import { StatCard } from "@/components/ui/stat-card";
import { useAsync } from "@/components/ui/use-async";
import { RECENT_ACTIVITY } from "@/data/analytics";
import { api } from "@/lib/api";
import { createLogger } from "@/lib/logger";
import { stagger } from "@/lib/motion";
import type { Course, LearnerRecord } from "@/types";
import { LearnerDetail } from "./learner-detail";

const log = createLogger("ui.admin-dashboard");
const TABS = [
  { id: "analytics", label: "Portal analytics" },
  { id: "learners", label: "Learners" },
] as const;
type TabId = (typeof TABS)[number]["id"];
const KPI_ICONS = [Users, GraduationCap, Target, Star, Clock, UserPlus, Award, LifeBuoy];
const STATUS_FILTERS = ["All", "Active", "At risk", "Inactive"] as const;

const COURSE_SORT = {
  title: (course: Course) => course.title,
  instructor: (course: Course) => course.instructor,
  category: (course: Course) => course.category,
  learners: (course: Course) => course.learners,
  rating: (course: Course) => course.rating,
  hours: (course: Course) => course.hours,
};

const LEARNER_SORT = {
  name: (learner: LearnerRecord) => learner.name,
  department: (learner: LearnerRecord) => learner.department,
  courses: (learner: LearnerRecord) => learner.enrolled,
  completion: (learner: LearnerRecord) => learner.completed / learner.enrolled,
  hours: (learner: LearnerRecord) => learner.hours,
  score: (learner: LearnerRecord) => learner.avgScore,
  streak: (learner: LearnerRecord) => learner.streak,
  status: (learner: LearnerRecord) => learner.status,
};

const statusTone = (status: LearnerRecord["status"]) => (status === "Active" ? "accent" : status === "At risk" ? "warm" : "neutral");

export function AdminDashboard({ name }: { name: string }) {
  const { data, error, loading, reload } = useAsync("admin dashboard", api.getAdminDashboard);
  const [tab, setTab] = useState<TabId>("analytics");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof STATUS_FILTERS)[number]>("All");
  const [selected, setSelected] = useState<LearnerRecord | null>(null);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return (data?.learners ?? []).filter((learner) => (status === "All" || learner.status === status) && (!term || `${learner.name} ${learner.department}`.toLowerCase().includes(term)));
  }, [data, query, status]);

  const learnerSort = useSort(filtered, LEARNER_SORT);
  const courseSort = useSort(data?.topCourses ?? [], COURSE_SORT);
  const atRisk = useMemo(() => (data?.learners ?? []).filter((learner) => learner.status !== "Active"), [data]);

  if (error) return <ErrorState message={error.message} onRetry={reload} />;

  const analytics = data?.analytics;
  const pending = loading || !analytics;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ink">Administration overview</h1>
          <p className="text-sm text-muted">Signed in as {name}. Portal health for the last 12 months.</p>
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
        <motion.div key="analytics" variants={stagger} initial="hidden" animate="visible" className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {pending ? Array.from({ length: 8 }).map((_, index) => <Skeleton key={index} className="h-[112px] rounded-2xl" />) : analytics.kpis.map((kpi, index) => <StatCard key={kpi.label} {...kpi} icon={KPI_ICONS[index]} goodWhenDown={kpi.label === "Support tickets"} />)}
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <Panel title="Monthly enrollments" description="New course enrollments per month." className="lg:col-span-5">
              {pending ? <Skeleton className="h-44" /> : <AreaChart data={analytics.enrollmentTrend} />}
            </Panel>
            <Panel title="Active learners" description="Monthly active learners." className="lg:col-span-4">
              {pending ? <Skeleton className="h-44" /> : <AreaChart data={analytics.activeLearnersTrend} color="rgb(var(--warm))" />}
            </Panel>
            <Panel title="Category share" description="Enrollments by subject." className="lg:col-span-3">
              {pending ? <Skeleton className="h-32" /> : <DonutChart data={analytics.categoryShare} centerLabel="5 areas" />}
            </Panel>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <Panel title="Completion by course" className="lg:col-span-4">
              {pending ? <Skeleton className="h-40" /> : <HorizontalBars data={analytics.completionByCourse} />}
            </Panel>
            <Panel title="Learning funnel" description="From visit to completion." className="lg:col-span-3">
              {pending ? <Skeleton className="h-40" /> : <HorizontalBars data={analytics.funnel} />}
            </Panel>
            <Panel title="Weekday engagement" description="Index of active sessions." className="lg:col-span-3">
              {pending ? <Skeleton className="h-40" /> : <BarChart data={analytics.weekdayEngagement} height={140} />}
            </Panel>
            <Panel title="Device split" className="lg:col-span-2">
              {pending ? <Skeleton className="h-32" /> : <DeviceSplit data={analytics.deviceSplit} />}
            </Panel>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <Panel title="Top courses" description="Click a column header to sort." className="lg:col-span-7">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead className="text-muted">
                    <tr className="border-b border-line">
                      <SortHeader label="Course" sortKey="title" sort={courseSort.sort} onSort={courseSort.toggle} />
                      <SortHeader label="Instructor" sortKey="instructor" sort={courseSort.sort} onSort={courseSort.toggle} />
                      <SortHeader label="Category" sortKey="category" sort={courseSort.sort} onSort={courseSort.toggle} />
                      <SortHeader label="Learners" sortKey="learners" sort={courseSort.sort} onSort={courseSort.toggle} />
                      <SortHeader label="Hours" sortKey="hours" sort={courseSort.sort} onSort={courseSort.toggle} />
                      <SortHeader label="Rating" sortKey="rating" sort={courseSort.sort} onSort={courseSort.toggle} />
                    </tr>
                  </thead>
                  <tbody>
                    {loading || !data
                      ? Array.from({ length: 4 }).map((_, index) => (
                          <tr key={index}>
                            <td colSpan={6} className="py-1.5">
                              <Skeleton className="h-6" />
                            </td>
                          </tr>
                        ))
                      : courseSort.sorted.map((course) => (
                          <tr key={course.id} className="border-b border-line transition-colors last:border-0 hover:bg-accent/5">
                            <td className="py-2 pr-3 font-medium text-ink">{course.title}</td>
                            <td className="py-2 pr-3 text-muted">{course.instructor}</td>
                            <td className="py-2 pr-3">
                              <Badge>{course.category}</Badge>
                            </td>
                            <td className="py-2 pr-3 text-muted">{course.learners.toLocaleString()}</td>
                            <td className="py-2 pr-3 text-muted">{course.hours}h</td>
                            <td className="py-2 text-muted">
                              <span className="inline-flex items-center gap-1">
                                <Star size={13} className="text-warm" fill="currentColor" aria-hidden /> {course.rating}
                              </span>
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            </Panel>

            <Panel title="Recent activity" className="lg:col-span-5" action={<Activity size={16} className="text-accent" aria-hidden />}>
              <ul className="flex flex-col gap-0.5">
                {RECENT_ACTIVITY.map((item) => (
                  <li key={item.id} className="row-fx -mx-2 flex items-center gap-3 rounded-lg px-2 py-1.5 text-xs">
                    <span className={`h-2 w-2 shrink-0 rounded-full ${item.tone === "accent" ? "bg-accent" : "bg-warm"}`} aria-hidden />
                    <p className="min-w-0 flex-1 text-muted">
                      <span className="font-medium text-ink">{item.who}</span> {item.action} <span className="font-medium text-ink">{item.target}</span>
                    </p>
                    <span className="shrink-0 text-[11px] text-muted">{item.when}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </motion.div>
      )}

      {tab === "learners" && (
        <motion.div key="learners" variants={stagger} initial="hidden" animate="visible" className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {loading || !data ? (
              Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-[112px] rounded-2xl" />)
            ) : (
              <>
                <StatCard label="Total learners" value={String(data.learners.length)} icon={Users} />
                <StatCard label="Active" value={String(data.learners.filter((l) => l.status === "Active").length)} icon={BookOpen} />
                <StatCard label="Needs attention" value={String(atRisk.length)} icon={Target} goodWhenDown trend="down" change={`${atRisk.length} of ${data.learners.length}`} />
                <StatCard label="Avg. score" value={`${Math.round(data.learners.reduce((sum, l) => sum + l.avgScore, 0) / data.learners.length)}%`} icon={Star} />
              </>
            )}
          </div>

          <Panel title="Learner statistics" description="Select a learner to view detailed statistics. Click a column header to sort.">
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center">
              <SearchInput className="flex-1" value={query} onChange={setQuery} placeholder="Search by name or department" label="Search learners" />
              <div className="flex flex-wrap gap-1.5">
                {STATUS_FILTERS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setStatus(item);
                      log.info("Learner status filter changed", { status: item });
                    }}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-300 hover:-translate-y-0.5 ${status === item ? "bg-accent text-accent-ink" : "bg-subtle text-muted hover:bg-accent-soft hover:text-accent"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead className="text-muted">
                  <tr className="border-b border-line">
                    <SortHeader label="Learner" sortKey="name" sort={learnerSort.sort} onSort={learnerSort.toggle} />
                    <SortHeader label="Department" sortKey="department" sort={learnerSort.sort} onSort={learnerSort.toggle} />
                    <SortHeader label="Courses" sortKey="courses" sort={learnerSort.sort} onSort={learnerSort.toggle} />
                    <SortHeader label="Completion" sortKey="completion" sort={learnerSort.sort} onSort={learnerSort.toggle} />
                    <SortHeader label="Hours" sortKey="hours" sort={learnerSort.sort} onSort={learnerSort.toggle} />
                    <SortHeader label="Score" sortKey="score" sort={learnerSort.sort} onSort={learnerSort.toggle} />
                    <SortHeader label="Streak" sortKey="streak" sort={learnerSort.sort} onSort={learnerSort.toggle} />
                    <SortHeader label="Status" sortKey="status" sort={learnerSort.sort} onSort={learnerSort.toggle} />
                  </tr>
                </thead>
                <tbody>
                  {loading || !data
                    ? Array.from({ length: 6 }).map((_, index) => (
                        <tr key={index}>
                          <td colSpan={8} className="py-1.5">
                            <Skeleton className="h-9" />
                          </td>
                        </tr>
                      ))
                    : learnerSort.sorted.map((learner) => {
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
                            className="cursor-pointer border-b border-line transition-colors last:border-0 hover:bg-accent/5"
                          >
                            <td className="py-2 pr-3">
                              <div className="flex items-center gap-2.5">
                                <Avatar src={learner.avatar} name={learner.name} size={30} />
                                <div className="leading-tight">
                                  <p className="font-medium text-ink">{learner.name}</p>
                                  <p className="text-[11px] text-muted">{learner.lastActive}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-2 pr-3 text-muted">{learner.department}</td>
                            <td className="py-2 pr-3 text-muted">
                              {learner.completed}/{learner.enrolled}
                            </td>
                            <td className="w-36 py-2 pr-6">
                              <div className="flex items-center gap-2">
                                <ProgressBar value={completion} />
                                <span className="w-8 text-[11px] text-muted">{completion}%</span>
                              </div>
                            </td>
                            <td className="py-2 pr-3 text-muted">{learner.hours}</td>
                            <td className="py-2 pr-3 text-muted">{learner.avgScore}%</td>
                            <td className="py-2 pr-3 text-muted">{learner.streak}d</td>
                            <td className="py-2">
                              <Badge tone={statusTone(learner.status)}>{learner.status}</Badge>
                            </td>
                          </tr>
                        );
                      })}
                </tbody>
              </table>
              {!loading && filtered.length === 0 && <p className="py-10 text-center text-sm text-muted">No learners match your filters.</p>}
            </div>
          </Panel>
        </motion.div>
      )}

      <LearnerDetail learner={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function DeviceSplit({ data }: { data: { label: string; value: number }[] }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex h-2.5 overflow-hidden rounded-full bg-line">
        {data.map((point, index) => (
          <motion.span key={point.label} className="h-full" style={{ backgroundColor: ["rgb(var(--accent))", "rgb(var(--warm))", "rgb(var(--muted))"][index] }} initial={{ width: 0 }} animate={{ width: `${point.value}%` }} transition={{ duration: 0.9, delay: index * 0.1 }} />
        ))}
      </div>
      <ul className="flex flex-col gap-1.5 text-xs">
        {data.map((point, index) => (
          <li key={point.label} className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-ink">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: ["rgb(var(--accent))", "rgb(var(--warm))", "rgb(var(--muted))"][index] }} aria-hidden />
              {point.label}
            </span>
            <span className="text-muted">{point.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
