import type { ResumeData, User } from "@/types";

export const demoAccounts: { email: string; password: string; user: User }[] = [
  {
    email: "student@unifiedmentor.com",
    password: "Student@UM2026",
    user: {
      id: "u1",
      name: "Alex Mehra",
      email: "student@unifiedmentor.com",
      role: "student",
      headline: "Full Stack Developer in the making · React & Node",
      about:
        "Final-year CS student building products end to end. Currently deep in the Full Stack Development Program, shipping a jobs API and an analytics dashboard.",
      avatar: "AM",
      phone: "",
      dateOfBirth: "",
      address: "",
      location: "Pune, India",
      skills: ["React", "TypeScript", "Node.js", "MongoDB", "Tailwind CSS", "Git"],
      education: [
        {
          school: "Symbiosis Institute of Technology",
          degree: "B.Tech Computer Science",
          year: "2023 – 2027",
        },
        { school: "Delhi Public School", degree: "Senior Secondary (PCM)", year: "2021 – 2023" },
      ],
      experience: [
        {
          company: "Northwind Labs",
          title: "Frontend Intern",
          period: "May 2026 – Aug 2026",
          summary: "Shipped 14 components into the design system and cut bundle size by 18%.",
        },
      ],
      links: [
        { label: "GitHub", url: "https://github.com/alex-mehra" },
        { label: "LinkedIn", url: "https://linkedin.com/in/alex-mehra" },
        { label: "Portfolio", url: "https://alexmehra.dev" },
      ],
      profileCompletion: 85,
      resumeScore: 78,
    },
  },
  {
    email: "admin@unifiedmentor.com",
    password: "Admin@UM2026",
    user: {
      id: "u2",
      name: "Priya Sundaram",
      email: "admin@unifiedmentor.com",
      role: "admin",
      headline: "Platform Operations Lead",
      about: "Runs programme operations, partner relationships and platform quality.",
      avatar: "PS",
      phone: "",
      dateOfBirth: "",
      address: "",
      location: "Bengaluru, India",
      skills: ["Operations", "Analytics", "Programme Design"],
      education: [{ school: "IIM Indore", degree: "MBA", year: "2016 – 2018" }],
      experience: [
        {
          company: "Unified Mentor",
          title: "Operations Lead",
          period: "2022 – Present",
          summary: "Scaled cohort operations from 4k to 100k learners.",
        },
      ],
      links: [],
      profileCompletion: 100,
      resumeScore: 0,
    },
  },
  {
    email: "mentor@unifiedmentor.com",
    password: "Mentor@UM2026",
    user: {
      id: "u3",
      name: "Arjun Nair",
      email: "mentor@unifiedmentor.com",
      role: "mentor",
      headline: "Staff Engineer at Razorpay · Frontend Mentor",
      about: "Mentors 40 learners a cohort on React architecture and interview readiness.",
      avatar: "AN",
      phone: "",
      dateOfBirth: "",
      address: "",
      location: "Bengaluru, India",
      skills: ["React", "TypeScript", "System Design", "Mentoring"],
      education: [{ school: "NIT Trichy", degree: "B.Tech ECE", year: "2011 – 2015" }],
      experience: [
        {
          company: "Razorpay",
          title: "Staff Engineer",
          period: "2021 – Present",
          summary: "Leads the web platform team.",
        },
      ],
      links: [],
      profileCompletion: 96,
      resumeScore: 0,
    },
  },
  {
    email: "recruiter@unifiedmentor.com",
    password: "Recruiter@UM2026",
    user: {
      id: "u4",
      name: "Neha Kapadia",
      email: "recruiter@unifiedmentor.com",
      role: "recruiter",
      headline: "Talent Partner at Cobalt Systems",
      about: "Hires engineering and analytics talent across India and remote-first teams.",
      avatar: "NK",
      phone: "",
      dateOfBirth: "",
      address: "",
      location: "Remote",
      skills: ["Technical Hiring", "Sourcing", "Employer Branding"],
      education: [{ school: "Christ University", degree: "BBA", year: "2014 – 2017" }],
      experience: [
        {
          company: "Cobalt Systems",
          title: "Talent Partner",
          period: "2023 – Present",
          summary: "Closed 60+ engineering roles with a 92% offer acceptance rate.",
        },
      ],
      links: [],
      profileCompletion: 92,
      resumeScore: 0,
    },
  },
];

export const defaultResume: ResumeData = {
  template: "aurora",
  personal: {
    name: "Alex Mehra",
    title: "Full Stack Developer",
    email: "alex.mehra@gmail.com",
    phone: "+91 98200 41122",
    location: "Pune, India",
    summary:
      "Full stack developer with hands-on experience shipping React and Node applications. Built six production-style projects covering auth, payments and realtime notifications.",
  },
  education: [
    {
      school: "Symbiosis Institute of Technology",
      degree: "B.Tech Computer Science",
      year: "2023 – 2027",
      score: "8.7 CGPA",
    },
  ],
  experience: [
    {
      company: "Northwind Labs",
      title: "Frontend Engineering Intern",
      period: "May 2026 – Aug 2026",
      summary:
        "Shipped 14 design-system components, reduced bundle size 18%, and led accessibility fixes across 9 screens.",
    },
  ],
  skills: ["React", "TypeScript", "Node.js", "Express", "MongoDB", "Tailwind CSS", "Docker", "Git"],
  projects: [
    {
      name: "Unified Jobs API",
      description:
        "Role-based jobs and applications API with JWT auth, full-text search and rate limiting.",
      link: "github.com/alex-mehra/unified-jobs-api",
    },
    {
      name: "Analytics Dashboard",
      description: "Responsive dashboard with filters, charts and optimistic updates.",
      link: "analytics-alex.vercel.app",
    },
  ],
  certifications: [
    "React Professional Certificate — Unified Mentor",
    "Backend Engineering with Node.js",
  ],
  achievements: [
    "Top 3% in Unified Mentor cohort leaderboard",
    "Winner, Symbiosis Hack 2026 (fintech track)",
  ],
  links: [
    { label: "GitHub", url: "github.com/alex-mehra" },
    { label: "LinkedIn", url: "linkedin.com/in/alex-mehra" },
  ],
};

/** A genuinely empty resume — used for brand-new accounts. */
export const emptyResume: ResumeData = {
  template: "aurora",
  personal: { name: "", title: "", email: "", phone: "", location: "", summary: "" },
  education: [],
  experience: [],
  skills: [],
  projects: [],
  certifications: [],
  achievements: [],
  links: [],
};
