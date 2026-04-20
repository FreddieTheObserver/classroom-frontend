import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { AuthUser } from "../providers/AuthProvider";

interface LoginInput {
    email: string;
    password: string;
}

interface SignupInput {
    email: string;
    password: string;
    name: string;
}

interface AuthResponse {
    user: AuthUser;
}

export function useLogin() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (input: LoginInput) =>
            api<AuthResponse>("/api/auth/login", { method: "POST", body: input }),
        onSuccess: (res) => {
            qc.setQueryData(["me"], res.user);
        },
    });
}

export function useSignup() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (input: SignupInput) =>
            api<AuthResponse>("/api/auth/signup", { method: "POST", body: input }),
        onSuccess: (res) => {
            qc.setQueryData(["me"], res.user);
        },
    });
}

export function useLogout() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: () => api<void>("/api/auth/logout", { method: "POST" }),
        onSuccess: () => {
            qc.setQueryData(["me"], null);
        },
    });
}