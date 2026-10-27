import { programs } from "@/data/programs";
import { libraryCourses, demoVideoForGroup } from "@/data/course-library";
import type { Course, CourseFormat, CourseGroup, CourseSeed, Level } from "@/types";

const instructors = [
  {
    name: "Arjun Nair",
    title: "Staff Engineer",
    company: "Razorpay",
    initials: "AN",
    bio: "Leads a web platform team and has mentored 400+ learners on React architecture and interview readiness.",
  },
  {
    name: "Dr. Meera Iyer",
    title: "Principal Data Scientist",
    company: "Swiggy",
    initials: "MI",
    bio: "Builds forecasting and ranking systems in production; teaches statistics without the hand-waving.",
  },
  {
    name: "Rohit Bansal",
    title: "Head of Growth",
    company: "Zepto",
    initials: "RB",
    bio: "Ran performance marketing across five categories; obsessed with unit economics and clean attribution.",
  },
  {
    name: "Sanya Kulkarni",
    title: "Senior Product Designer",
    company: "Freshworks",
    initials: "SK",
    bio: "Ships design systems used by 30+ engineers and reviews portfolios for hiring panels.",
  },
  {
    name: "Vikram Shetty",
    title: "Security Architect",
    company: "Tata Digital",
    initials: "VS",
    bio: "Runs red-team exercises and application security reviews for consumer fintech products.",
  },
] as const;

function pick<T>(arr: readonly T[], i: number): T {
  return arr[i % arr.length]!;
}

const genericFaqs = [
  {
    q: "Do I need prior experience?",
    a: "Beginner modules start from first principles. If you already know the basics you can mark early lessons complete and jump ahead.",
  },
  {
    q: "How much time should I plan per week?",
    a: "Most learners finish comfortably at 6–8 focused hours per week, including the project work.",
  },
  {
    q: "Is the certificate verifiable?",
    a: "Yes. Every certificate carries a unique code that anyone can check on the public verification page.",
  },
  {
    q: "What if I fall behind?",
    a: "All lessons stay unlocked for a year and mentors help you rebuild a realistic schedule.",
  },
];

const programCourses: CourseSeed[] = programs.map((p, idx) => {
  const modules = p.curriculum.map((m) => ({
    title: m.title,
    lessons: m.items.map((i) => i.title),
  }));
  const lessonCount = modules.reduce((n, m) => n + m.lessons.length, 0);
  return {
    id: p.slug,
    title: p.title.replace(/ (Program|Career Track|Professional|Advanced)$/, "") || p.title,
    category: p.category,
    tagline: p.description,
    description: p.longDescription,
    level: p.level,
    rating: p.rating,
    reviewCount: Math.round(p.learners / 18),
    learners: p.learners,
    hours: p.durationWeeks * 7,
    lessonCount,
    projects: p.projects,
    certificate: p.certificate,
    mentorship: p.mentorship,
    price: Math.round(p.price * 0.55),
    originalPrice: p.originalPrice,
    mode: idx % 3 === 0 ? "Live cohort" : "Self-paced",
    instructor: pick(instructors, idx),
    outcomes: p.outcomes,
    skills: p.skills,
    modules,
    careerBenefits: [
      "Portfolio-ready projects reviewed by a working practitioner",
      "Verifiable certificate you can attach to applications",
      "Resume and ATS review tuned to this role family",
      "Referrals into partner hiring pipelines on completion",
    ],
    reviews: p.reviews,
    faqs: p.faqs.length ? p.faqs : genericFaqs,
    programSlug: p.slug,
  };
});

