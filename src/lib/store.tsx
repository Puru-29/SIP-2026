import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { emptyResume } from "@/data/users";
import { programs } from "@/data/programs";
import { getCourse } from "@/data/courses";
import type {
  Application,
  ApplicationStage,
  Certificate,
  Enrollment,
  Notification,
  ProjectItem,
  ProjectStage,
  ResumeData,
  Role,
  User,
} from "@/types";

const THEME_KEY = "unified-mentor-theme";

export interface AtsResult {
  total: number;
  breakdown: { label: string; score: number }[];
  strengths: string[];
  improvements: string[];
  fileName: string;
}

export interface CareerPlan {
  role: string;
  match: number;
  summary: string;
  skillsToLearn: string[];
  programSlugs: string[];
  projects: string[];
  internshipIds: string[];
  jobIds: string[];
}

export interface Booking {
  id: string;
  mentorId: string;
  mentorName: string;
  slot: string;
  topic: string;
  status: string;
  createdAt: string;
}

export type SavedKind = "program" | "course" | "job" | "internship";

interface AppData {
  enrollments: Enrollment[];
  enrolledCourses: string[];
  /** completed lesson ids per standalone course id */
  courseLessonsDone: Record<string, string[]>;
  /** 0-100 progress per standalone course id */
  courseProgress: Record<string, number>;
  saved: { kind: SavedKind; id: string }[];
  applications: Application[];
  projects: ProjectItem[];
  certificates: Certificate[];
  notifications: Notification[];
  bookings: Booking[];
  resume: ResumeData;
  /** true when the learner has actually saved a resume */
  hasResume: boolean;
  ats: AtsResult | null;
  careerPlan: CareerPlan | null;
}

const emptyData: AppData = {
  enrollments: [],
  enrolledCourses: [],
  courseLessonsDone: {},
  courseProgress: {},
  saved: [],
  applications: [],
  projects: [],
  certificates: [],
  notifications: [],
  bookings: [],
  resume: emptyResume,
  hasResume: false,
  ats: null,
  careerPlan: null,
};

export interface AuthResult {
  ok: boolean;
  message?: string;
}

