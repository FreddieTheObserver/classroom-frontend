import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { subjectCreateSchema, type SubjectCreateInput } from "@/lib/schemas";
import { useCreateSubject, useUpdateSubject } from "@/hooks/useSubjects";
import { useDepartments } from "@/hooks/useDepartments";
import type { Subject } from "@/types/api";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: "create" | "edit";
    subject?: Subject;
}

export function SubjectDialog({ open, onOpenChange, mode, subject }: Props) {
    const create = useCreateSubject();
    const update = useUpdateSubject();
    const { data: departments, isLoading: deptsLoading } = useDepartments();

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm<SubjectCreateInput>({
        resolver: zodResolver(subjectCreateSchema),
        defaultValues: { name: "", code: "", description: "", departmentId: "" },
    });

    useEffect(() => {
        if (open) {
            reset({
                name: subject?.name ?? "",
                code: subject?.code ?? "",
                description: subject?.description ?? "",
                departmentId: subject?.departmentId ?? "",
            });
        }
    }, [open, subject, reset]);

    async function onSubmit(values: SubjectCreateInput) {
        try {
            if (mode === "create") {
                await create.mutateAsync(values);
            } else if (subject) {
                await update.mutateAsync({ id: subject.id, patch: values });
            }
            onOpenChange(false);
        } catch {
            // toast already fired
        }
    }
    const busy = create.isPending || update.isPending || isSubmitting;
    const noDepartments = !deptsLoading && (!departments || departments.length === 0);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {mode === "create" ? "New subject" : "Edit subject"}
                    </DialogTitle>
                </DialogHeader>

                {noDepartments ? (
                    <div className="p-4 rounded-md bg-muted text-sm">
                        You need at least one department before adding subjects.
                        Create a department first.
                        <div className="mt-4">
                            <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="sub-name">Name</Label>
                            <Input id="sub-name" {...register("name")} disabled={busy} />
                            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="sub-code">Code</Label>
                            <Input
                                id="sub-code"
                                {...register("code", {
                                    onChange: (e) => { e.target.value = e.target.value.toUpperCase(); },
                                })}
                                disabled={busy}
                                placeholder="CSC101"
                            />
                            {errors.code && <p className="text-sm text-destructive">{errors.code.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label>Department</Label>
                            <Controller
                                control={control}
                                name="departmentId"
                                render={({ field }) => (
                                    <Select value={field.value || undefined} onValueChange={field.onChange} disabled={busy}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose a department" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {departments?.map((d) => (
                                                <SelectItem key={d.id} value={d.id}>
                                                    {d.code} — {d.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.departmentId && <p className="text-sm text-destructive">{errors.departmentId.message}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="sub-desc">Description (optional)</Label>
                            <Textarea id="sub-desc" {...register("description")} disabled={busy} rows={3} />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={busy}>
                                {busy ? "Saving…" : mode === "create" ? "Create" : "Save"}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}