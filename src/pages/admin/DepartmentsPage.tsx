import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { DepartmentDialog } from "@/components/admin/DepartmentDialog";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { useDepartments, useDeleteDepartment } from "@/hooks/useDepartments";
import type { Department } from "@/types/api";

export function DepartmentsPage() {
    const { data: departments, isLoading, error, refetch } = useDepartments();
    const del = useDeleteDepartment();

    const [dialogMode, setDialogMode] = useState<"create" | "edit" | null>(null);
    const [editTarget, setEditTarget] = useState<Department | undefined>(undefined);
    const [deleteTarget, setDeleteTarget] = useState<Department | null>(null);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Departments</h1>
                <Button
                    onClick={() => {
                        setEditTarget(undefined);
                        setDialogMode("create");
                    }}
                >
                    <Plus className="size-4 mr-1" /> New department
                </Button>
            </div>

            {error && (
                <div className="p-4 border border-destructive/50 bg-destructive/5 rounded-md">
                    <p className="text-sm text-destructive mb-2">
                        Failed to load departments.
                    </p>
                    <Button size="sm" variant="outline" onClick={() => refetch()}>
                        Retry
                    </Button>
                </div>
            )}

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-32">Code</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="w-32 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 3 }).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Skeleton className="h-4 w-16" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-40" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-64" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-24 ml-auto" />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : !departments || departments.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="text-center text-muted-foreground py-8"
                                >
                                    No departments yet. Create your first.
                                </TableCell>
                            </TableRow>
                        ) : (
                            departments.map((department) => (
                                <TableRow key={department.id}>
                                    <TableCell className="font-mono">
                                        {department.code}
                                    </TableCell>
                                    <TableCell>{department.name}</TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {department.description ?? (
                                            <span className="italic">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right space-x-1">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => {
                                                setEditTarget(department);
                                                setDialogMode("edit");
                                            }}
                                            aria-label={`Edit ${department.name}`}
                                        >
                                            <Pencil className="size-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => setDeleteTarget(department)}
                                            aria-label={`Delete ${department.name}`}
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <DepartmentDialog
                open={dialogMode !== null}
                onOpenChange={(open) => {
                    if (!open) setDialogMode(null);
                }}
                mode={dialogMode ?? "create"}
                department={editTarget}
            />
            <DeleteConfirmDialog
                open={deleteTarget !== null}
                onOpenChange={(open) => {
                    if (!open) setDeleteTarget(null);
                }}
                title={`Delete ${deleteTarget?.name}?`}
                description={`This permanently removes ${deleteTarget?.code}. The action fails if any subjects still reference it.`}
                isLoading={del.isPending}
                onConfirm={() => {
                    if (!deleteTarget) return;

                    del.mutate(deleteTarget.id, {
                        onSettled: () => setDeleteTarget(null),
                    });
                }}
            />
        </div>
    );
}