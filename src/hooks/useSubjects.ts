import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { subjectsApi, ApiError } from "@/lib/api";

function key(filter?: { departmentId?: string }) {
    return ["subjects", filter?.departmentId ?? "all"] as const;
}

export function useSubjects(filter?: { departmentId?: string }) {
    return useQuery({
        queryKey: key(filter),
        queryFn: () => subjectsApi.list(filter),
        select: (data) => data.subjects,
    });
}

export function useCreateSubject() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: subjectsApi.create,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["subjects" ]});
            toast.success("Subject created");
        },
        onError: (err: unknown) => {
            toast.error(err instanceof ApiError ? err.message : "Failed to create subject");
        },
    });
}

export function useUpdateSubject() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, patch }: { id: string, patch: Parameters<typeof subjectsApi.update>[1] }) =>
            subjectsApi.update(id, patch),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["subjects"] });
            toast.success("Subject updated");
        },
        onError: (err: unknown) => {
            toast.error(err instanceof ApiError ? err.message : "Failed to update subject");
        },
    });
}

export function useDeleteSubject() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => subjectsApi.remove(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["subjects"] });
            toast.success("Subject deleted");
        },
        onError: (err: unknown) => {
            toast.error(err instanceof ApiError ? err.message : "Failed to delete subject");
        },
    });
}