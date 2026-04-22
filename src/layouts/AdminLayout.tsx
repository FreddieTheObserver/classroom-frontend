import { Outlet } from 'react-router';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/AuthProvider';
import { useLogout } from '@/hooks/useAuthMutations';

export function AdminLayout() {
    const { user } = useAuth()
    const logout = useLogout();

    return (
        <div className="flex min-h-screen">
            <AdminSidebar />

            <div className="flex-1 flex flex-col">
                <header className="flex items-center justify-between px-6 h-14 border-b">
                    <div className="text-sm text-muted-foreground">
                        Signed in as {" "}
                        <span className="font-medium text-foreground">
                            {user?.name}
                        </span>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => logout.mutate()}
                        disabled={logout.isPending}
                    >
                        Log out
                    </Button>
                </header>

                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}