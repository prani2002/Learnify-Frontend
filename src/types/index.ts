export type UserRole = "admin" | "learner";
export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  avatar: string;
}

export interface Lesson {
  id: string;
  title: string;
  durationMinutes: number;
  videoId: string;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  summary: string;
  category: string;
  level: CourseLevel;
  instructor: string;
  rating: number;
  reviewCount: number;
  learners: number;
  hours: number;
  thumbnailVideoId: string;
  previewVideoId: string;
  outcomes: string[];
  modules: Module[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
}

export interface Enrollment {
  courseId: string;
  progress: number;
  lastLessonId: string;
}

export interface AdminMetric {
  label: string;
  value: string;
  change: string;
}

export interface InstructorRow {
  id: string;
  name: string;
  courses: number;
  learners: number;
  rating: number;
}

export interface Kpi {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
}

export interface DataPoint {
  label: string;
  value: number;
}

export interface LearnerRecord {
  id: string;
  name: string;
  email: string;
  department: string;
  avatar: string;
  enrolled: number;
  completed: number;
  hours: number;
  streak: number;
  avgScore: number;
  lastActive: string;
  status: "Active" | "At risk" | "Inactive";
  weeklyHours: number[];
  courseProgress: { courseId: string; progress: number }[];
  skills: { skill: string; level: number }[];
}

export interface PortalAnalytics {
  kpis: Kpi[];
  enrollmentTrend: DataPoint[];
  activeLearnersTrend: DataPoint[];
  categoryShare: DataPoint[];
  completionByCourse: DataPoint[];
  weekdayEngagement: DataPoint[];
  deviceSplit: DataPoint[];
  funnel: DataPoint[];
}
