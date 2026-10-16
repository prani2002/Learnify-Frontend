const photo = (id: string, width: number) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=90`;
const portrait = (path: string) => `https://randomuser.me/api/portraits/${path}.jpg`;

export const IMAGES = {
  hero: photo("1522202176988-66273c2fd55f", 1800),
  login: photo("1524758631624-e2822e304c36", 1600),
};

export const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#courses", label: "Courses" },
  { href: "#categories", label: "Categories" },
  { href: "#about", label: "About Us" },
  { href: "#contact", label: "Contact" },
];

export const STATS = [
  { icon: "users", value: 10000, suffix: "+", label: "Active students" },
  { icon: "book", value: 500, suffix: "+", label: "Online courses" },
  { icon: "award", value: 100, suffix: "+", label: "Expert instructors" },
  { icon: "star", value: 4.8, suffix: "/5", label: "Average rating", decimals: 1 },
] as const;

export const LANDING_COURSES = [
  { id: "c1", tag: "Full stack web development", title: "Full Stack Web Development with JavaScript", image: photo("1555066931-4365d14bab8c", 1000), students: 120, level: "Intermediate" },
  { id: "c2", tag: "Mastering Python", title: "Python: From Zero to Hero", image: photo("1515879218367-8466d910aaa4", 1000), students: 240, level: "Beginner" },
  { id: "c3", tag: "Data analytics", title: "Data Analysis and Visualization Masterclass", image: photo("1551288049-bebda4e38f71", 1000), students: 180, level: "Intermediate" },
  { id: "c4", tag: "Cloud and DevOps", title: "DevOps Fundamentals to Production", image: photo("1550751827-4bd374c3f58b", 1000), students: 95, level: "Advanced" },
  { id: "c5", tag: "Web development", title: "Modern Frontend with React and TypeScript", image: photo("1461749280684-dccba630e2f6", 1000), students: 310, level: "Intermediate" },
  { id: "c6", tag: "Backend engineering", title: "Backend Services with Node.js and APIs", image: photo("1498050108023-c5249f4df085", 1000), students: 150, level: "Advanced" },
  { id: "c7", tag: "Mobile development", title: "App Development with Flutter", image: photo("1512941937669-90a1b58e7e9c", 1000), students: 205, level: "Beginner" },
  { id: "c8", tag: "Machine learning", title: "Machine Learning Fundamentals", image: photo("1526374965328-7f61d4dc18c5", 1000), students: 170, level: "Intermediate" },
] as const;

export const CATEGORIES = [
  { id: "web", name: "Web Development", text: "Frontend, backend, and full stack engineering paths.", courses: 84 },
  { id: "data", name: "Data and AI", text: "Analytics, machine learning, and applied statistics.", courses: 62 },
  { id: "design", name: "Graphic Design", text: "Visual design, UX research, and prototyping.", courses: 47 },
  { id: "writing", name: "Content Writing", text: "Technical writing, editing, and content strategy.", courses: 29 },
  { id: "finance", name: "Finance", text: "Accounting, budgeting, and financial modelling.", courses: 38 },
] as const;

export const FEATURES = [
  { icon: "laptop", title: "Learn anywhere", text: "Access courses at your convenience, any time, on any device." },
  { icon: "infinity", title: "Lifetime access", text: "Get unlimited access to courses once you enroll." },
  { icon: "badge", title: "Get certified", text: "Earn verified certificates upon course completion." },
  { icon: "headphones", title: "24/7 support", text: "Our support team is always ready to help you." },
] as const;

export const NEWS_POSTS = [
  { id: "n1", category: "Education", title: "How to Maximize Your Online Learning", excerpt: "Proven strategies and best practices for getting the most out of your online courses and achieving your goals faster.", date: "Nov 12, 2025", readTime: "5 min read", author: "John Doe", image: photo("1434030216411-0b793f4b4173", 1200) },
  { id: "n2", category: "Mastering Python", title: "Top 10 In-Demand Skills to Learn in 2026", excerpt: "Stay ahead of the curve with the in-demand skills that will boost your career prospects and open new opportunities.", date: "Nov 10, 2025", readTime: "7 min read", author: "Sarah Smith", image: photo("1504639725590-34d0984388bd", 1200) },
  { id: "n3", category: "Education", title: "The Future of Remote Learning", excerpt: "Explore how cutting edge technology is reshaping education and what it means for students and professionals.", date: "Nov 8, 2025", readTime: "6 min read", author: "Mike Johnson", image: photo("1573164713714-d95e436ab8d6", 1200) },
] as const;

export const TRAINERS = [
  { id: "t1", name: "David Miller", role: "Web Development Expert", rating: 4.9, courses: 15, students: "25,000", image: photo("1500648767791-00dcc994a43e", 1000) },
  { id: "t2", name: "Sarah Johnson", role: "Business Strategy Coach", rating: 5, courses: 22, students: "38,500", image: photo("1544005313-94ddf0286df2", 1000) },
  { id: "t3", name: "Michael Chen", role: "Design and Marketing", rating: 4.8, courses: 18, students: "31,200", image: photo("1507003211169-0a1dd7228f2d", 1000) },
  { id: "t4", name: "Elena Marsh", role: "Data Science Lead", rating: 4.9, courses: 12, students: "27,800", image: photo("1580489944761-15a19d654956", 1000) },
] as const;

export const REVIEWS = [
  { id: "r1", name: "Emily Rodriguez", role: "Marketing Manager", image: portrait("women/26"), quote: "This platform has completely transformed my career. The courses are incredibly comprehensive and the instructors genuinely care about student success." },
  { id: "r2", name: "James Wilson", role: "Software Developer", image: portrait("men/12"), quote: "I gained skills that I use every single day on the job. The projects felt like real work and the feedback was fast." },
  { id: "r3", name: "Lisa Anderson", role: "Graphic Designer", image: portrait("women/68"), quote: "Best investment I have made in my professional development. The courses are well structured and engaging." },
  { id: "r4", name: "Aslam Uddin", role: "UX Designer", image: portrait("men/52"), quote: "I changed careers within six months. The instructors are practitioners and it shows in every lesson." },
] as const;

export const FOOTER_COLUMNS = [
  { title: "Quick links", links: ["About us", "All courses", "Become instructor", "Career track", "Free resources"] },
  { title: "Support", links: ["Help center", "FAQs", "Terms of service", "Privacy policy", "Contact us"] },
] as const;

export const CONTACT_INFO = {
  address: "4517 Washington Ave., Manchester, Kentucky 39495",
  phone: "+1 (405) 555-0128",
  email: "support@learnify.demo",
};

export const INSTRUCTOR_PROFILES = [
  { id: "p1", name: "Elena Marsh", role: "Senior Engineer", image: portrait("women/65") },
  { id: "p2", name: "Daniel Okafor", role: "Principal Architect", image: portrait("men/86") },
  { id: "p3", name: "Sofia Alvarez", role: "Analytics Director", image: portrait("women/90") },
  { id: "p4", name: "Wei Zhang", role: "Machine Learning Engineer", image: portrait("men/52") },
  { id: "p5", name: "Marcus Bell", role: "Computer Science Lecturer", image: portrait("men/12") },
  { id: "p6", name: "Amara Lewis", role: "Frontend Specialist", image: portrait("women/26") },
  { id: "p7", name: "Tomas Reyes", role: "Backend Engineer", image: portrait("men/32") },
  { id: "p8", name: "Hannah Cole", role: "UX Design Lead", image: portrait("women/44") },
] as const;

export const SPOTLIGHT_TESTIMONIALS = REVIEWS;