interface AppContextValue extends AppData {
  user: User | null;
  theme: "light" | "dark";
  hydrated: boolean;
  loading: boolean;
  savedJobs: string[];
  savedPrograms: string[];
  savedCourses: string[];
  savedInternships: string[];
  unreadCount: number;
  // auth
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (name: string, email: string, password: string, role: Role) => Promise<AuthResult>;
  signInWithGoogle: (redirectPath?: string) => Promise<AuthResult>;
  sendPasswordReset: (email: string) => Promise<AuthResult>;
  updatePassword: (password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  updateUser: (patch: Partial<User>) => Promise<void>;
  toggleTheme: () => void;
  refresh: () => Promise<void>;
  // learning
  enroll: (programId: string) => Promise<void>;
  enrollCourse: (courseId: string, title: string) => Promise<void>;
  isCourseEnrolled: (courseId: string) => boolean;
  completeCourseLesson: (courseId: string, lessonId: string, lessonTitle: string) => Promise<void>;
  isCourseLessonComplete: (courseId: string, lessonId: string) => boolean;
  courseProgressOf: (courseId: string) => number;
  isEnrolled: (programId: string) => boolean;
  completeLesson: (programId: string, lessonId: string, lessonTitle: string) => Promise<void>;
  isLessonComplete: (programId: string, lessonId: string) => boolean;
  updateProgress: (programId: string, progress: number, currentLesson?: string) => Promise<void>;
  // saving
  toggleSave: (kind: SavedKind, id: string) => Promise<void>;
  isSaved: (kind: SavedKind, id: string) => boolean;
  toggleSaveJob: (jobId: string) => Promise<void>;
  // applications
  applyTo: (payload: Omit<Application, "id" | "stage" | "appliedOn">) => Promise<void>;
  advanceApplication: (id: string) => Promise<void>;
  setApplicationStage: (id: string, stage: ApplicationStage) => Promise<void>;
  hasApplied: (kind: "job" | "internship", refId: string) => boolean;
  // notifications
  markNotificationRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  pushNotification: (n: Omit<Notification, "id" | "time" | "read">) => Promise<void>;
  // career tools
  setResume: (updater: (prev: ResumeData) => ResumeData) => void;
  saveResume: () => Promise<void>;
  setAts: (result: AtsResult) => Promise<void>;
  setCareerPlan: (plan: CareerPlan) => Promise<void>;
  // projects / mentorship
  updateProject: (id: string, patch: Partial<ProjectItem>) => Promise<void>;
  bookSession: (mentorId: string, mentorName: string, slot: string, topic: string) => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return days === 1 ? "Yesterday" : `${days} days ago`;
}

export function lessonKey(moduleIndex: number, itemIndex: number) {
  return `m${moduleIndex}-l${itemIndex}`;
}

/** Namespaced key so standalone-course progress never collides with programs. */
export function courseProgressKey(courseId: string) {
  return `course:${courseId}`;
}

export function courseLessons(courseId: string) {
  const course = getCourse(courseId);
  if (!course) return [] as { id: string; title: string; module: string; index: number }[];
  return course.modules.flatMap((mod, mi) =>
    mod.lessons.map((title, ii) => ({
      id: lessonKey(mi, ii),
      title,
      module: mod.title,
      index: mi,
    })),
  );
}

export function programLessons(programId: string) {
  const program = programs.find((p) => p.id === programId || p.slug === programId);
  if (!program) return [] as { id: string; title: string; module: string; type: string }[];
  return program.curriculum.flatMap((mod, mi) =>
    mod.items.map((item, ii) => ({
      id: lessonKey(mi, ii),
      title: item.title,
      module: mod.title,
      type: item.type,
    })),
  );
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<AppData>(emptyData);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(true);
  const userIdRef = useRef<string | null>(null);

  /* ---------------- theme ---------------- */
  useEffect(() => {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") setTheme(stored);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(THEME_KEY, theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme, hydrated]);

  /* ---------------- data loading ---------------- */
  const loadAll = useCallback(
    async (
      uid: string,
      authUser?: { email?: string | undefined; metaName?: string | undefined },
    ) => {
      const [
        profileRes,
        rolesRes,
        enrollRes,
        lessonRes,
        courseRes,
        savedRes,
        appRes,
        projRes,
        certRes,
        resumeRes,
        notifRes,
        bookRes,
        artifactRes,
      ] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", uid).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", uid),
        supabase.from("enrollments").select("*").eq("user_id", uid).order("enrolled_at"),
        supabase.from("lesson_progress").select("*").eq("user_id", uid),
        supabase.from("course_enrollments").select("*").eq("user_id", uid),
        supabase.from("saved_items").select("*").eq("user_id", uid),
        supabase
          .from("applications")
          .select("*")
          .eq("user_id", uid)
          .order("applied_at", { ascending: false }),
        supabase.from("user_projects").select("*").eq("user_id", uid).order("created_at"),
        supabase
          .from("certificates")
          .select("*")
          .eq("user_id", uid)
          .order("issued_on", { ascending: false }),
        supabase.from("resumes").select("*").eq("user_id", uid).maybeSingle(),
        supabase
          .from("notifications")
          .select("*")
          .eq("user_id", uid)
          .order("created_at", { ascending: false }),
        supabase
          .from("mentorship_bookings")
          .select("*")
          .eq("user_id", uid)
          .order("created_at", { ascending: false }),
        supabase.from("career_artifacts").select("*").eq("user_id", uid),
      ]);

      let profile = profileRes.data;
      if (!profile) {
        // brand-new account (or trigger still catching up) — make sure a profile exists
        const fallbackEmail = authUser?.email ?? "";
        const fallbackName = authUser?.metaName || fallbackEmail.split("@")[0] || "Learner";
        const { data: created } = await supabase
          .from("profiles")
          .upsert(
            {
              id: uid,
              email: fallbackEmail,
              name: fallbackName,
              avatar: fallbackName.slice(0, 2).toUpperCase(),
            },
            { onConflict: "id" },
          )
          .select()
          .maybeSingle();
        profile = created ?? null;
      }
      const role = (rolesRes.data?.[0]?.role ?? "student") as Role;
      if (!rolesRes.data?.length) {
        await supabase
          .from("user_roles")
          .upsert({ user_id: uid, role }, { onConflict: "user_id,role" });
      }
      const lessonsByProgram = new Map<string, string[]>();
      const courseLessonsDone: Record<string, string[]> = {};
      for (const row of lessonRes.data ?? []) {
        if (row.program_id.startsWith("course:")) {
          const key = row.program_id.slice("course:".length);
          courseLessonsDone[key] = [...(courseLessonsDone[key] ?? []), row.lesson_id];
          continue;
        }
        const list = lessonsByProgram.get(row.program_id) ?? [];
        list.push(row.lesson_id);
        lessonsByProgram.set(row.program_id, list);
      }
      const courseProgress: Record<string, number> = {};
      for (const row of courseRes.data ?? []) courseProgress[row.course_id] = row.progress ?? 0;

      if (profile) {
        setUser({
          id: profile.id,
          name: profile.name || profile.email.split("@")[0]!,
          email: profile.email,
          role,
          headline: profile.headline,
          about: profile.about || profile.bio,
          avatar: profile.avatar || profile.name.slice(0, 2).toUpperCase(),
          location: profile.location,
          phone: profile.phone ?? "",
          dateOfBirth: profile.date_of_birth ?? "",
          address: profile.address ?? "",
          skills: profile.skills ?? [],
          education: (profile.education as User["education"]) ?? [],
          experience: (profile.experience as unknown as User["experience"]) ?? [],
          links: (profile.links as User["links"]) ?? [],
          profileCompletion: profile.profile_completion,
          resumeScore: profile.resume_score,
        });
      }

      const ats = artifactRes.data?.find((a) => a.kind === "ats")?.data as AtsResult | undefined;
      const plan = artifactRes.data?.find((a) => a.kind === "career_plan")?.data as
        CareerPlan | undefined;

      setData({
        enrollments: (enrollRes.data ?? []).map((e) => ({
          programId: e.program_id,
          progress: e.progress,
          completedLessons: lessonsByProgram.get(e.program_id) ?? [],
          currentLesson: e.current_lesson,
          enrolledOn: e.enrolled_at.slice(0, 10),
        })),
        enrolledCourses: (courseRes.data ?? []).map((c) => c.course_id),
        courseLessonsDone,
        courseProgress,
        saved: (savedRes.data ?? []).map((s) => ({
          kind: s.item_type as SavedKind,
          id: s.item_id,
        })),
        applications: (appRes.data ?? []).map((a) => ({
          id: a.id,
          kind: a.kind as "job" | "internship",
          refId: a.ref_id,
          title: a.title,
          company: a.company,
          stage: a.stage as ApplicationStage,
          appliedOn: a.applied_at.slice(0, 10),
          resumeName: a.resume_name,
          ...(a.note ? { note: a.note } : {}),
        })),
        projects: (projRes.data ?? []).map((p) => ({
          id: p.id,
          title: p.title,
          program: p.program,
          stage: p.stage as ProjectStage,
          progress: p.progress,
          dueDate: p.due_date,
          stack: p.stack ?? [],
          summary: p.summary,
          ...(p.repo_url ? { repoUrl: p.repo_url } : {}),
          ...(p.demo_url ? { demoUrl: p.demo_url } : {}),
        })),
        certificates: (certRes.data ?? []).map((c) => ({
          id: c.id,
          title: c.title,
          issuedOn: c.issued_on.slice(0, 10),
          code: c.code,
          skills: c.skills ?? [],
          grade: c.grade,
        })),
        notifications: (notifRes.data ?? []).map((n) => ({
          id: n.id,
          icon: n.icon,
          title: n.title,
          body: n.body,
          time: relativeTime(n.created_at),
          read: n.read,
          ...(n.href ? { href: n.href } : {}),
        })),
        bookings: (bookRes.data ?? []).map((b) => ({
          id: b.id,
          mentorId: b.mentor_id,
          mentorName: b.mentor_name,
          slot: b.slot,
          topic: b.topic,
          status: b.status,
          createdAt: b.created_at,
        })),
        resume: (resumeRes.data?.data as ResumeData | undefined) ?? {
          ...emptyResume,
          personal: {
            ...emptyResume.personal,
            name: profile?.name ?? "",
            title: profile?.headline ?? "",
            email: profile?.email ?? "",
            phone: profile?.phone ?? "",
            location: profile?.location ?? "",
            summary: profile?.about ?? "",
          },
          skills: profile?.skills ?? [],
          experience: ((profile?.experience as unknown as ResumeData["experience"]) ?? []).map(
            (e) => ({
              company: e.company,
              title: e.title,
              period: e.period,
              summary: e.summary,
            }),
          ),
        },
        hasResume: Boolean(resumeRes.data),
        ats: ats ?? null,
        careerPlan: plan ?? null,
      });
    },
    [],
  );

