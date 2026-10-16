import { COURSES, findCourse } from "@/data/courses";
import { LEARNERS, PORTAL_ANALYTICS } from "@/data/analytics";
import { createLogger } from "@/lib/logger";
import type { Course } from "@/types";

const log = createLogger("api.client");

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function simulate<T>(name: string, payload: () => T, latency = 700): Promise<T> {
  return log.timed(`Request ${name}`, async () => {
    await wait(latency + Math.random() * 400);
    return payload();
  });
}

export const api = {
  listCourses: (): Promise<readonly Course[]> => simulate("listCourses", () => COURSES),
  getCourse: (id: string): Promise<Course> =>
    simulate("getCourse", () => {
      const course = findCourse(id);
      if (!course) throw new Error(`Course not found: ${id}`);
      return course;
    }),
  getLearnerDashboard: () =>
    simulate("getLearnerDashboard", () => {
      const learner = LEARNERS[0];
      return {
        learner,
        enrollments: learner.courseProgress.map((entry) => ({ ...entry, course: findCourse(entry.courseId) as Course })),
        recommended: COURSES.filter((course) => !learner.courseProgress.some((entry) => entry.courseId === course.id)).slice(0, 3),
      };
    }),
  getAdminDashboard: () =>
    simulate("getAdminDashboard", () => ({
      analytics: PORTAL_ANALYTICS,
      learners: LEARNERS,
      topCourses: [...COURSES].sort((a, b) => b.learners - a.learners).slice(0, 5),
    })),
};
