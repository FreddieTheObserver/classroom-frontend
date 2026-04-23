import { z } from "zod";

const codeRegex = /^[A-Z0-9-]+$/;

export const departmentCreateSchema = z.object({
    name: z.string().min(1, "Required").max(100),
    code: z
        .string()
        .min(1, "Required")
        .max(20)
        .regex(codeRegex, "Uppercase letters, digits, dashes only"),
    description: z.string().max(500).optional(),
});

export type DepartmentCreateInput = z.infer<typeof departmentCreateSchema>;

export const subjectCreateSchema = z.object({
    name: z.string().min(1, "Required").max(100),
    code: z
        .string()
        .min(1, "Required")
        .max(20)
        .regex(codeRegex, "Uppercase letters, digits, dashes only"),
    description: z.string().max(500).optional(),
    departmentId: z.string().min(1, "Required"),
});

export type SubjectCreateInput = z.infer<typeof subjectCreateSchema>;