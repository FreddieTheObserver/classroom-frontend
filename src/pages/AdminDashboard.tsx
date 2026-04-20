import { useAuth } from '../providers/AuthProvider';
import { useLogout } from '../hooks/useAuthMutations';
import { Button } from '../components/ui/button';

export function AdminDashboard() {
    const { user } = useAuth();
    const logout = useLogout();
    return (
        <div className="p-8 space-y-4">
            <h1 className="text-2xl font-bold">Admin dashboard</h1>
            <p>Welcome, {user?.name} ({user?.email}).</p>
            <Button onClick={() => logout.mutate()} disabled={logout.isPending}>
                Log out
            </Button>
        </div>
    );
}