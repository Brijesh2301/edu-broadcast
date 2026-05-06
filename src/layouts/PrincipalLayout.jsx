import { useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { ClipboardCheck, LayoutDashboard, Table2 } from 'lucide-react';
import DashboardShell from './DashboardShell';
import { useAllContents } from '@/hooks/useContent';

const PrincipalLayout = () => {
  const { data: contents = [] } = useAllContents();

  const pendingCount = useMemo(
    () => contents.filter((c) => c.status === 'pending').length,
    [contents]
  );

  const links = useMemo(
    () => [
      {
        to: '/principal/dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
      },
      {
        to: '/principal/pending',
        label: 'Pending Approvals',
        icon: ClipboardCheck,
        badge: pendingCount,
      },
      { to: '/principal/all-content', label: 'All Content', icon: Table2 },
    ],
    [pendingCount]
  );

  return (
    <DashboardShell links={links} roleLabel="Principal">
      <Outlet />
    </DashboardShell>
  );
};

export default PrincipalLayout;
