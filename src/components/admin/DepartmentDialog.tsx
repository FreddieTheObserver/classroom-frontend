import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { departmentCreateSchema, type DepartmentCreateInput } from "@/lib/schemas";
import { useCreateDepartment, useUpdateDepartment } from "@/hooks/useDepartments";
import type { Department } from "@/types/api";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: "create" | "edit";
    department?: Department;
}

export function DepartmentDialog({ open, onOpenChange, mode, department }: Props) {
    const create = useCreateDepartment();
    const update = useUpdateDepartment();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<DepartmentCreateInput>({
        resolver: zodResolver(departmentCreateSchema),
        defaultValues: { name: "", code: "", description: "" },
    });

    useEffect(() => {
        if (open) {
            reset({
                name: department?.name ?? "",
                code: department?.code ?? "",
                description: department?.description ?? "",
            });
        }
    }, [open, department, reset]);

    async function onSubmit(values: DepartmentCreateInput) {
        try {
            if (mode === "create") {
                await create.mutateAsync(values);
            } else if (department) {
                await update.mutateAsync({ id: department.id, patch: values });
            }

            onOpenChange(false);
        } catch {
            // The mutation hook already shows the toast. Keep the dialog open.
        }
    }

    const busy = create.isPending || update.isPending || isSubmitting;
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {mode === "create" ? "New department" : "Edit department"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="dept-name">Name</Label>
                        <Input id="dept-name" {...register("name")} disabled={busy} />
                        {errors.name && (
                            <p className="text-sm text-destructive">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="dept-code">Code</Label>
                        <Input
                            id="dept-code"
                            {...register("code", {
                                onChange: (event) => {
                                    event.target.value = event.target.value.toUpperCase();
                                },
                            })}
                            disabled={busy}
                            placeholder="CSC"
                        />
                        {errors.code && (
                            <p className="text-sm text-destructive">{errors.code.message}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="dept-desc">Description (optional)</Label>
                        <Textarea
                            id="dept-desc"
                            {...register("description")}
                            disabled={busy}
                            rows={3}
                        />
                        {errors.description && (
                            <p className="text-sm text-destructive">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={busy}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={busy}>
                            {busy ? "Saving..." : mode === "create" ? "Create" : "Save"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}