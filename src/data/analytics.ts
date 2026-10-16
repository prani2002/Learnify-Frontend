import type { LearnerRecord, PortalAnalytics } from "@/types";

const avatar = (path: string) => `https://randomuser.me/api/portraits/thumb/${path}.jpg`;

export const LEARNERS: readonly LearnerRecord[] = [
  { id: "u1", name: "Priya Raman", email: "learner@lms.demo", department: "Engineering", avatar: "/avatars/learner.svg", enrolled: 6, completed: 3, hours: 42, streak: 12, avgScore: 91, lastActive: "Today", status: "Active", weeklyHours: [2, 3, 1, 4, 3, 5, 2], courseProgress: [{ courseId: "react-foundations", progress: 68 }, { courseId: "typescript-essentials", progress: 35 }, { courseId: "python-for-data", progress: 12 }], skills: [{ skill: "Frontend", level: 82 }, { skill: "Data", level: 46 }, { skill: "Design", level: 38 }, { skill: "Backend", level: 52 }, { skill: "Cloud", level: 24 }] },
  { id: "u2", name: "Jordan Fields", email: "jordan.fields@lms.demo", department: "Analytics", avatar: avatar("men/22"), enrolled: 8, completed: 5, hours: 76, streak: 21, avgScore: 94, lastActive: "Today", status: "Active", weeklyHours: [4, 5, 3, 6, 4, 2, 3], courseProgress: [{ courseId: "python-for-data", progress: 90 }, { courseId: "machine-learning-intro", progress: 55 }], skills: [{ skill: "Frontend", level: 30 }, { skill: "Data", level: 92 }, { skill: "Design", level: 25 }, { skill: "Backend", level: 48 }, { skill: "Cloud", level: 40 }] },
  { id: "u3", name: "Amelia Brooks", email: "amelia.brooks@lms.demo", department: "Design", avatar: avatar("women/33"), enrolled: 4, completed: 2, hours: 31, streak: 6, avgScore: 88, lastActive: "Yesterday", status: "Active", weeklyHours: [1, 2, 2, 3, 1, 0, 2], courseProgress: [{ courseId: "ux-design-basics", progress: 76 }, { courseId: "html-css-modern", progress: 40 }], skills: [{ skill: "Frontend", level: 55 }, { skill: "Data", level: 20 }, { skill: "Design", level: 90 }, { skill: "Backend", level: 15 }, { skill: "Cloud", level: 10 }] },
  { id: "u4", name: "Kenji Watanabe", email: "kenji.watanabe@lms.demo", department: "Engineering", avatar: avatar("men/41"), enrolled: 9, completed: 7, hours: 118, streak: 34, avgScore: 96, lastActive: "Today", status: "Active", weeklyHours: [5, 6, 5, 7, 4, 3, 4], courseProgress: [{ courseId: "node-backend", progress: 82 }, { courseId: "cs-fundamentals", progress: 61 }], skills: [{ skill: "Frontend", level: 60 }, { skill: "Data", level: 50 }, { skill: "Design", level: 20 }, { skill: "Backend", level: 95 }, { skill: "Cloud", level: 78 }] },
  { id: "u5", name: "Fatima Nasser", email: "fatima.nasser@lms.demo", department: "Marketing", avatar: avatar("women/50"), enrolled: 3, completed: 1, hours: 14, streak: 2, avgScore: 79, lastActive: "3 days ago", status: "At risk", weeklyHours: [0, 1, 0, 2, 0, 0, 1], courseProgress: [{ courseId: "html-css-modern", progress: 22 }], skills: [{ skill: "Frontend", level: 35 }, { skill: "Data", level: 28 }, { skill: "Design", level: 52 }, { skill: "Backend", level: 8 }, { skill: "Cloud", level: 5 }] },
  { id: "u6", name: "Lucas Moreau", email: "lucas.moreau@lms.demo", department: "Product", avatar: avatar("men/64"), enrolled: 5, completed: 3, hours: 53, streak: 9, avgScore: 87, lastActive: "Today", status: "Active", weeklyHours: [2, 2, 3, 2, 3, 1, 1], courseProgress: [{ courseId: "ux-design-basics", progress: 100 }, { courseId: "react-foundations", progress: 45 }], skills: [{ skill: "Frontend", level: 48 }, { skill: "Data", level: 44 }, { skill: "Design", level: 72 }, { skill: "Backend", level: 22 }, { skill: "Cloud", level: 18 }] },
  { id: "u7", name: "Ines Carvalho", email: "ines.carvalho@lms.demo", department: "Analytics", avatar: avatar("women/12"), enrolled: 7, completed: 4, hours: 67, streak: 15, avgScore: 92, lastActive: "Yesterday", status: "Active", weeklyHours: [3, 3, 4, 2, 3, 2, 1], courseProgress: [{ courseId: "machine-learning-intro", progress: 72 }, { courseId: "python-for-data", progress: 100 }], skills: [{ skill: "Frontend", level: 22 }, { skill: "Data", level: 88 }, { skill: "Design", level: 30 }, { skill: "Backend", level: 40 }, { skill: "Cloud", level: 46 }] },
  { id: "u8", name: "Omar Haddad", email: "omar.haddad@lms.demo", department: "Engineering", avatar: avatar("men/8"), enrolled: 4, completed: 1, hours: 19, streak: 0, avgScore: 74, lastActive: "9 days ago", status: "Inactive", weeklyHours: [0, 0, 0, 0, 0, 0, 0], courseProgress: [{ courseId: "node-backend", progress: 18 }], skills: [{ skill: "Frontend", level: 30 }, { skill: "Data", level: 25 }, { skill: "Design", level: 10 }, { skill: "Backend", level: 44 }, { skill: "Cloud", level: 32 }] },
  { id: "u9", name: "Grace Kim", email: "grace.kim@lms.demo", department: "Design", avatar: avatar("women/79"), enrolled: 6, completed: 4, hours: 58, streak: 11, avgScore: 90, lastActive: "Today", status: "Active", weeklyHours: [2, 3, 2, 3, 2, 3, 1], courseProgress: [{ courseId: "ux-design-basics", progress: 100 }, { courseId: "html-css-modern", progress: 85 }], skills: [{ skill: "Frontend", level: 66 }, { skill: "Data", level: 24 }, { skill: "Design", level: 94 }, { skill: "Backend", level: 12 }, { skill: "Cloud", level: 8 }] },
  { id: "u10", name: "Noah Peterson", email: "noah.peterson@lms.demo", department: "Sales", avatar: avatar("men/90"), enrolled: 2, completed: 0, hours: 6, streak: 1, avgScore: 70, lastActive: "5 days ago", status: "At risk", weeklyHours: [0, 1, 0, 0, 1, 0, 0], courseProgress: [{ courseId: "python-for-data", progress: 9 }], skills: [{ skill: "Frontend", level: 10 }, { skill: "Data", level: 22 }, { skill: "Design", level: 12 }, { skill: "Backend", level: 6 }, { skill: "Cloud", level: 4 }] },
];

