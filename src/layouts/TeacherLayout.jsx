import { Outlet } from 'react-router-dom';
import { FolderOpen, LayoutDashboard, Upload } from 'lucide-react';
import DashboardShell from './DashboardShell';

const TEACHER_LINKS = [
  { to: '/teacher/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/teacher/upload', label: 'Upload Content', icon: Upload },
  { to: '/teacher/my-content', label: 'My Content', icon: FolderOpen },
];

const TeacherLayout = () => (
  <DashboardShell links={TEACHER_LINKS} roleLabel="Teacher">
    <Outlet />
  </DashboardShell>
);

export default TeacherLayout;
