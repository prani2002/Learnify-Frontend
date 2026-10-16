"use client";

import { ChevronDown } from "lucide-react";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CourseCard } from "@/components/courses/course-card";
import { SearchInput } from "@/components/ui/search-input";
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
  return (
    <Suspense fallback={null}>
      <CourseCatalog />
    </Suspense>
  );
}

function CourseCatalog() {
  const { data, error, loading, reload } = useAsync("course catalog", api.listCourses);
  const [query, setQuery] = useState(useSearchParams().get("q") ?? "");
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
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold text-ink">Course catalog</h1>
        <p className="text-sm text-muted">Explore courses taught by industry practitioners.</p>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <SearchInput className="flex-1" value={query} onChange={setQuery} onBlur={() => query && log.info("Course search", { query, results: filtered.length })} placeholder="Search by title or instructor" label="Search courses" />
        <div className="relative w-full lg:w-44">
        <select
          value={level}
          onChange={(event) => {
            setLevel(event.target.value);
            log.info("Level filter changed", { level: event.target.value });
          }}
          aria-label="Level"
          className="h-10 w-full appearance-none rounded-xl border border-transparent bg-subtle pl-3 pr-9 text-sm text-ink transition-all duration-300 hover:border-accent/40 hover:bg-surface focus:border-accent focus:bg-surface focus:outline-none"
        >
          {LEVELS.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden />
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {["All", ...COURSE_CATEGORIES].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              setCategory(item);
              log.info("Category filter changed", { category: item });
            }}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-300 hover:-translate-y-0.5 ${category === item ? "bg-accent text-accent-ink" : "bg-surface text-muted hover:bg-accent-soft hover:text-accent"}`}
          >
            {item}
          </button>
        ))}
      </div>

      <motion.div key={`${category}-${level}-${query}-${loading}`} variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => <CourseCardSkeleton key={index} />)
          : filtered.map((course) => <CourseCard key={course.id} course={course} />)}
      </motion.div>

      {!loading && filtered.length === 0 && <p className="py-16 text-center text-muted">No courses match your filters.</p>}
    </div>
  );
}
