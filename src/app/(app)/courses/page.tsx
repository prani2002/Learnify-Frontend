"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { CourseCard } from "@/components/courses/course-card";
import { CourseCardSkeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { useAsync } from "@/components/ui/use-async";
import { COURSE_CATEGORIES } from "@/data/courses";
import { api } from "@/lib/api";
import { createLogger } from "@/lib/logger";
import { stagger } from "@/lib/motion";

const log = createLogger("ui.courses");
const LEVELS = ["All levels", "Beginner", "Intermediate", "Advanced"];

export default function CoursesPage() {
  const { data, error, loading, reload } = useAsync("course catalog", api.listCourses);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState(LEVELS[0]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return (data ?? []).filter(
      (course) =>
        (category === "All" || course.category === category) &&
        (level === LEVELS[0] || course.level === level) &&
        (!term || `${course.title} ${course.instructor}`.toLowerCase().includes(term)),
    );
  }, [data, query, category, level]);

  if (error) return <ErrorState message={error.message} onRetry={reload} />;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Course catalog</h1>
        <p className="mt-1 text-muted">Explore courses taught by industry practitioners.</p>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search courses</span>
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onBlur={() => query && log.info("Course search", { query, results: filtered.length })}
            placeholder="Search by title or instructor"
            className="h-10 w-full rounded-lg border border-line bg-surface pl-9 pr-3 text-sm text-ink transition-colors focus:border-accent"
          />
        </label>
        <select
          value={level}
          onChange={(event) => {
            setLevel(event.target.value);
            log.info("Level filter changed", { level: event.target.value });
          }}
          aria-label="Level"
          className="h-10 rounded-lg border border-line bg-surface px-3 text-sm text-ink"
        >
          {LEVELS.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        {["All", ...COURSE_CATEGORIES].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              setCategory(item);
              log.info("Category filter changed", { category: item });
            }}
            className={`rounded-full px-3 py-1 text-sm transition-colors ${category === item ? "bg-accent-soft text-accent" : "bg-subtle text-muted hover:bg-accent-soft hover:text-accent"}`}
          >
            {item}
          </button>
        ))}
      </div>

      <motion.div key={`${category}-${level}-${query}-${loading}`} variants={stagger} initial="hidden" animate="visible" className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => <CourseCardSkeleton key={index} />)
          : filtered.map((course) => <CourseCard key={course.id} course={course} />)}
      </motion.div>

      {!loading && filtered.length === 0 && <p className="py-16 text-center text-muted">No courses match your filters.</p>}
    </div>
  );
}