const standaloneCourses: CourseSeed[] = [
  {
    id: "javascript-essentials",
    title: "JavaScript Essentials",
    category: "Web Development",
    tagline: "The 20% of JavaScript that powers 80% of real product code.",
    description:
      "A focused course on the language itself: scope, closures, prototypes, async patterns and the browser APIs you actually reach for. Every lesson ends with a small build so the concept sticks.",
    level: "Beginner",
    rating: 4.8,
    reviewCount: 1240,
    learners: 22400,
    hours: 32,
    lessonCount: 46,
    projects: 4,
    certificate: true,
    mentorship: false,
    price: 1499,
    originalPrice: 4999,
    mode: "Self-paced",
    instructor: instructors[0],
    outcomes: [
      "Read and reason about any modern JavaScript codebase",
      "Use closures, modules and async/await with confidence",
      "Debug with breakpoints instead of guesswork",
      "Ship four small browser projects without a framework",
    ],
    skills: ["JavaScript", "ES2023", "DOM", "Fetch API", "Debugging"],
    modules: [
      {
        title: "Language Foundations",
        lessons: [
          "Values, types and coercion",
          "Scope and the temporal dead zone",
          "Functions and closures",
          "Objects and prototypes",
        ],
      },
      {
        title: "Working with Data",
        lessons: [
          "Array methods that matter",
          "Destructuring and spread",
          "Immutability patterns",
          "JSON and validation",
        ],
      },
      {
        title: "Async JavaScript",
        lessons: [
          "The event loop, visually",
          "Promises from scratch",
          "async/await and error handling",
          "Cancelling in-flight work",
        ],
      },
      {
        title: "Browser & Tooling",
        lessons: [
          "DOM without jQuery",
          "Events and delegation",
          "Modules and bundlers",
          "DevTools deep dive",
        ],
      },
    ],
    careerBenefits: [
      "The prerequisite most React interviews actually test",
      "Four portfolio micro-projects",
      "Certificate on completion",
    ],
    reviews: [
      {
        name: "Kavya R.",
        role: "CS undergrad",
        rating: 5,
        text: "The event loop lesson finally made async click for me.",
      },
      {
        name: "Imran S.",
        role: "Career switcher",
        rating: 5,
        text: "Short lessons, real builds, no filler.",
      },
    ],
    faqs: genericFaqs,
  },
  {
    id: "sql-for-analysts",
    title: "SQL for Analysts",
    category: "Data Analytics",
    tagline: "From SELECT to window functions on realistic business datasets.",
    description:
      "Query like an analyst, not a student. You work against an e-commerce warehouse of orders, users and events, and answer the questions a business actually asks.",
    level: "Beginner",
    rating: 4.9,
    reviewCount: 980,
    learners: 18600,
    hours: 26,
    lessonCount: 38,
    projects: 3,
    certificate: true,
    mentorship: false,
    price: 1299,
    originalPrice: 4499,
    mode: "Self-paced",
    instructor: instructors[1],
    outcomes: [
      "Write joins and aggregations without second-guessing",
      "Use window functions for cohorts and retention",
      "Model a clean reporting layer",
      "Explain a query result to a non-technical stakeholder",
    ],
    skills: ["SQL", "PostgreSQL", "Window Functions", "Data Modelling"],
    modules: [
      {
        title: "Querying Basics",
        lessons: [
          "SELECT, WHERE, ORDER BY",
          "Filtering with real messiness",
          "Aggregations and GROUP BY",
        ],
      },
      {
        title: "Joins in Practice",
        lessons: ["Inner vs outer joins", "Fan-out traps", "Self joins and hierarchies"],
      },
      {
        title: "Analytical SQL",
        lessons: ["Window functions", "Cohort and retention queries", "Funnels with events"],
      },
      {
        title: "Shipping Reports",
        lessons: [
          "CTEs for readable logic",
          "Query performance basics",
          "Building a reporting view",
        ],
      },
    ],
    careerBenefits: [
      "The single highest-signal skill in analyst interviews",
      "Three dataset projects",
      "Certificate on completion",
    ],
    reviews: [
      {
        name: "Nikhil D.",
        role: "Business Analyst",
        rating: 5,
        text: "The retention query lesson is worth the whole course.",
      },
      {
        name: "Ananya P.",
        role: "Ops Associate",
        rating: 5,
        text: "First time SQL felt like a business tool, not homework.",
      },
    ],
    faqs: genericFaqs,
  },
  {
    id: "figma-product-design",
    title: "Figma for Product Design",
    category: "UI/UX",
    tagline: "Design systems, components and handoff that engineers thank you for.",
    description:
      "A practical Figma course built around one product: you take a messy brief to an auto-layout design system, prototype it, and hand it off with specs.",
    level: "Beginner",
    rating: 4.8,
    reviewCount: 720,
    learners: 12800,
    hours: 24,
    lessonCount: 34,
    projects: 3,
    certificate: true,
    mentorship: true,
    price: 1699,
    originalPrice: 5499,
    mode: "Self-paced",
    instructor: instructors[3],
    outcomes: [
      "Build component libraries with variants and tokens",
      "Use auto layout for responsive screens",
      "Prototype flows that test well",
      "Hand off specs engineers can implement directly",
    ],
    skills: ["Figma", "Auto Layout", "Design Systems", "Prototyping"],
    modules: [
      {
        title: "Figma Fundamentals",
        lessons: ["Frames, grids and constraints", "Auto layout properly", "Styles and variables"],
      },
      {
        title: "Components at Scale",
        lessons: ["Variants and properties", "Token-driven theming", "Library publishing"],
      },
      {
        title: "Prototyping",
        lessons: ["Interactive components", "Flow-based prototypes", "Usability test setup"],
      },
      {
        title: "Handoff",
        lessons: ["Spec annotations", "Dev mode walkthrough", "Design QA checklist"],
      },
    ],
    careerBenefits: [
      "Portfolio case study with process shown",
      "Design system artefact recruiters look for",
      "Certificate on completion",
    ],
    reviews: [
      {
        name: "Sneha M.",
        role: "Junior Designer",
        rating: 5,
        text: "The handoff module got me through a real design review.",
      },
      {
        name: "Tanmay G.",
        role: "Frontend dev",
        rating: 4,
        text: "Useful even as an engineer — I finally understand tokens.",
      },
    ],
    faqs: genericFaqs,
  },
  {
    id: "python-for-data",
    title: "Python for Data Work",
    category: "Data Science",
    tagline: "Pandas, NumPy and clean notebooks that survive review.",
    description:
      "Learn Python the way data teams use it: reproducible notebooks, tidy dataframes, honest plots, and code you can hand to someone else.",
    level: "Beginner",
    rating: 4.7,
    reviewCount: 1105,
    learners: 20100,
    hours: 30,
    lessonCount: 42,
    projects: 4,
    certificate: true,
    mentorship: false,
    price: 1499,
    originalPrice: 4999,
    mode: "Self-paced",
    instructor: instructors[1],
    outcomes: [
      "Manipulate real datasets with pandas confidently",
      "Write reusable functions instead of copy-pasted cells",
      "Visualise distributions and trends honestly",
      "Ship a reproducible analysis notebook",
    ],
    skills: ["Python", "pandas", "NumPy", "Matplotlib", "Jupyter"],
    modules: [
      {
        title: "Python Core",
        lessons: [
          "Types and control flow",
          "Functions and modules",
          "Comprehensions",
          "Virtual environments",
        ],
      },
      {
        title: "Data Wrangling",
        lessons: [
          "Series and DataFrames",
          "Joins and reshaping",
          "Missing data strategies",
          "Group-by patterns",
        ],
      },
      {
        title: "Exploration",
        lessons: ["Descriptive statistics", "Plotting distributions", "Outlier handling"],
      },
      {
        title: "Reproducibility",
        lessons: ["Notebook hygiene", "Parameterised analysis", "Sharing results"],
      },
    ],
    careerBenefits: [
      "Foundation for every data program",
      "Four analysis notebooks for your portfolio",
      "Certificate on completion",
    ],
    reviews: [
      {
        name: "Harsh V.",
        role: "Mech engineer",
        rating: 5,
        text: "Went from zero Python to a working dashboard notebook.",
      },
      {
        name: "Ritika J.",
        role: "Analyst",
        rating: 4,
        text: "Group-by patterns module saved me hours at work.",
      },
    ],
    faqs: genericFaqs,
  },
  {
    id: "cloud-devops-basics",
    title: "Cloud & DevOps Basics",
    category: "Other Emerging Tech",
    tagline: "Docker, CI/CD and deployment for developers who ship.",
    description:
      "Get your application off localhost. Containers, pipelines, environments, logs and rollbacks — explained by deploying one app repeatedly until it is boring.",
    level: "Intermediate",
    rating: 4.7,
    reviewCount: 640,
    learners: 9400,
    hours: 28,
    lessonCount: 36,
    projects: 3,
    certificate: true,
    mentorship: true,
    price: 1899,
    originalPrice: 5999,
    mode: "Live cohort",
    instructor: instructors[0],
    outcomes: [
      "Containerise any web application",
      "Build a CI pipeline with tests and checks",
      "Manage environments and secrets safely",
      "Debug production with logs and metrics",
    ],
    skills: ["Docker", "GitHub Actions", "CI/CD", "Linux", "Observability"],
    modules: [
      {
        title: "Containers",
        lessons: ["Images vs containers", "Writing a lean Dockerfile", "Compose for local stacks"],
      },
      {
        title: "Pipelines",
        lessons: ["CI fundamentals", "Test and lint gates", "Build artefacts and caching"],
      },
      {
        title: "Deployment",
        lessons: ["Environments and config", "Zero-downtime releases", "Rollback strategy"],
      },
      {
        title: "Operations",
        lessons: ["Structured logging", "Metrics and alerts", "Incident basics"],
      },
    ],
    careerBenefits: [
      "The gap most junior developers have",
      "Deployment story for interviews",
      "Certificate on completion",
    ],
    reviews: [
      {
        name: "Deepak N.",
        role: "Backend dev",
        rating: 5,
        text: "The rollback lesson came up in my interview verbatim.",
      },
      {
        name: "Farah K.",
        role: "Final-year student",
        rating: 5,
        text: "Finally understand what CI actually runs.",
      },
    ],
    faqs: genericFaqs,
  },
  {
    id: "application-security-fundamentals",
    title: "Application Security Fundamentals",
    category: "Cyber Security",
    tagline: "Break your own app before someone else does.",
    description:
      "Hands-on secure development: the OWASP issues that keep appearing in real code reviews, how to exploit them in a lab, and how to fix them properly.",
    level: "Intermediate",
    rating: 4.8,
    reviewCount: 510,
    learners: 7600,
    hours: 26,
    lessonCount: 32,
    projects: 3,
    certificate: true,
    mentorship: true,
    price: 1999,
    originalPrice: 6499,
    mode: "Self-paced",
    instructor: instructors[4],
    outcomes: [
      "Identify the OWASP Top 10 in real code",
      "Exploit and then fix auth and injection flaws in a lab",
      "Threat-model a feature before building it",
      "Write a clear security review report",
    ],
    skills: ["OWASP", "Threat Modelling", "Auth Security", "Burp Suite"],
    modules: [
      {
        title: "Foundations",
        lessons: ["Security mindset", "HTTP and trust boundaries", "Threat modelling a feature"],
      },
      {
        title: "Injection & Access",
        lessons: ["SQL and command injection", "Broken access control", "Authentication flaws"],
      },
      { title: "Client-Side", lessons: ["XSS in depth", "CSRF and SameSite", "Dependency risk"] },
      {
        title: "Reporting",
        lessons: ["Reproducible findings", "Severity and impact", "Writing the report"],
      },
    ],
    careerBenefits: [
      "Lab evidence recruiters can review",
      "Security review writing sample",
      "Certificate on completion",
    ],
    reviews: [
      { name: "Aditya S.", role: "SDE-1", rating: 5, text: "Changed how I review pull requests." },
      {
        name: "Zoya H.",
        role: "Security intern",
        rating: 5,
        text: "The reporting module is what got me the offer.",
      },
    ],
    faqs: genericFaqs,
  },
];