const MONTHS = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];

export const PORTAL_ANALYTICS: PortalAnalytics = {
  kpis: [
    { label: "Active learners", value: "48,210", change: "+6.4%", trend: "up" },
    { label: "Course completions", value: "9,874", change: "+3.1%", trend: "up" },
    { label: "Avg. completion rate", value: "68%", change: "+2.2%", trend: "up" },
    { label: "Avg. quiz score", value: "86%", change: "-0.8%", trend: "down" },
    { label: "Learning hours", value: "214K", change: "+9.7%", trend: "up" },
    { label: "New enrollments", value: "2,306", change: "+11.8%", trend: "up" },
    { label: "Certificates issued", value: "3,412", change: "+4.5%", trend: "up" },
    { label: "Support tickets", value: "126", change: "-12.3%", trend: "down" },
  ],
  enrollmentTrend: MONTHS.map((label, index) => ({ label, value: [1480, 1320, 1710, 1840, 2010, 1950, 2230, 2410, 2380, 2560, 2490, 2306][index] })),
  activeLearnersTrend: MONTHS.map((label, index) => ({ label, value: [31200, 32400, 34100, 35800, 37200, 38900, 40300, 42100, 43800, 45200, 46900, 48210][index] })),
  categoryShare: [
    { label: "Web Development", value: 34 },
    { label: "Data and AI", value: 27 },
    { label: "Programming", value: 18 },
    { label: "Design", value: 12 },
    { label: "Computer Science", value: 9 },
  ],
  completionByCourse: [
    { label: "Python for Data", value: 78 },
    { label: "React Foundations", value: 72 },
    { label: "HTML and CSS", value: 69 },
    { label: "TypeScript", value: 64 },
    { label: "Machine Learning", value: 51 },
    { label: "Node.js Backend", value: 47 },
  ],
  weekdayEngagement: [
    { label: "Mon", value: 82 },
    { label: "Tue", value: 91 },
    { label: "Wed", value: 88 },
    { label: "Thu", value: 94 },
    { label: "Fri", value: 73 },
    { label: "Sat", value: 41 },
    { label: "Sun", value: 38 },
  ],
  deviceSplit: [
    { label: "Desktop", value: 58 },
    { label: "Mobile", value: 34 },
    { label: "Tablet", value: 8 },
  ],
  funnel: [
    { label: "Visited course page", value: 100 },
    { label: "Started a lesson", value: 64 },
    { label: "Completed 50%", value: 41 },
    { label: "Completed course", value: 27 },
  ],
};
