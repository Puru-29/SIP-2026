export type Role = "student" | "admin" | "mentor" | "recruiter";

export interface WorkExperience {
  id?: string;
  company: string;
  title: string;
  /** human readable range, kept for display in existing UI */
  period: string;
  summary: string;
  employmentType?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  headline: string;
  about: string;
  avatar: string;
  location: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  skills: string[];
  education: { school: string; degree: string; year: string }[];
  experience: WorkExperience[];
  links: { label: string; url: string }[];
  profileCompletion: number;
  resumeScore: number;
}

export type Level = "Beginner" | "Intermediate" | "Advanced";

export interface Program {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  level: Level;
  durationWeeks: number;
  projects: number;
  lessons: number;
  rating: number;
  learners: number;
  price: number;
  originalPrice: number;
  certificate: boolean;
  mentorship: boolean;
  jobSupport: boolean;
  skills: string[];
  outcomes: string[];
  technologies: string[];
  mentorIds: string[];
  curriculum: {
    module: string;
    title: string;
    items: { type: "lesson" | "project" | "assignment" | "quiz"; title: string }[];
  }[];
  faqs: { q: string; a: string }[];
  reviews: { name: string; role: string; rating: number; text: string }[];
  gradient: string;
}

export interface Internship {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  mode: "Remote" | "Hybrid" | "On-site";
  durationMonths: number;
  stipend: number;
  skills: string[];
  deadline: string;
  applicants: number;
  category: string;
  description: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  mode: "Remote" | "Hybrid" | "On-site";
  type: "Full-time" | "Part-time" | "Contract" | "Internship";
  salaryMin: number;
  salaryMax: number;
  experience: string;
  experienceYears: number;
  postedDaysAgo: number;
  industry: string;
  skills: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
}

export type ApplicationStage =
  "Applied" | "Under Review" | "Shortlisted" | "Interview" | "Selected" | "Rejected";

export interface Application {
  id: string;
  kind: "job" | "internship";
  refId: string;
  title: string;
  company: string;
  stage: ApplicationStage;
  appliedOn: string;
  resumeName: string;
  note?: string;
}

export interface Enrollment {
  programId: string;
  progress: number;
  completedLessons: string[];
  currentLesson: string;
  enrolledOn: string;
}

export interface Mentor {
  id: string;
  name: string;
  avatar: string;
  expertise: string[];
  company: string;
  experienceYears: number;
  rating: number;
  sessions: number;
  availability: string[];
  bio: string;
}

export type ProjectStage = "Assigned" | "Planning" | "Development" | "Review" | "Completed";

export interface ProjectItem {
  id: string;
  title: string;
  program: string;
  stage: ProjectStage;
  progress: number;
  dueDate: string;
  stack: string[];
  summary: string;
  repoUrl?: string;
  demoUrl?: string;
  feedback?: { mentor: string; text: string; date: string }[];
}

export interface Certificate {
  id: string;
  title: string;
  issuedOn: string;
  code: string;
  skills: string[];
  grade: string;
}

export interface Notification {
  id: string;
  icon: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  href?: string;
}

export interface ResumeData {
  template: "aurora" | "onyx" | "compact" | "editorial";
  personal: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  education: { school: string; degree: string; year: string; score: string }[];
  experience: { company: string; title: string; period: string; summary: string }[];
  skills: string[];
  projects: { name: string; description: string; link: string }[];
  certifications: string[];
  achievements: string[];
  links: { label: string; url: string }[];
}

export interface CourseModule {
  title: string;
  lessons: string[];
}

export type CourseGroup =
  | "Technology"
  | "Data & AI"
  | "Business"
  | "Marketing"
  | "Social Media"
  | "Design"
  | "Finance"
  | "HR & Career"
  | "Cloud & DevOps"
  | "Cybersecurity";

export type CourseFormat = "Self-Paced" | "Instructor Led" | "Project Based";

export interface Course {
  id: string;
  title: string;
  /** Top-level catalog group used by the course library filters. */
  group: CourseGroup;
  /** Artwork / legacy category label. */
  category: string;
  tagline: string;
  description: string;
  level: Level;
  rating: number;
  reviewCount: number;
  learners: number;
  hours: number;
  lessonCount: number;
  projects: number;
  certificate: boolean;
  mentorship: boolean;
  price: number;
  originalPrice: number;
  mode: "Self-paced" | "Live cohort";
  format: CourseFormat;
  /** Playable free preview lecture. */
  demoVideo: string;
  demoVideoFallback?: string;
  demoCredit?: string;
  instructor: { name: string; title: string; company: string; initials: string; bio: string };
  outcomes: string[];
  skills: string[];
  modules: CourseModule[];
  careerBenefits: string[];
  reviews: { name: string; role: string; rating: number; text: string; date?: string }[];
  faqs: { q: string; a: string }[];
  relatedIds?: string[];
  programSlug?: string;
}

/** A catalog entry before library defaults (group/format/demo video) are applied. */
export type CourseSeed = Omit<Course, "group" | "format" | "demoVideo"> &
  Partial<Pick<Course, "group" | "format" | "demoVideo">>;