const groupByCategory: Record<string, CourseGroup> = {
  "Web Development": "Technology",
  "Other Emerging Tech": "Technology",
  "Data Science": "Data & AI",
  "Data Analytics": "Data & AI",
  "AI / Machine Learning": "Data & AI",
  "Business Analytics": "Business",
  "Digital Marketing": "Marketing",
  "Social Media": "Social Media",
  "UI/UX": "Design",
  Finance: "Finance",
  "Cyber Security": "Cybersecurity",
};

function withLibraryDefaults(seed: CourseSeed, index: number): Course {
  const format: CourseFormat =
    seed.format ??
    (seed.mode === "Live cohort"
      ? "Instructor Led"
      : index % 3 === 0
        ? "Project Based"
        : "Self-Paced");
  const group = seed.group ?? groupByCategory[seed.category] ?? "Technology";
  const video = demoVideoForGroup(group);
  return {
    ...seed,
    group,
    format,
    demoVideo: seed.demoVideo ?? video.src,
    demoVideoFallback: seed.demoVideoFallback ?? video.srcFallback,
    demoCredit: seed.demoCredit ?? video.credit,
  };
}

const seeded = [...programCourses, ...standaloneCourses].map(withLibraryDefaults);
const seededIds = new Set(seeded.map((c) => c.id));

