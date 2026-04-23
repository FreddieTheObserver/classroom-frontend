import { useAuth } from '@/providers/AuthProvider';

export function AdminOverview() {
    const { user } = useAuth();

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Overview</h1>
            <p>
                Welcome, {user?.name} ({user?.email}).
            </p>
            <p className="text-muted-foreground text-sm">
                Use the sidebar to manage departments and subjects.
            </p>
        </div>
    );
}