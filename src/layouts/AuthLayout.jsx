import { Outlet } from 'react-router-dom';
import { RadioTower } from 'lucide-react'; // BroadcastTower equivalent in lucide-react
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

const AuthLayout = () => (
  <div className="relative min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
    <div className="fixed top-4 right-4 z-10">
      <ThemeToggle />
    </div>

    <div className="w-full max-w-md">
      {/* App branding at very top of center column */}
      <div className="flex flex-col items-center mb-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30">
            <RadioTower className="h-6 w-6" aria-hidden="true" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-blue-700 dark:text-blue-400">
            EduBroadcast
          </span>
        </div>
      </div>

      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </div>
  </div>
);

export default AuthLayout;
