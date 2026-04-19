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