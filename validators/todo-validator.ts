import { z } from "zod";

export const todoValidator = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .trim()
    .min(1, { message: "Title is required" }),
  description: z.string().optional(),
  startDate: z
    .string({ required_error: "Title is required" })
    .trim()
    .min(1, { message: "Title is required" }),
  endDate: z
    .string({ required_error: "Title is required" })
    .trim()
    .min(1, { message: "Title is required" }),
});
