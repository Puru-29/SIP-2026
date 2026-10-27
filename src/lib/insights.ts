import { jobs } from "@/data/opportunities";
import { programs } from "@/data/programs";
import type { AtsResult, CareerPlan } from "@/lib/store";
import type { Job } from "@/types";

export function scoreResume(fileName: string, seed = 0): AtsResult {
  const base = 74 + ((fileName.length + seed) % 14);
  const jitter = (n: number) => Math.max(60, Math.min(98, base + n));
  const breakdown = [
    { label: "Formatting", score: jitter(8) },
    { label: "Keywords", score: jitter(-2) },
    { label: "Experience", score: jitter(4) },
    { label: "Skills", score: jitter(6) },
    { label: "Structure", score: jitter(2) },
  ];
  const total = Math.round(breakdown.reduce((a, b) => a + b.score, 0) / breakdown.length);
  return {
    total,
    breakdown,
    fileName,
    strengths: [
      "Strong technical skills section aligned to engineering roles",
      "Project section shows shipped, verifiable work",
      "Clean single-column layout parses cleanly in ATS engines",
    ],
    improvements: [
      "Add more job-specific keywords (REST, CI/CD, testing)",
      "Rewrite the summary to lead with outcomes, not adjectives",
      "Add measurable achievements — numbers, %, scale",
      "Trim the resume to a single page for early-career roles",
    ],
  };
}

export interface JobMatch {
  job: Job;
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  reasons: string[];
}

export function matchJobs(skills: string[], experienceYears = 1): JobMatch[] {
  const owned = skills.map((s) => s.toLowerCase());
  return jobs
    .map((job) => {
      const matchedSkills = job.skills.filter((s) => owned.includes(s.toLowerCase()));
      const missingSkills = job.skills.filter((s) => !owned.includes(s.toLowerCase()));
      const skillScore = (matchedSkills.length / job.skills.length) * 72;
      const expGap = Math.abs(job.experienceYears - experienceYears);
      const expScore = Math.max(0, 20 - expGap * 6);
      const freshness = Math.max(0, 8 - job.postedDaysAgo * 0.5);
      const score = Math.min(98, Math.round(skillScore + expScore + freshness));
      const reasons = [
        `${matchedSkills.length}/${job.skills.length} required skills already on your profile${
          matchedSkills.length ? `: ${matchedSkills.join(", ")}` : ""
        }`,
        expGap <= 1
          ? `Experience expectation (${job.experience}) fits your current level`
          : `Experience expectation (${job.experience}) is a stretch — highlight projects`,
        job.postedDaysAgo <= 4
          ? "Posted recently, so applications are still being reviewed"
          : "Older posting — apply with a referral for better odds",
      ];
      return { job, score, matchedSkills, missingSkills, reasons };
    })
    .sort((a, b) => b.score - a.score);
}

export interface CareerAnswers {
  education: string;
  experience: string;
  skills: string[];
  interests: string[];
  industry: string;
  goal: string;
}

const roleMap: {
  role: string;
  interests: string[];
  skills: string[];
  programSlugs: string[];
  projects: string[];
  summary: string;
}[] = [
  {
    role: "Full Stack Developer",
    interests: ["Building products", "Web development"],
    skills: ["React", "TypeScript", "Node.js", "MongoDB", "Docker", "System Design"],
    programSlugs: ["full-stack-development", "cloud-devops-engineering"],
    projects: ["Jobs marketplace API", "Realtime notification service", "Multi-tenant dashboard"],
    summary:
      "You like turning ideas into shipped software and enjoy both interface polish and backend logic. Full stack roles give you the widest surface area early in your career.",
  },
  {
    role: "Data Scientist",
    interests: ["Working with data", "AI & research"],
    skills: ["Python", "Statistics", "Scikit-learn", "SQL", "MLflow"],
    programSlugs: ["data-science-career-track", "ai-machine-learning"],
    projects: ["Churn prediction case study", "Demand forecasting model", "A/B test analysis"],
    summary:
      "You gravitate to patterns and evidence. Data science pairs your analytical instinct with modelling depth and strong long-term compounding.",
  },
  {
    role: "Product Designer",
    interests: ["Design & visual craft"],
    skills: ["Figma", "User Research", "Design Systems", "Prototyping", "Accessibility"],
    programSlugs: ["ui-ux-product-design"],
    projects: ["Onboarding redesign case study", "Design system in Figma", "Usability test report"],
    summary:
      "You care how things feel, not just whether they work. Product design rewards taste plus research rigour.",
  },
  {
    role: "Business Analyst",
    interests: ["Business & strategy", "Working with data"],
    skills: ["SQL", "Excel Modelling", "Power BI", "Forecasting", "Strategy"],
    programSlugs: ["business-analytics", "data-analytics-professional"],
    projects: ["Category teardown", "3-year driver model", "Executive dashboard"],
    summary:
      "You enjoy the decision behind the number. Analytics and strategy roles put you close to leadership early.",
  },
  {
    role: "Cloud / DevOps Engineer",
    interests: ["Infrastructure & scale", "Security"],
    skills: ["Docker", "Kubernetes", "Terraform", "CI/CD", "Observability"],
    programSlugs: ["cloud-devops-engineering", "cyber-security-defence"],
    projects: [
      "Kubernetes platform build",
      "IaC environment provisioning",
      "Incident response drill",
    ],
    summary:
      "You like systems that stay up under pressure. Platform roles are scarce, well-paid and highly transferable.",
  },
];

