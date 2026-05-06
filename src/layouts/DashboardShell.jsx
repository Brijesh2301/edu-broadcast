import { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Menu, RadioTower, X } from 'lucide-react';

import { ThemeToggle } from '@/components/common/ThemeToggle';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { useAuth } from '@/hooks/useAuth';
import { getInitials } from '@/utils/helpers';
import { cn } from '@/lib/utils';

/**
 * Shared sidebar shell. Layouts pass in their own link config array.
 * Each link: { to, label, icon: LucideIcon, badge? (number | null) }
 */
const DashboardShell = ({ links, roleLabel, children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Lock body scroll when sidebar open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const navLinkClass = ({ isActive }) =>
    cn(
      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
      isActive
        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Backdrop (mobile only) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-64 flex flex-col',
          'bg-white dark:bg-gray-900',
          'border-r border-gray-200 dark:border-gray-700',
          'transition-transform duration-300 ease-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm shadow-blue-500/30">
              <RadioTower className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-base font-bold tracking-tight text-gray-900 dark:text-gray-50">
                EduBroadcast
              </p>
              {roleLabel && (
                <p className="text-[10px] font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {roleLabel}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 md:hidden dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 flex flex-col gap-1 px-3 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink key={link.to} to={link.to} className={navLinkClass} end>
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="flex-1 truncate">{link.label}</span>
                {typeof link.badge === 'number' && link.badge > 0 && (
                  <span
                    className="ml-auto bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 text-xs px-2 py-0.5 rounded-full font-semibold"
                    aria-label={`${link.badge} pending`}
                  >
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom: separator + logout */}
        <div className="mt-auto px-3 pb-4 pt-3">
          <div className="h-px bg-gray-200 dark:bg-gray-700 mb-3" />
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="md:ml-64 min-h-screen flex flex-col">
        {/* Navbar */}
        <header className="sticky top-0 z-30 h-16 flex items-center gap-3 px-4 sm:px-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="md:hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <p className="flex-1 truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
            EduBroadcast
          </p>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="hidden sm:flex items-center gap-2.5">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-semibold text-white"
                aria-hidden="true"
              >
                {getInitials(user?.name)}
              </div>
              <div className="leading-tight">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate max-w-[160px]">
                  {user?.name}
                </p>
                {roleLabel && (
                  <span className="inline-flex items-center text-[10px] font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    {roleLabel}
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main page content */}
        <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </div>
    </div>
  );
};

export default DashboardShell;
