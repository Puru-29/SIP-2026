import { demoVideos } from "@/data/course-library";

export interface DemoClip {
  src: string;
  srcFallback: string;
  credit: string;
}

function clip(key: string): DemoClip {
  const v = demoVideos.find((d) => d.key === key) ?? demoVideos[0]!;
  return { src: v.src, srcFallback: v.srcFallback, credit: v.credit };
}

/**
 * Free demo lecture per program, keyed by program slug.
 * Add a new entry here (or leave it out for a "coming soon" state) when a new
 * program is added — nothing else needs to change.
 */
export const programDemos: Record<string, DemoClip | undefined> = {
  "full-stack-development": clip("technology"),
  "cloud-devops-engineering": clip("technology"),
  "cyber-security-defence": clip("technology"),
  "data-science-career-track": clip("data"),
  "data-analytics-professional": clip("data"),
  "ai-machine-learning": clip("data"),
  "business-analytics": clip("business"),
  "fintech-finance-analytics": clip("business"),
  "digital-marketing-growth": clip("marketing"),
  "ui-ux-product-design": clip("design"),
};

/** Fallback by subject area so a program is never left without a preview. */
const byCategory: Record<string, string> = {
  "Web Development": "technology",
  "Other Emerging Tech": "technology",
  "Cyber Security": "technology",
  "Data Science": "data",
  "Data Analytics": "data",
  "AI / Machine Learning": "data",
  "Business Analytics": "business",
  Finance: "business",
  "Digital Marketing": "marketing",
  "UI/UX": "design",
  "HR & Career": "career",
};

/** Free preview lecture for a program (by slug, falling back to its category). */
export function programDemoVideo(
  program: { slug?: string; category: string } | string,
): DemoClip | undefined {
  if (typeof program === "string") return clip(byCategory[program] ?? "technology");
  const bySlug = program.slug ? programDemos[program.slug] : undefined;
  if (bySlug) return bySlug;
  const key = byCategory[program.category];
  return key ? clip(key) : undefined;
}