  useEffect(() => {
    let active = true;

    const applySession = async (
      uid: string | null,
      authUser?: { email?: string | undefined; metaName?: string | undefined },
    ) => {
      userIdRef.current = uid;
      if (!uid) {
        setUser(null);
        setData(emptyData);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        await loadAll(uid, authUser);
      } finally {
        if (active) setLoading(false);
      }
    };

    supabase.auth.getSession().then(({ data: s }) => {
      if (active)
        void applySession(s.session?.user.id ?? null, {
          email: s.session?.user.email,
          metaName: s.session?.user.user_metadata?.["name"] as string | undefined,
        });
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (event === "TOKEN_REFRESHED") return;
      const uid = session?.user.id ?? null;
      if (uid === userIdRef.current && event !== "SIGNED_IN") return;
      void applySession(uid, {
        email: session?.user.email,
        metaName: session?.user.user_metadata?.["name"] as string | undefined,
      });
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [loadAll]);

  const refresh = useCallback(async () => {
    if (userIdRef.current) await loadAll(userIdRef.current);
  }, [loadAll]);

  const uid = () => userIdRef.current;

  const insertNotification = useCallback(
    async (n: { icon: string; title: string; body: string; href?: string | undefined }) => {
      const id = uid();
      if (!id) return;
      const { data: row } = await supabase
        .from("notifications")
        .insert({ user_id: id, icon: n.icon, title: n.title, body: n.body, href: n.href ?? null })
        .select()
        .single();
      if (row) {
        setData((d) => ({
          ...d,
          notifications: [
            {
              id: row.id,
              icon: row.icon,
              title: row.title,
              body: row.body,
              time: "Just now",
              read: false,
              ...(row.href ? { href: row.href } : {}),
            },
            ...d.notifications,
          ],
        }));
      }
    },
    [],
  );

  const toggleSaveFn = useCallback(async (kind: SavedKind, itemId: string) => {
    const id = userIdRef.current;
    if (!id) {
      toast.error("Sign in to save items", { description: "Create a free account to bookmark." });
      return;
    }
    let exists = false;
    setData((d) => {
      exists = d.saved.some((s) => s.kind === kind && s.id === itemId);
      return exists
        ? { ...d, saved: d.saved.filter((s) => !(s.kind === kind && s.id === itemId)) }
        : { ...d, saved: [...d.saved, { kind, id: itemId }] };
    });
    if (exists) {
      await supabase
        .from("saved_items")
        .delete()
        .eq("user_id", id)
        .eq("item_type", kind)
        .eq("item_id", itemId);
    } else {
      await supabase.from("saved_items").insert({ user_id: id, item_type: kind, item_id: itemId });
    }
  }, []);

  const value = useMemo<AppContextValue>(() => {
    const unreadCount = data.notifications.filter((n) => !n.read).length;
    const savedOf = (kind: SavedKind) => data.saved.filter((s) => s.kind === kind).map((s) => s.id);

    const issueCertificateIfComplete = async (programId: string, completed: number) => {
      const program = programs.find((p) => p.id === programId);
      if (!program) return;
      const total = programLessons(programId).length;
      if (!total || completed < total) return;
      if (data.certificates.some((c) => c.title === program.title)) return;
      const id = uid();
      if (!id) return;
      const code = `UM-${program.slug.slice(0, 4).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
      const { data: row } = await supabase
        .from("certificates")
        .insert({
          user_id: id,
          program_id: programId,
          title: program.title,
          code,
          grade: "Distinction",
          skills: program.skills,
        })
        .select()
        .single();
      if (row) {
        setData((d) => ({
          ...d,
          certificates: [
            {
              id: row.id,
              title: row.title,
              issuedOn: row.issued_on.slice(0, 10),
              code: row.code,
              skills: row.skills ?? [],
              grade: row.grade,
            },
            ...d.certificates,
          ],
        }));
        await insertNotification({
          icon: "🏆",
          title: "Your certificate is ready",
          body: `${program.title} is complete — view and download your certificate.`,
          href: "/dashboard/certificates",
        });
      }
    };

    return {
      ...data,
      user,
      theme,
      hydrated,
      loading,
      unreadCount,
      savedJobs: savedOf("job"),
      savedPrograms: savedOf("program"),
      savedCourses: savedOf("course"),
      savedInternships: savedOf("internship"),

      login: async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) return { ok: false, message: error.message };
        return { ok: true };
      },
      register: async (name, email, password, role) => {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { name, role },
          },
        });
        if (error) return { ok: false, message: error.message };
        return { ok: true };
      },
      signInWithGoogle: async (redirectPath) => {
        try {
          if (redirectPath) sessionStorage.setItem("um-post-auth", redirectPath);
          const { lovable } = await import("@/integrations/lovable/index");
          const result = await lovable.auth.signInWithOAuth("google", {
            redirect_uri: window.location.origin,
          });
          if (result.error) return { ok: false, message: String(result.error) };
          return { ok: true };
        } catch (e) {
          return { ok: false, message: e instanceof Error ? e.message : "Google sign-in failed" };
        }
      },
      sendPasswordReset: async (email) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) return { ok: false, message: error.message };
        return { ok: true };
      },
      updatePassword: async (password) => {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) return { ok: false, message: error.message };
        return { ok: true };
      },
      logout: async () => {
        await supabase.auth.signOut();
        setUser(null);
        setData(emptyData);
        userIdRef.current = null;
      },
      updateUser: async (patch) => {
        const id = uid();
        if (!id || !user) return;
        const next = { ...user, ...patch };
        setUser(next);
        await supabase
          .from("profiles")
          .update({
            name: next.name,
            headline: next.headline,
            about: next.about,
            avatar: next.avatar,
            location: next.location,
            phone: next.phone,
            date_of_birth: next.dateOfBirth || null,
            address: next.address,
            skills: next.skills,
            education: next.education,
            experience: next.experience as unknown as never,
            links: next.links,
            profile_completion: next.profileCompletion,
            resume_score: next.resumeScore,
          })
          .eq("id", id);
      },
      toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
      refresh,

      enroll: async (programId) => {
        const id = uid();
        if (!id) return;
        if (data.enrollments.some((e) => e.programId === programId)) return;
        const program = programs.find((p) => p.id === programId);
        const first = programLessons(programId)[0];
        const currentLesson = first ? `${first.module} · ${first.title}` : "Getting started";
        const { data: row, error } = await supabase
          .from("enrollments")
          .insert({
            user_id: id,
            program_id: programId,
            progress: 0,
            current_lesson: currentLesson,
          })
          .select()
          .single();
        if (error || !row) {
          toast.error("Could not enroll", { description: error?.message });
          return;
        }
        // materialise the program's projects for this learner
        if (program) {
          const projectItems = program.curriculum.flatMap((mod) =>
            mod.items
              .filter((i) => i.type === "project")
              .map((i) => ({ mod: mod.title, title: i.title })),
          );
          if (projectItems.length) {
            await supabase.from("user_projects").upsert(
              projectItems.map((p, i) => ({
                user_id: id,
                project_key: `${programId}-p${i}`,
                title: p.title,
                program: program.title,
                stage: "Assigned",
                progress: 0,
                due_date: new Date(Date.now() + (i + 2) * 7 * 86400000).toISOString().slice(0, 10),
                stack: program.technologies.slice(0, 4),
                summary: `Build and submit "${p.title}" as part of ${p.mod}.`,
              })),
              { onConflict: "user_id,project_key" },
            );
          }
        }
        await insertNotification({
          icon: "🎉",
          title: "Enrollment confirmed",
          body: `You're in: ${program?.title ?? "New program"}. Module 1 is unlocked.`,
          href: `/learning/${programId}`,
        });
        await refresh();
      },
      enrollCourse: async (courseId, title) => {
        const id = uid();
        if (!id) return;
        if (data.enrolledCourses.includes(courseId)) return;
        const { error } = await supabase
          .from("course_enrollments")
          .insert({ user_id: id, course_id: courseId, title });
        if (error) {
          toast.error("Could not enroll", { description: error.message });
          return;
        }
        setData((d) => ({ ...d, enrolledCourses: [...d.enrolledCourses, courseId] }));
        await insertNotification({
          icon: "🎓",
          title: "Course unlocked",
          body: `${title} is now in My Learning.`,
          href: "/dashboard/learning",
        });
      },
      isCourseEnrolled: (courseId) => data.enrolledCourses.includes(courseId),
      isCourseLessonComplete: (courseId, lessonId) =>
        (data.courseLessonsDone[courseId] ?? []).includes(lessonId),
      courseProgressOf: (courseId) => {
        const total = courseLessons(courseId).length || 1;
        const done = (data.courseLessonsDone[courseId] ?? []).length;
        return Math.round((done / total) * 100);
      },
      completeCourseLesson: async (courseId, lessonId, lessonTitle) => {
        const id = uid();
        if (!id) return;
        const course = getCourse(courseId);
        if (!course || !data.enrolledCourses.includes(courseId)) return;
        const done = data.courseLessonsDone[courseId] ?? [];
        if (done.includes(lessonId)) return;
        const { error } = await supabase
          .from("lesson_progress")
          .insert({ user_id: id, program_id: courseProgressKey(courseId), lesson_id: lessonId });
        if (error) {
          toast.error("Could not save progress", { description: error.message });
          return;
        }
        const total = courseLessons(courseId).length || 1;
        const completed = done.length + 1;
        const progress = Math.round((completed / total) * 100);
        await supabase
          .from("course_enrollments")
          .update({ progress })
          .eq("user_id", id)
          .eq("course_id", courseId);
        setData((d) => ({
          ...d,
          courseLessonsDone: { ...d.courseLessonsDone, [courseId]: [...done, lessonId] },
          courseProgress: { ...d.courseProgress, [courseId]: progress },
        }));
        if (completed >= total && course.certificate) {
          if (!data.certificates.some((c) => c.title === course.title)) {
            const code = `UM-${courseId.slice(0, 4).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
            const { data: row } = await supabase
              .from("certificates")
              .insert({
                user_id: id,
                program_id: courseProgressKey(courseId),
                title: course.title,
                code,
                grade: "Distinction",
                skills: course.skills,
              })
              .select()
              .single();
            if (row) {
              setData((d) => ({
                ...d,
                certificates: [
                  {
                    id: row.id,
                    title: row.title,
                    issuedOn: row.issued_on.slice(0, 10),
                    code: row.code,
                    skills: row.skills ?? [],
                    grade: row.grade,
                  },
                  ...d.certificates,
                ],
              }));
              await insertNotification({
                icon: "🏆",
                title: "Course certificate ready",
                body: `${course.title} is complete — view and download your certificate.`,
                href: "/dashboard/certificates",
              });
            }
          }
        } else {
          void lessonTitle;
        }
      },
      isEnrolled: (programId) => data.enrollments.some((e) => e.programId === programId),
      isLessonComplete: (programId, lessonId) =>
        data.enrollments
          .find((e) => e.programId === programId)
          ?.completedLessons.includes(lessonId) ?? false,
      completeLesson: async (programId, lessonId, lessonTitle) => {
        const id = uid();
        if (!id) return;
        const enrollment = data.enrollments.find((e) => e.programId === programId);
        if (!enrollment || enrollment.completedLessons.includes(lessonId)) return;
        const { error } = await supabase
          .from("lesson_progress")
          .insert({ user_id: id, program_id: programId, lesson_id: lessonId });
        if (error) {
          toast.error("Could not save progress", { description: error.message });
          return;
        }
        const total = programLessons(programId).length || 1;
        const completed = enrollment.completedLessons.length + 1;
        const progress = Math.round((completed / total) * 100);
        await supabase
          .from("enrollments")
          .update({ progress, current_lesson: lessonTitle })
          .eq("user_id", id)
          .eq("program_id", programId);
        setData((d) => ({
          ...d,
          enrollments: d.enrollments.map((e) =>
            e.programId === programId
              ? {
                  ...e,
                  progress,
                  currentLesson: lessonTitle,
                  completedLessons: [...e.completedLessons, lessonId],
                }
              : e,
          ),
        }));
        await issueCertificateIfComplete(programId, completed);
      },
      updateProgress: async (programId, progress, currentLesson) => {
        const id = uid();
        if (!id) return;
        await supabase
          .from("enrollments")
          .update({
            progress: Math.min(100, progress),
            ...(currentLesson ? { current_lesson: currentLesson } : {}),
          })
          .eq("user_id", id)
          .eq("program_id", programId);
        setData((d) => ({
          ...d,
          enrollments: d.enrollments.map((e) =>
            e.programId === programId
              ? {
                  ...e,
                  progress: Math.min(100, progress),
                  currentLesson: currentLesson ?? e.currentLesson,
                }
              : e,
          ),
        }));
      },

      isSaved: (kind, itemId) => data.saved.some((s) => s.kind === kind && s.id === itemId),
      toggleSave: toggleSaveFn,
      toggleSaveJob: async (jobId) => {
        await toggleSaveFn("job", jobId);
      },
      hasApplied: (kind, refId) =>
        data.applications.some((a) => a.kind === kind && a.refId === refId),
      applyTo: async (payload) => {
        const id = uid();
        if (!id) {
          toast.error("Sign in to apply", {
            description: "Create a free account to track applications.",
          });
          return;
        }
        const { data: row, error } = await supabase
          .from("applications")
          .insert({
            user_id: id,
            kind: payload.kind,
            ref_id: payload.refId,
            title: payload.title,
            company: payload.company,
            resume_name: payload.resumeName,
            note: payload.note ?? null,
            stage: "Applied",
          })
          .select()
          .single();
        if (error || !row) {
          toast.error("Could not submit application", { description: error?.message });
          return;
        }
        setData((d) => ({
          ...d,
          applications: [
            {
              id: row.id,
              kind: row.kind as "job" | "internship",
              refId: row.ref_id,
              title: row.title,
              company: row.company,
              stage: row.stage as ApplicationStage,
              appliedOn: row.applied_at.slice(0, 10),
              resumeName: row.resume_name,
              ...(row.note ? { note: row.note } : {}),
            },
            ...d.applications,
          ],
        }));
        await insertNotification({
          icon: "📨",
          title: "Application submitted",
          body: `${payload.title} at ${payload.company} — track it in your application tracker.`,
          href: "/dashboard/applications",
        });
      },
      advanceApplication: async (id) => {
        const order: ApplicationStage[] = [
          "Applied",
          "Under Review",
          "Shortlisted",
          "Interview",
          "Selected",
        ];
        const current = data.applications.find((a) => a.id === id);
        if (!current) return;
        const idx = order.indexOf(current.stage);
        if (idx === -1 || idx === order.length - 1) return;
        const stage = order[idx + 1]!;
        await supabase.from("applications").update({ stage }).eq("id", id);
        setData((d) => ({
          ...d,
          applications: d.applications.map((a) => (a.id === id ? { ...a, stage } : a)),
        }));
        await insertNotification({
          icon: "📈",
          title: "Application status changed",
          body: `${current.title} at ${current.company} is now "${stage}".`,
          href: "/dashboard/applications",
        });
      },
      setApplicationStage: async (id, stage) => {
        await supabase.from("applications").update({ stage }).eq("id", id);
        setData((d) => ({
          ...d,
          applications: d.applications.map((a) => (a.id === id ? { ...a, stage } : a)),
        }));
      },

      markNotificationRead: async (id) => {
        await supabase.from("notifications").update({ read: true }).eq("id", id);
        setData((d) => ({
          ...d,
          notifications: d.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        }));
      },
      markAllRead: async () => {
        const id = uid();
        if (!id) return;
        await supabase
          .from("notifications")
          .update({ read: true })
          .eq("user_id", id)
          .eq("read", false);
        setData((d) => ({
          ...d,
          notifications: d.notifications.map((n) => ({ ...n, read: true })),
        }));
      },
      pushNotification: async (n) => {
        await insertNotification({
          icon: n.icon,
          title: n.title,
          body: n.body,
          ...(n.href ? { href: n.href } : {}),
        });
      },

      setResume: (updater) => setData((d) => ({ ...d, resume: updater(d.resume) })),
      saveResume: async () => {
        const id = uid();
        if (!id) {
          toast.error("Sign in to save your resume");
          return;
        }
        const { error } = await supabase
          .from("resumes")
          .upsert(
            { user_id: id, data: data.resume as unknown as never },
            { onConflict: "user_id" },
          );
        if (error) toast.error("Could not save resume", { description: error.message });
        else {
          setData((d) => ({ ...d, hasResume: true }));
          toast.success("Resume saved", { description: "Your resume is stored on your account." });
        }
      },

      setAts: async (result) => {
        setData((d) => ({ ...d, ats: result }));
        const id = uid();
        if (!id) return;
        await supabase.from("career_artifacts").upsert(
          {
            user_id: id,
            kind: "ats",
            data: result as unknown as never,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,kind" },
        );
        if (user) {
          setUser({ ...user, resumeScore: result.total });
          await supabase.from("profiles").update({ resume_score: result.total }).eq("id", id);
        }
      },
      setCareerPlan: async (plan) => {
        setData((d) => ({ ...d, careerPlan: plan }));
        const id = uid();
        if (!id) return;
        await supabase.from("career_artifacts").upsert(
          {
            user_id: id,
            kind: "career_plan",
            data: plan as unknown as never,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,kind" },
        );
      },

      updateProject: async (id, patch) => {
        await supabase
          .from("user_projects")
          .update({
            ...(patch.stage ? { stage: patch.stage } : {}),
            ...(patch.progress !== undefined ? { progress: patch.progress } : {}),
            ...(patch.repoUrl !== undefined ? { repo_url: patch.repoUrl } : {}),
            ...(patch.demoUrl !== undefined ? { demo_url: patch.demoUrl } : {}),
            ...(patch.summary !== undefined ? { summary: patch.summary } : {}),
          })
          .eq("id", id);
        setData((d) => ({
          ...d,
          projects: d.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        }));
      },
      bookSession: async (mentorId, mentorName, slot, topic) => {
        const id = uid();
        if (!id) {
          toast.error("Sign in to book a session");
          return;
        }
        const { data: row, error } = await supabase
          .from("mentorship_bookings")
          .insert({ user_id: id, mentor_id: mentorId, mentor_name: mentorName, slot, topic })
          .select()
          .single();
        if (error || !row) {
          toast.error("Could not book session", { description: error?.message });
          return;
        }
        setData((d) => ({
          ...d,
          bookings: [
            {
              id: row.id,
              mentorId: row.mentor_id,
              mentorName: row.mentor_name,
              slot: row.slot,
              topic: row.topic,
              status: row.status,
              createdAt: row.created_at,
            },
            ...d.bookings,
          ],
        }));
        await insertNotification({
          icon: "🗓️",
          title: "Mentorship session requested",
          body: `${mentorName} — ${slot}. You'll get a confirmation shortly.`,
          href: "/dashboard/mentorship",
        });
      },
    } as AppContextValue;
  }, [data, user, theme, hydrated, loading, refresh, insertNotification, toggleSaveFn]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

export function notify(message: string, description?: string) {
  toast.success(message, { description });
}
