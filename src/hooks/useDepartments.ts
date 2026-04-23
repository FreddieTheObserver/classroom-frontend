import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { departmentsApi, ApiError } from "@/lib/api";

const KEY = ["departments"] as const;

export function useDepartments() {
    return useQuery({
        queryKey: KEY,
        queryFn: departmentsApi.list,
        select: (data) => data.departments,
    });
}

export function useCreateDepartment() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: departmentsApi.create,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: KEY });
            toast.success("Department created");
        },
        onError: (err: unknown) => {
            toast.error(
                err instanceof ApiError
                    ? err.message
                    : "Failed to create department",
            );
        },
    });
}


export function useUpdateDepartment() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({
                         id,
                         patch,
                     }: {
            id: string;
            patch: Parameters<typeof departmentsApi.update>[1];
        }) => departmentsApi.update(id, patch),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: KEY });
            toast.success("Department updated");
        },
        onError: (err: unknown) => {
            toast.error(
                err instanceof ApiError
                    ? err.message
                    : "Failed to update department",
            );
        },
    });
}

export function useDeleteDepartment() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => departmentsApi.remove(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: KEY });
            toast.success("Department deleted");
        },
        onError: (err: unknown) => {
            toast.error(
                err instanceof ApiError
                    ? err.message
                    : "Failed to delete department",
            );
        },
    });
}