export const courses: Course[] = [
  ...seeded,
  // library entries never shadow a program-linked course with the same id
  ...libraryCourses.filter((c) => !seededIds.has(c.id)),
];

export const courseGroups: (CourseGroup | "All")[] = [
  "All",
  ...(Array.from(new Set(courses.map((c) => c.group))).sort() as CourseGroup[]),
];

export const courseCategories = ["All", ...Array.from(new Set(courses.map((c) => c.category)))];

export const courseLevels: (Level | "All")[] = ["All", "Beginner", "Intermediate", "Advanced"];

export const courseFormats: (CourseFormat | "All")[] = [
  "All",
  "Self-Paced",
  "Instructor Led",
  "Project Based",
];

export const courseDurationBuckets = [
  { id: "all", label: "Any length" },
  { id: "short", label: "Under 15 hours" },
  { id: "medium", label: "15 - 30 hours" },
  { id: "long", label: "30+ hours" },
] as const;

export type CourseDurationBucket = (typeof courseDurationBuckets)[number]["id"];

export function matchesDuration(course: Course, bucket: CourseDurationBucket) {
  if (bucket === "short") return course.hours < 15;
  if (bucket === "medium") return course.hours >= 15 && course.hours <= 30;
  if (bucket === "long") return course.hours > 30;
  return true;
}

