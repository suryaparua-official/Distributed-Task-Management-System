import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be at most 200 characters")
    .trim(),

  description: z
    .string()
    .max(1000, "Description must be at most 1000 characters")
    .trim()
    .optional(),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title cannot be empty")
    .max(200, "Title must be at most 200 characters")
    .trim()
    .optional(),

  description: z
    .string()
    .max(1000, "Description must be at most 1000 characters")
    .trim()
    .optional(),

  completed: z.boolean().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