export function buildCareerPlan(answers: CareerAnswers): CareerPlan {
  const scored = roleMap.map((r) => {
    const interestHits = r.interests.filter((i) => answers.interests.includes(i)).length;
    const skillHits = r.skills.filter((s) =>
      answers.skills.map((x) => x.toLowerCase()).includes(s.toLowerCase()),
    ).length;
    const goalHit = answers.goal.toLowerCase().includes(r.role.split(" ")[0]!.toLowerCase())
      ? 2
      : 0;
    return { r, score: interestHits * 3 + skillHits * 2 + goalHit };
  });
  scored.sort((a, b) => b.score - a.score);
  const best = scored[0]!.r;
  const owned = answers.skills.map((s) => s.toLowerCase());
  const skillsToLearn = best.skills.filter((s) => !owned.includes(s.toLowerCase()));
  const matches = matchJobs([...answers.skills, ...best.skills.slice(0, 3)]);

  return {
    role: best.role,
    match: Math.min(96, 68 + scored[0]!.score * 4),
    summary: best.summary,
    skillsToLearn: skillsToLearn.length ? skillsToLearn : best.skills.slice(0, 3),
    programSlugs: best.programSlugs,
    projects: best.projects,
    internshipIds: ["i1", "i4", "i7"],
    jobIds: matches.slice(0, 3).map((m) => m.job.id),
  };
}

export function careerReadiness(input: {
  /** average course/program progress 0-100 */
  progress: number;
  /** number of projects completed or meaningfully advanced */
  projects: number;
  /** number of skills on the profile */
  skillCount: number;
  /** number of work experience entries on the profile */
  experienceCount: number;
  /** 0-100 resume completeness/ATS score, 0 when no resume exists */
  resumeScore: number;
  /** applications submitted */
  applications: number;
}) {
  // Every pillar genuinely starts at 0 for a brand-new account.
  const skills = Math.min(
    100,
    Math.round(input.progress * 0.6 + Math.min(40, input.skillCount * 5)),
  );
  const projectScore = Math.min(100, input.projects * 25);
  const resume = Math.max(0, Math.min(100, Math.round(input.resumeScore)));
  const experience = Math.min(
    100,
    input.experienceCount * 30 + Math.min(40, input.applications * 8),
  );
  const total = Math.round((skills + projectScore + resume + experience) / 4);
  return {
    total,
    pillars: [
      { label: "Skills", value: skills },
      { label: "Projects", value: projectScore },
      { label: "Resume", value: resume },
      { label: "Experience", value: experience },
    ],
  };
}

export function recommendedPrograms(skills: string[]) {
  const owned = skills.map((s) => s.toLowerCase());
  return [...programs]
    .map((p) => ({
      program: p,
      overlap: p.skills.filter((s) => owned.includes(s.toLowerCase())).length,
    }))
    .sort((a, b) => b.overlap - a.overlap || b.program.rating - a.program.rating)
    .slice(0, 3)
    .map((x) => x.program);
}
