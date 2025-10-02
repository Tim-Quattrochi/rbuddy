import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

export const insertUserSchema = userSchema.omit({ id: true });

export const checkInSchema = z.object({
  id: z.string(),
  userId: z.string(),
  date: z.string(), // ISO date string
  feeling: z.string().min(1, "Please share how you're feeling"),
  goal: z.string().min(1, "Please set a simple goal for today"),
  journal: z.string().optional(),
  createdAt: z.string(), // ISO datetime string
});

export const insertCheckInSchema = checkInSchema.omit({ id: true, createdAt: true });

export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type CheckIn = z.infer<typeof checkInSchema>;
export type InsertCheckIn = z.infer<typeof insertCheckInSchema>;
