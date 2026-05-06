import { lazy, Suspense } from 'react';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';

import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

import AuthLayout from '@/layouts/AuthLayout';
import TeacherLayout from '@/layouts/TeacherLayout';
import PrincipalLayout from '@/layouts/PrincipalLayout';

// Lazy-loaded pages
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const TeacherDashboard = lazy(() =>
  import('@/pages/teacher/TeacherDashboard')
);
const UploadContent = lazy(() => import('@/pages/teacher/UploadContent'));
const MyContent = lazy(() => import('@/pages/teacher/MyContent'));
const PrincipalDashboard = lazy(() =>
  import('@/pages/principal/PrincipalDashboard')
);
const PendingApprovals = lazy(() =>
  import('@/pages/principal/PendingApprovals')
);
const AllContent = lazy(() => import('@/pages/principal/AllContent'));
const LivePage = lazy(() => import('@/pages/public/LivePage'));

const withSuspense = (node) => (
  <Suspense fallback={<LoadingSpinner fullscreen size="lg" />}>{node}</Suspense>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    element: <AuthLayout />,
    children: [{ path: '/login', element: withSuspense(<LoginPage />) }],
  },
  {
    path: '/live/:teacherId',
    element: withSuspense(<LivePage />),
  },
  {
    path: '/teacher',
    element: <ProtectedRoute allowedRoles={['teacher']} />,
    children: [
      {
        element: <TeacherLayout />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: 'dashboard', element: withSuspense(<TeacherDashboard />) },
          { path: 'upload', element: withSuspense(<UploadContent />) },
          { path: 'my-content', element: withSuspense(<MyContent />) },
        ],
      },
    ],
  },
  {
    path: '/principal',
    element: <ProtectedRoute allowedRoles={['principal']} />,
    children: [
      {
        element: <PrincipalLayout />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          {
            path: 'dashboard',
            element: withSuspense(<PrincipalDashboard />),
          },
          { path: 'pending', element: withSuspense(<PendingApprovals />) },
          { path: 'all-content', element: withSuspense(<AllContent />) },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);

const App = () => (
  <ErrorBoundary>
    <RouterProvider router={router} />
  </ErrorBoundary>
);

export default App;
