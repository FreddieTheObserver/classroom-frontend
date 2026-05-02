import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { SubjectDialog } from "@/components/admin/SubjectDialog";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { useSubjects, useDeleteSubject } from "@/hooks/useSubjects";
import { useDepartments } from "@/hooks/useDepartments";
import type { Subject } from "@/types/api";

const ALL = "__all__";

export function SubjectsPage() {
    const [filterDept, setFilterDept] = useState<string>(ALL);
    const activeFilter = filterDept === ALL ? undefined : { departmentId: filterDept };
    const { data: subjects, isLoading, error, refetch } = useSubjects(activeFilter);
    const { data: departments } = useDepartments();
    const del = useDeleteSubject();

    const [dialogMode, setDialogMode] = useState<"create" | "edit" | null>(null);
    const [editTarget, setEditTarget] = useState<Subject | undefined>(undefined);
    const [deleteTarget, setDeleteTarget] = useState<Subject | null>(null);

    const noDepartments = departments && departments.length === 0;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Subjects</h1>
                <Button
                    onClick={() => { setEditTarget(undefined); setDialogMode("create"); }}
                    disabled={noDepartments}
                    title={noDepartments ? "Create a department first" : undefined}
                >
                    <Plus className="size-4 mr-1" /> New subject
                </Button>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Filter by department:</span>
                <Select value={filterDept} onValueChange={setFilterDept}>
                    <SelectTrigger className="w-72">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ALL}>All departments</SelectItem>
                        {departments?.map((d) => (
                            <SelectItem key={d.id} value={d.id}>{d.code} — {d.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {error && (
                <div className="p-4 border border-destructive/50 bg-destructive/5 rounded-md">
                    <p className="text-sm text-destructive mb-2">Failed to load subjects.</p>
                    <Button size="sm" variant="outline" onClick={() => refetch()}>Retry</Button>
                </div>
            )}

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-32">Code</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead className="w-64">Department</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="w-32 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : !subjects || subjects.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                    {filterDept === ALL ? "No subjects yet." : "No subjects in this department."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            subjects.map((s) => (
                                <TableRow key={s.id}>
                                    <TableCell className="font-mono">{s.code}</TableCell>
                                    <TableCell>{s.name}</TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {s.department ? `${s.department.code} — ${s.department.name}` : "—"}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {s.description ?? <span className="italic">—</span>}
                                    </TableCell>
                                    <TableCell className="text-right space-x-1">
                                        <Button
                                            size="icon" variant="ghost"
                                            onClick={() => { setEditTarget(s); setDialogMode("edit"); }}
                                            aria-label={`Edit ${s.name}`}
                                        >
                                            <Pencil className="size-4" />
                                        </Button>
                                        <Button
                                            size="icon" variant="ghost"
                                            onClick={() => setDeleteTarget(s)}
                                            aria-label={`Delete ${s.name}`}
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

            <SubjectDialog
                open={dialogMode !== null}
                onOpenChange={(open) => !open && setDialogMode(null)}
                mode={dialogMode ?? "create"}
                subject={editTarget}
            />

            <DeleteConfirmDialog
                open={deleteTarget !== null}
                onOpenChange={(open) => !open && setDeleteTarget(null)}
                title={`Delete ${deleteTarget?.name}?`}
                description={`This permanently removes subject ${deleteTarget?.code}.`}
                isLoading={del.isPending}
                onConfirm={() => {
                    if (!deleteTarget) return;
                    del.mutate(deleteTarget.id, { onSettled: () => setDeleteTarget(null) });
                }}
            />
        </div>
    );
}