import type { Department, Subject } from '@/types/api';
const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export class ApiError extends Error {
    constructor(
        public status: number,
        message: string,
        public details?: unknown,
    ) {
        super(message);
    }
}

type Options = Omit<RequestInit, "body"> & { body?: unknown };

export async function api<T>(path: string, options: Options = {}): Promise<T> {
    const { body, headers, ...rest } = options;
    const res = await fetch(`${BASE}${path}`, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
        body: body === undefined ? undefined : JSON.stringify(body),
        ...rest,
    });

    if (res.status === 204) return undefined as T;

    const data = await res.json().catch(() => null);
    if (!res.ok) {
        throw new ApiError(res.status, data?.error ?? "RequestFailed", data);
    }
    return data as T;
}

export const departmentsApi = {
    list: () => api<{ departments: Department[] }>("/api/departments"),
    get: (id: string) => api<{ department: Department }>(`/api/departments/${id}`),
    create: (body: { name: string; code: string; description?: string }) =>
        api<{ department: Department }>("/api/departments", {
            method: "POST",
            body,
        }),
    update: (
        id: string,
        body: Partial<{ name: string; code: string; description: string }>,
    ) =>
        api<{ department: Department }>(`/api/departments/${id}`, {
            method: "PATCH",
            body,
        }),
    remove: (id: string) =>
        api<void>(`/api/departments/${id}`, { method: "DELETE" }),
};

export const subjectsApi = {
    list: (filter?: { departmentId?: string }) => {
        const qs = filter?.departmentId
            ? `?departmentId=${encodeURIComponent(filter.departmentId)}`
            : "";

        return api<{ subjects: Subject[] }>(`/api/subjects${qs}`);
    },
    get: (id: string) => api<{ subject: Subject }>(`/api/subjects/${id}`),
    create: (body: {
        name: string;
        code: string;
        description?: string;
        departmentId: string;
    }) =>
        api<{ subject: Subject }>("/api/subjects", {
            method: "POST",
            body,
        }),
    update: (
        id: string,
        body: Partial<{
            name: string;
            code: string;
            description: string;
            departmentId: string;
        }>,
    ) =>
        api<{ subject: Subject }>(`/api/subjects/${id}`, {
            method: "PATCH",
            body,
        }),
    remove: (id: string) => api<void>(`/api/subjects/${id}`, { method: "DELETE" }),
};