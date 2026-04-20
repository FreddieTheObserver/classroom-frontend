import { Navigate, Outlet } from 'react-router';
import { useAuth, type Role } from '../providers/AuthProvider';

interface Props {
    role?: Role;
}

const dashboardPath: Record<Role, string> = {
    ADMIN: '/admin',
    TEACHER: '/teacher',
    STUDENT: '/student',
};

export function ProtectedRoute({ role }: Props) {
    const { user, isLoading } = useAuth();

    if (isLoading) return <div className="p-8">Loading...</div>
    if (!user) return <Navigate to="/login" replace />;
    if (role && user.role !== role) return <Navigate to={dashboardPath[user.role]} replace />;
    return <Outlet />;
}