import { z } from "zod";

export const validateProcessRegistationSchema = z.object({
  name: z.string().min(3).max(255),
  email: z.string().email(),
  password: z.string().min(8).max(255),
});

export const validateRegistationSchema = z.object({
  token: z.string().min(8).max(255),
});
