import type { Course } from "@/types";

export const COURSE_CATEGORIES = ["Web Development", "Programming", "Data and AI", "Computer Science", "Design"] as const;

export const COURSES: readonly Course[] = [
  {
    id: "react-foundations",
    title: "React Foundations",
    summary: "Build modern interfaces with components, hooks, and state management from first principles.",
    category: "Web Development",
    level: "Beginner",
    instructor: "Elena Marsh",
    rating: 4.8,
    reviewCount: 2140,
    learners: 18420,
    hours: 12,
    thumbnailVideoId: "bMknfKXIFA8",
    previewVideoId: "bMknfKXIFA8",
    outcomes: ["Compose reusable components", "Manage state with hooks", "Fetch and render remote data", "Structure scalable projects"],
    modules: [
      {
        id: "m1",
        title: "Getting started",
        lessons: [
          { id: "l1", title: "Course introduction and tooling", durationMinutes: 14, videoId: "bMknfKXIFA8" },
          { id: "l2", title: "Components and props", durationMinutes: 22, videoId: "SqcY0GlETPk" },
        ],
      },
      {
        id: "m2",
        title: "State and effects",
        lessons: [
          { id: "l3", title: "State with useState", durationMinutes: 18, videoId: "O6P86uwfdR0" },
          { id: "l4", title: "Side effects with useEffect", durationMinutes: 25, videoId: "0ZJgIjIuY7U" },
        ],
      },
    ],
  },
  {
    id: "typescript-essentials",
    title: "TypeScript Essentials",
    summary: "Add static typing to JavaScript projects and catch defects before they reach production.",
    category: "Programming",
    level: "Intermediate",
    instructor: "Daniel Okafor",
    rating: 4.7,
    reviewCount: 1560,
    learners: 12980,
    hours: 9,
    thumbnailVideoId: "30LWjhZzg50",
    previewVideoId: "30LWjhZzg50",
    outcomes: ["Model data with interfaces and generics", "Configure strict compilation", "Type React applications", "Refactor safely"],
    modules: [
      {
        id: "m1",
        title: "The type system",
        lessons: [
          { id: "l1", title: "Why TypeScript", durationMinutes: 12, videoId: "30LWjhZzg50" },
          { id: "l2", title: "Interfaces and type aliases", durationMinutes: 20, videoId: "zQnBQ4tB3ZA" },
        ],
      },
      {
        id: "m2",
        title: "Advanced patterns",
        lessons: [
          { id: "l3", title: "Generics in practice", durationMinutes: 24, videoId: "nViEqpgwxHE" },
          { id: "l4", title: "Utility types", durationMinutes: 16, videoId: "zQnBQ4tB3ZA" },
        ],
      },
    ],
  },
  {
    id: "python-for-data",
    title: "Python for Data Analysis",
    summary: "Clean, explore, and visualize datasets with Python, pandas, and notebooks.",
    category: "Data and AI",
    level: "Beginner",
    instructor: "Sofia Alvarez",
    rating: 4.9,
    reviewCount: 3210,
    learners: 26750,
    hours: 14,
    thumbnailVideoId: "rfscVS0vtbw",
    previewVideoId: "rfscVS0vtbw",
    outcomes: ["Write idiomatic Python", "Transform tabular data", "Create clear visualizations", "Communicate findings"],
    modules: [
      {
        id: "m1",
        title: "Python basics",
        lessons: [
          { id: "l1", title: "Syntax and data types", durationMinutes: 28, videoId: "rfscVS0vtbw" },
          { id: "l2", title: "Functions and modules", durationMinutes: 21, videoId: "kqtD5dpn9C8" },
        ],
      },
      {
        id: "m2",
        title: "Working with data",
        lessons: [
          { id: "l3", title: "Introduction to pandas", durationMinutes: 30, videoId: "vmEHCJofslg" },
          { id: "l4", title: "Visualizing results", durationMinutes: 19, videoId: "UO98lJQ3QGI" },
        ],
      },
    ],
  },
  {
    id: "machine-learning-intro",
    title: "Machine Learning Fundamentals",
    summary: "Understand core algorithms, model evaluation, and the end to end machine learning workflow.",
    category: "Data and AI",
    level: "Intermediate",
    instructor: "Wei Zhang",
    rating: 4.6,
    reviewCount: 980,
    learners: 9420,
    hours: 16,
    thumbnailVideoId: "NWONeJKn6kc",
    previewVideoId: "NWONeJKn6kc",
    outcomes: ["Train and evaluate models", "Prevent overfitting", "Select features", "Deploy a simple model"],
    modules: [
      {
        id: "m1",
        title: "Core concepts",
        lessons: [
          { id: "l1", title: "What is machine learning", durationMinutes: 17, videoId: "NWONeJKn6kc" },
          { id: "l2", title: "Supervised learning", durationMinutes: 26, videoId: "i_LwzRVP7bg" },
        ],
      },
    ],
  },
  {
    id: "cs-fundamentals",
    title: "Computer Science Fundamentals",
    summary: "Data structures, algorithms, and computational thinking for working engineers.",
    category: "Computer Science",
    level: "Intermediate",
    instructor: "Marcus Bell",
    rating: 4.8,
    reviewCount: 1870,
    learners: 15300,
    hours: 20,
    thumbnailVideoId: "8hly31xKli0",
    previewVideoId: "8hly31xKli0",
    outcomes: ["Analyze algorithm complexity", "Choose appropriate data structures", "Solve problems systematically", "Prepare for technical interviews"],
    modules: [
      {
        id: "m1",
        title: "Algorithms",
        lessons: [
          { id: "l1", title: "Big O notation", durationMinutes: 15, videoId: "8hly31xKli0" },
          { id: "l2", title: "Sorting and searching", durationMinutes: 29, videoId: "kPRA0W1kECg" },
        ],
      },
    ],
  },
  {
    id: "html-css-modern",
    title: "Modern HTML and CSS",
    summary: "Create responsive, accessible layouts using semantic markup, flexbox, and grid.",
    category: "Web Development",
    level: "Beginner",
    instructor: "Amara Lewis",
    rating: 4.7,
    reviewCount: 2760,
    learners: 22110,
    hours: 10,
    thumbnailVideoId: "mU6anWqZJcc",
    previewVideoId: "mU6anWqZJcc",
    outcomes: ["Write semantic HTML", "Build responsive layouts", "Apply design systems", "Ship accessible pages"],
    modules: [
      {
        id: "m1",
        title: "Foundations",
        lessons: [
          { id: "l1", title: "Semantic markup", durationMinutes: 16, videoId: "mU6anWqZJcc" },
          { id: "l2", title: "Flexbox and grid", durationMinutes: 27, videoId: "phWxA89Dy94" },
        ],
      },
    ],
  },
  {
    id: "node-backend",
    title: "Node.js Backend Development",
    summary: "Design and ship REST services with Node.js, validation, authentication, and testing.",
    category: "Programming",
    level: "Advanced",
    instructor: "Tomas Reyes",
    rating: 4.5,
    reviewCount: 840,
    learners: 7260,
    hours: 15,
    thumbnailVideoId: "Oe421EPjeBE",
    previewVideoId: "Oe421EPjeBE",
    outcomes: ["Design REST APIs", "Secure endpoints", "Handle errors consistently", "Instrument services"],
    modules: [
      {
        id: "m1",
        title: "Services",
        lessons: [
          { id: "l1", title: "Project setup", durationMinutes: 13, videoId: "Oe421EPjeBE" },
          { id: "l2", title: "Routing and middleware", durationMinutes: 23, videoId: "L72fhGm1tfE" },
        ],
      },
    ],
  },
  {
    id: "ux-design-basics",
    title: "UX Design Basics",
    summary: "Research, wireframe, and test user experiences with a practical design process.",
    category: "Design",
    level: "Beginner",
    instructor: "Hannah Cole",
    rating: 4.6,
    reviewCount: 1190,
    learners: 10840,
    hours: 8,
    thumbnailVideoId: "c9Wg6Cb_YlU",
    previewVideoId: "c9Wg6Cb_YlU",
    outcomes: ["Plan user research", "Create wireframes", "Run usability tests", "Present design rationale"],
    modules: [
      {
        id: "m1",
        title: "Process",
        lessons: [
          { id: "l1", title: "Understanding users", durationMinutes: 14, videoId: "c9Wg6Cb_YlU" },
          { id: "l2", title: "Wireframing", durationMinutes: 18, videoId: "qpH7-KFWZRI" },
        ],
      },
    ],
  },
];

export function findCourse(id: string): Course | undefined {
  return COURSES.find((course) => course.id === id);
}

export function thumbnailUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}
