"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { BarChart, HorizontalBars } from "@/components/charts/charts";
import { Avatar } from "@/components/ui/avatar";
import { ProgressBar } from "@/components/ui/progress-bar";
import { findCourse } from "@/data/courses";
import { spring } from "@/lib/motion";
import type { LearnerRecord } from "@/types";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function LearnerDetail({ learner, onClose }: { learner: LearnerRecord | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {learner && (
        <motion.div className="fixed inset-0 z-40 bg-ink/20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.aside
            role="dialog"
            aria-label={`${learner.name} statistics`}
            className="ml-auto flex h-full w-full max-w-lg flex-col gap-4 overflow-y-auto border-l border-line bg-surface p-5"
            initial={{ x: "100%" }}
            animate={{ x: 0, transition: spring }}
            exit={{ x: "100%" }}
            onClick={(event) => event.stopPropagation()}
          >
            <header className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar src={learner.avatar} name={learner.name} size={56} />
                <div>
                  <h2 className="text-lg font-semibold text-ink">{learner.name}</h2>
                  <p className="text-sm text-muted">{learner.email}</p>
                  <p className="text-xs text-muted">{learner.department}</p>
                </div>
              </div>
              <button type="button" aria-label="Close" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-lg bg-subtle text-muted hover:bg-accent-soft hover:text-accent">
                <X size={16} />
              </button>
            </header>

            <dl className="grid grid-cols-3 gap-2">
              {[
                { label: "Hours", value: learner.hours },
                { label: "Avg score", value: `${learner.avgScore}%` },
                { label: "Streak", value: `${learner.streak}d` },
                { label: "Enrolled", value: learner.enrolled },
                { label: "Completed", value: learner.completed },
                { label: "Last active", value: learner.lastActive },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-line p-2.5">
                  <dt className="text-xs text-muted">{item.label}</dt>
                  <dd className="mt-1 text-base font-semibold text-ink">{item.value}</dd>
                </div>
              ))}
            </dl>

            <section>
              <h3 className="mb-2 text-sm font-semibold text-ink">Hours this week</h3>
              <BarChart data={learner.weeklyHours.map((value, index) => ({ label: DAYS[index], value }))} height={140} unit="h" />
            </section>

            <section>
              <h3 className="mb-2 text-sm font-semibold text-ink">Course progress</h3>
              <ul className="flex flex-col gap-2.5">
                {learner.courseProgress.map((entry) => (
                  <li key={entry.courseId}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-ink">{findCourse(entry.courseId)?.title}</span>
                      <span className="text-muted">{entry.progress}%</span>
                    </div>
                    <ProgressBar value={entry.progress} />
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="mb-2 text-sm font-semibold text-ink">Skill levels</h3>
              <HorizontalBars data={learner.skills.map((entry) => ({ label: entry.skill, value: entry.level }))} />
            </section>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
