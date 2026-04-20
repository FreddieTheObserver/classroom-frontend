import { createContext, useContext, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, ApiError } from "@/lib/api.ts";

export type Role = "ADMIN" | "TEACHER" | "STUDENT";

export interface AuthUser {
    id: string;
    email: string;
    name: string;
    role: Role;
}

interface AuthContextValue {
    user: AuthUser | null;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function fetchMe(): Promise<AuthUser | null> {
    try {
        const { user } = await api<{ user: AuthUser }>("/api/auth/me");
        return user;
    } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
            return null;
        }
        throw err;
    }
}

export async function AuthProvider({ children }: { children: ReactNode }) {
    const { data, isLoading } = useQuery({
        queryKey: ["me"],
        queryFn: fetchMe,
        staleTime: Infinity,
    });

    return (
        <AuthContext.Provider value={{ user: data ?? null, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return ctx;
}