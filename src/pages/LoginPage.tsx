import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useLogin } from '../hooks/useAuthMutations';
import { useAuth } from '../providers/AuthProvider';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(1, "Password is required"),
});
type Form = z.infer<typeof schema>;

const dashboardPath: Record<"ADMIN" | "TEACHER" | "STUDENT", string> = {
    ADMIN: "/admin",
    TEACHER: "/teacher",
    STUDENT: "/student",
};

export function LoginPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const login = useLogin();
    const { register, handleSubmit, formState } = useForm<Form>({
        resolver: zodResolver(schema),
    });

    if (user) {
        navigate(dashboardPath[user.role], { replace: true });
        return null;
    }

    const onSubmit = handleSubmit((values) => {
        login.mutate(values, {
            onSuccess: (res) => navigate(dashboardPath[res.user.role], { replace: true }),
            onError: () => toast.error("Invalid credentials"),
        });
    });

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 border rounded-lg p-6">
                <h1 className="text-2xl font-bold">Sign in</h1>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...register("email")} />
                    {formState.errors.email && (
                        <p className="text-sm text-red-600">{formState.errors.email.message}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" {...register("password")} />
                    {formState.errors.password && (
                        <p className="text-sm text-red-600">{formState.errors.password.message}</p>
                    )}
                </div>
                <Button type="submit" className="w-full" disabled={login.isPending}>
                    {login.isPending ? "Signing in..." : "Sign in"}
                </Button>
                <p className="text-sm text-center">
                    No account? <Link to="/signup" className="underline">Sign up as a student</Link>
                </p>
            </form>
        </div>
    );
}