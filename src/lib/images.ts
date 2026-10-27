import aiMl from "@/assets/cat-ai-ml.jpg";
import businessAnalytics from "@/assets/cat-business-analytics.jpg";
import cyberSecurity from "@/assets/cat-cyber-security.jpg";
import dataAnalytics from "@/assets/cat-data-analytics.jpg";
import dataScience from "@/assets/cat-data-science.jpg";
import digitalMarketing from "@/assets/cat-digital-marketing.jpg";
import emergingTech from "@/assets/cat-emerging-tech.jpg";
import finance from "@/assets/cat-finance.jpg";
import uiUx from "@/assets/cat-ui-ux.jpg";
import webDevelopment from "@/assets/cat-web-development.jpg";

/**
 * Single source of truth for category artwork. Every card/hero image in the app
 * resolves through here so there is never a broken or missing image source.
 */
export const categoryImages = {
  "Web Development": webDevelopment,
  "Data Science": dataScience,
  "Data Analytics": dataAnalytics,
  "AI / Machine Learning": aiMl,
  "Digital Marketing": digitalMarketing,
  "UI/UX": uiUx,
  "Cyber Security": cyberSecurity,
  "Business Analytics": businessAnalytics,
  Finance: finance,
  "Other Emerging Tech": emergingTech,
} as const;

export type CategoryKey = keyof typeof categoryImages;

const aliases: Record<string, CategoryKey> = {
  "web development": "Web Development",
  frontend: "Web Development",
  "full stack": "Web Development",
  saas: "Web Development",
  "data science": "Data Science",
  ai: "AI / Machine Learning",
  "ai / machine learning": "AI / Machine Learning",
  "ai & machine learning": "AI / Machine Learning",
  "machine learning": "AI / Machine Learning",
  "data analytics": "Data Analytics",
  analytics: "Data Analytics",
  "digital marketing": "Digital Marketing",
  marketing: "Digital Marketing",
  retail: "Digital Marketing",
  "ui/ux": "UI/UX",
  "ui/ux design": "UI/UX",
  design: "UI/UX",
  "design tech": "UI/UX",
  "cyber security": "Cyber Security",
  cybersecurity: "Cyber Security",
  security: "Cyber Security",
  "business analytics": "Business Analytics",
  consulting: "Business Analytics",
  finance: "Finance",
  fintech: "Finance",
  "other emerging tech": "Other Emerging Tech",
  cloud: "Other Emerging Tech",
  devops: "Other Emerging Tech",
};

/** Resolves any category / industry / free-text label to a real image URL. */
export function imageFor(label: string | undefined | null): string {
  if (!label) return categoryImages["Other Emerging Tech"];
  const direct = categoryImages[label as CategoryKey];
  if (direct) return direct;
  const key = aliases[label.trim().toLowerCase()];
  if (key && categoryImages[key]) return categoryImages[key];
  return categoryImages["Other Emerging Tech"];
}

export const FALLBACK_IMAGE = categoryImages["Other Emerging Tech"];
