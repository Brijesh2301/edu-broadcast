# EduBroadcast

A Content Broadcasting System for educational environments where teachers
upload content, principals approve it, and students view live broadcasts
on a public channel page.

## Tech Stack

| Library          | Version | Purpose                       |
| ---------------- | ------- | ----------------------------- |
| React            | 19      | UI framework                  |
| React Router DOM | 7       | Client-side routing           |
| Tailwind CSS     | 3       | Utility-first styling         |
| shadcn/ui        | latest  | Accessible UI primitives      |
| Radix UI         | latest  | Dialog/AlertDialog primitives |
| Redux Toolkit    | 2       | UI state slice                |
| React Hook Form  | 7       | Performant form management    |
| Zod              | 3       | Schema-based validation       |
| TanStack Query   | 5       | Server state + caching        |
| Axios            | 1       | HTTP client (service layer)   |
| Lucide React     | latest  | Icon library                  |
| Sonner           | 1       | Toast notifications           |

> **Notes on pinned versions:** Tailwind is pinned to v3 instead of v4
> because v4 requires a different PostCSS toolchain
> (`@tailwindcss/postcss` package). React Hook Form is pinned to v7
> because v8 is alpha-only on npm at the time of writing. The APIs used
> in this codebase work identically across both pairs of versions.

## Features

### Core Features

- **Role-based authentication** — Principal and Teacher roles with separate
  dashboards and route enforcement.
- **Teacher experience** — drag-and-drop content upload, view approval
  status, rejection reasons surfaced inline, schedule broadcasts with
  start/end times.
- **Principal experience** — approve or reject submissions inline (with
  per-row loading), filter and search the full content library, paginate
  through all content.
- **Public live page** — `/live/:teacherId` shows the currently active
  broadcast with no authentication required.
- **30-second auto-refresh** on the live page with a "last updated Xs ago"
  countdown that resets on every successful refetch.

### Bonus Features

- **Dark mode** across every page (`<html class="dark">`, persisted to
  localStorage).
- **Drag-and-drop file upload** using native HTML5 drag events (no
  external library).
- **Skeleton loaders** mimicking the actual content shape on every page
  during loading.
- **Pagination** (10 items per page) on the All Content page, with
  ellipsis logic for large page counts.
- **Polling** with a live countdown timer on the broadcast page.
- **Protected routes** with role-based redirects.
- **17 reusable UI components** in `src/components/common/`.
- **shadcn-style primitives** (`card`, `table`, `dialog`, `alert-dialog`,
  `select`, `skeleton`) wrapping Radix where appropriate.

## Project Structure

```
src/
├── components/
│   ├── common/        # 17 reusable components
│   ├── teacher/       # ContentCard, MyContentTable, UploadFormFields
│   ├── principal/     # ApprovalCard, RejectionModal, ContentFilters,
│   │                  # PendingRowActions
│   └── ui/            # shadcn primitives (card, table, dialog,
│                      #   alert-dialog, select, skeleton)
├── pages/
│   ├── auth/          # LoginPage
│   ├── teacher/       # TeacherDashboard, UploadContent, MyContent
│   ├── principal/     # PrincipalDashboard, PendingApprovals, AllContent
│   └── public/        # LivePage (no auth)
├── layouts/           # AuthLayout, TeacherLayout, PrincipalLayout,
│                      #   DashboardShell (shared sidebar + navbar)
├── services/          # API service layer (swap here for real backend)
├── hooks/             # useAuth, useTheme, useContent, useApproval,
│                      #   useDebounce
├── context/           # AuthContext, ThemeContext
├── store/             # Redux slice (sidebar, filters)
├── mocks/             # Mock data + simulated API
├── lib/               # cn() class merging
└── utils/             # Helpers, constants, axios, query keys, queryClient
```

## Prerequisites

- Node.js 18 or higher
- npm 9 or higher

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open http://localhost:5173
```

Other commands:

```bash
npm run build    # Production build
npm run preview  # Preview production build
```

## Demo Credentials

| Role      | Email                | Password    |
| --------- | -------------------- | ----------- |
| Principal | principal@school.com | password123 |
| Teacher 1 | teacher1@school.com  | password123 |
| Teacher 2 | teacher2@school.com  | password123 |

The login page shows a clickable demo-credentials table that auto-fills
the form.

## Public Live Page

No login required:

- http://localhost:5173/live/t1 — Teacher Smith's broadcast
- http://localhost:5173/live/t2 — Teacher Johnson's broadcast

The seed data ensures at least one approved item is currently live for
each teacher when you first launch the app.

## Routes

| Path                       | Auth      | Purpose                                    |
| -------------------------- | --------- | ------------------------------------------ |
| `/login`                   | none      | Sign in                                    |
| `/live/:teacherId`         | none      | Public broadcast view, polls every 30s     |
| `/teacher/dashboard`       | teacher   | Stats + recent uploads                     |
| `/teacher/upload`          | teacher   | Drag-drop upload form with validation      |
| `/teacher/my-content`      | teacher   | Grid of all teacher's content              |
| `/principal/dashboard`     | principal | School-wide stats + pending table          |
| `/principal/pending`       | principal | Approval queue cards with image preview    |
| `/principal/all-content`   | principal | Full library, search/filter/pagination     |

## Replacing Mock API with Real Backend

Only **3 files** need to change. Everything else — hooks, components,
contexts, layouts, pages — stays identical.

### `src/services/auth.service.js`

```js
import axiosInstance from '@/utils/axiosInstance';

export const authService = {
  login: (credentials) =>
    axiosInstance.post('/auth/login', credentials).then((r) => r.data),
  logout: () => axiosInstance.post('/auth/logout'),
};
```

### `src/services/content.service.js`

```js
import axiosInstance from '@/utils/axiosInstance';

export const contentService = {
  getAll: () => axiosInstance.get('/contents').then((r) => r.data),
  getByTeacher: (id) =>
    axiosInstance.get(`/contents?teacherId=${id}`).then((r) => r.data),
  getLive: (id) =>
    axiosInstance.get(`/contents/live/${id}`).then((r) => r.data),
  upload: (payload) =>
    axiosInstance.post('/contents', payload).then((r) => r.data),
};
```

### `src/services/approval.service.js`

```js
import axiosInstance from '@/utils/axiosInstance';

export const approvalService = {
  approve: (id) =>
    axiosInstance.patch(`/contents/${id}/approve`).then((r) => r.data),
  reject: (id, reason) =>
    axiosInstance
      .patch(`/contents/${id}/reject`, { reason })
      .then((r) => r.data),
};
```

The axios instance at `src/utils/axiosInstance.js` already handles
attaching the bearer token from localStorage and clearing it on a 401
response.

## Live Demo

_Add deployment link after deploying to Vercel/Netlify._

## Documentation

For deeper architectural notes — auth flow, state-management layering,
the three-layer service approach, and the assumptions made — see
[`Frontend-notes.txt`](./Frontend-notes.txt).