export function getCourse(id: string) {
  return courses.find((c) => c.id === id);
}

export function relatedCourses(course: Course, limit = 3) {
  const explicit = (course.relatedIds ?? [])
    .map((id) => courses.find((c) => c.id === id))
    .filter((c): c is Course => Boolean(c) && c!.id !== course.id);
  const sameGroup = courses.filter(
    (c) => c.id !== course.id && c.group === course.group && !explicit.includes(c),
  );
  const rest = courses.filter(
    (c) => c.id !== course.id && !explicit.includes(c) && !sameGroup.includes(c),
  );
  return [...explicit, ...sameGroup, ...rest].slice(0, limit);
}

/** Simple interest-aware recommendations for dashboards and detail pages. */
export function recommendedCourses(enrolledIds: string[], savedIds: string[] = [], limit = 6) {
  const taken = new Set(enrolledIds);
  const seeds = [...enrolledIds, ...savedIds]
    .map((id) => getCourse(id))
    .filter((c): c is Course => Boolean(c));
  const groups = new Set(seeds.map((c) => c.group));
  const pool = courses.filter((c) => !taken.has(c.id));
  const preferred = pool.filter((c) => groups.has(c.group));
  const popular = [...pool].sort((a, b) => b.learners - a.learners);
  const out: Course[] = [];
  for (const c of [...preferred, ...popular]) {
    if (!out.includes(c)) out.push(c);
    if (out.length >= limit) break;
  }
  return out;
}

export function coursesByGroup() {
  const map = new Map<CourseGroup, Course[]>();
  for (const c of courses) {
    const list = map.get(c.group) ?? [];
    list.push(c);
    map.set(c.group, list);
  }
  return Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length);
}
