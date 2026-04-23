
export interface Department {
    id: string;
    name: string;
    code: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface Subject {
    id: string;
    name: string;
    code: string;
    description: string | null;
    departmentId: string;
    department?: Pick<Department, "id" | "name" | "code">;
    createdAt: string;
    updatedAt: string;
}