import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { useSignup } from "../hooks/useAuthMutations";
import { useAuth } from "../providers/AuthProvider";
import { ApiError } from "../lib/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

const schema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters"),
});
type Form = z.infer<typeof schema>;

export function SignupPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const signup = useSignup();
    const { register, handleSubmit, formState } = useForm<Form>({
        resolver: zodResolver(schema),
    });

    if (user) {
        navigate("/student", { replace: true });
        return null;
    }

    const onSubmit = handleSubmit((values) => {
        signup.mutate(values, {
            onSuccess: () => navigate("/student", { replace: true }),
            onError: (err) => {
                if (err instanceof ApiError && err.status === 409) {
                    toast.error("That email is already registered");
                } else {
                    toast.error("Signup failed");
                }
            },
        });
    });

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 border rounded-lg p-6">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" {...register("name")} />
                    {formState.errors.name && (
                        <p className="text-sm text-red-600">{formState.errors.name.message}</p>
                    )}
                </div>
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
                <Button type="submit" className="w-full" disabled={signup.isPending}>
                    {signup.isPending ? "Creating account…" : "Sign up"}
                </Button>
                <p className="text-sm text-center">
                    Already have an account? <Link to="/login" className="underline">Sign in</Link>
                </p>
            </form>
        </div>
    );
}