# Unified Mentor — Learn. Build. Get Hired.

A modern, premium redesign concept of a learning + internship + hiring platform.
Fully functional front-end prototype: TanStack Start (React 19 + Vite 7), Tailwind v4
design system, Framer Motion, shadcn-style UI, four role workspaces, and career tools
(ATS checker, resume builder, career-path finder, job-match engine).

State is persisted in `localStorage` behind a single provider (`src/lib/store.tsx`), so the
whole product is explorable without a backend. Every data access already flows through one
store + typed data modules, which is the seam where a real API would be swapped in.

## 1. Folder structure

```text
src/
  components/
    common/        motion primitives, counters, progress bars, section headers
    home/          HeroPreview (animated dashboard mock)
    layout/        SiteHeader, SiteFooter, PublicShell, DashboardShell, dashboard-nav
    cards/         ProgramCard, JobCard, MentorCard, etc.
    ui/            shadcn-style primitives (button, input, dialog, command, ...)
    CommandPalette.tsx
  data/            programs, opportunities (jobs/internships/projects/certificates), mentors, users
  lib/
    store.tsx      AppProvider + useApp (auth, enrollments, applications, resume, notifications)
    insights.ts    ATS scoring, job matching, career-plan builder, readiness scoring
    format.ts      currency/date/compact formatters
    utils.ts       cn()
  routes/
    __root.tsx                 providers, head metadata, fonts, toaster, error/404 boundaries
    index.tsx                  landing page
    auth.tsx                   sign in / register (+ one-click demo accounts)
    programs.tsx, programs.$slug.tsx, courses.tsx, internships.tsx
    jobs.tsx, jobs.$jobId.tsx, mentors.tsx, resources.tsx, verify.tsx
    career-tools.index.tsx | .ats-checker | .resume-builder | .career-path | .job-match
    dashboard.index.tsx | .learning | .projects | .applications | .mentorship
                        | .certificates | .profile      (student workspace)
    admin.tsx                  admin analytics + catalog
    mentor.tsx                 review queue, sessions, mentees
    recruiter.tsx              candidate search, shortlist, pipeline, open roles
  styles.css       design tokens (oklch), gradients, shadows, utilities
```

## 2. Setup instructions

```bash
bun install       # or npm install
bun run dev       # http://localhost:8080
bun run build     # production build
```

## 3. Environment variables

None are required for the prototype. When a backend is added:

```env
# server-only (read inside createServerFn handlers)
MONGODB_URI=...
JWT_SECRET=...
SESSION_SECRET=...
CLOUDINARY_URL=...          # resume/avatar uploads
SMTP_URL=...                # transactional email
# client-visible
VITE_APP_NAME=Unified Mentor
```

## 4. Database setup (for the production version)

The prototype ships seeded, typed collections in `src/data/*` that map 1:1 to collections:

| Collection      | Key fields |
| --------------- | ---------- |
| `users`         | name, email, passwordHash, role, headline, skills, education, experience, links |
| `programs`      | slug, title, level, duration, curriculum[modules[items]], outcomes, price, learners |
| `internships`   | company, role, stipend, duration, skills, openings, deadline |
| `jobs`          | company, title, industry, mode, salaryMin/Max, skills, postedOn |
| `applications`  | userId, kind, refId, stage, appliedOn, resumeName, note |
| `enrollments`   | userId, programId, progress, completedLessons, currentLesson |
| `projects`      | userId, title, stage, progress, repo, demo, mentorFeedback |
| `certificates`  | userId, programId, code, issuedOn, skills |
| `mentors`       | userId, expertise, company, rating, sessions |
| `notifications` | userId, title, body, href, read, time |

Steps: create a MongoDB Atlas cluster → set `MONGODB_URI` → run a seed script that
imports `src/data/*` → add indexes on `users.email` (unique), `certificates.code` (unique),
`jobs.skills`, `applications.userId`.

## 5. Demo login credentials

| Role      | Email                          | Password       | Lands on     |
| --------- | ------------------------------ | -------------- | ------------ |
| Student   | student@unifiedmentor.com      | Student@UM2026     | `/dashboard` |
| Admin     | admin@unifiedmentor.com        | Admin@UM2026       | `/admin`     |
| Mentor    | mentor@unifiedmentor.com       | Mentor@UM2026      | `/mentor`    |
| Recruiter | recruiter@unifiedmentor.com    | Recruiter@UM2026   | `/recruiter` |

The sign-in screen also has one-click buttons for each account.

## 6. Implemented features

- Premium landing page: animated hero with live dashboard preview, stats counters, partner
  strip, ecosystem cards, career journey, featured programs, tools, success stories, CTA.
- Global navigation: mega menus, ⌘K command palette, notification centre, theme toggle,
  responsive mobile drawer.
- Catalog: programs list + detail (curriculum, outcomes, pricing, enrol), courses,
  internships, jobs list + detail with match scoring, mentors directory, resources hub.
- Certificate verification page with seeded verifiable codes.
- Auth: role-based mock auth, register with role selection, persisted session, guards.
- Student workspace: readiness overview, learning progress with lesson completion,
  project kanban (5 stages), application pipeline with stage progression, saved jobs,
  mentorship sessions and Q&A, certificates with copy/print, editable profile.
- Career tools: ATS resume checker (local scoring, breakdown, strengths/fixes),
  resume builder (4 templates, live preview, print/PDF, JSON export, autosave),
  career-path finder (6-step questionnaire → role, skills, projects, programs, jobs),
  job-match engine (skills + experience → explained ranked matches).
- Admin workspace: platform metrics, 6-month learner/placement chart, top programs, catalog table.
- Mentor workspace: review queue with feedback + approval, sessions, mentee progress.
- Recruiter workspace: candidate search by skill/role, readiness scores, shortlisting,
  hiring pipeline, open roles.
- Design system: oklch semantic tokens, gradients, elevation, glass surfaces, dark/light,
  motion primitives, full responsiveness, per-route SEO metadata, 404 + error boundaries.

## 7. Future improvements

- Real backend: MongoDB + server functions, JWT/refresh sessions, password hashing, RBAC.
- Server-side ATS parsing of real PDF/DOCX files and AI-written resume suggestions.
- Payments for paid programs, invoices, refunds.
- Video lessons with progress tracking, quizzes and auto-graded assignments.
- Live mentor scheduling with calendar sync and in-app video.
- Recruiter ATS: job posting CRUD, interview scheduling, offer workflow, candidate messaging.
- Email/push notifications, weekly digests.
- Analytics warehouse, cohort funnels, placement reporting.
- Accessibility audit, i18n, and end-to-end test suite.
