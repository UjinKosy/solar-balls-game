// @ts-nocheck
import { z } from "zod";

export const healthRequestSchema = z.object({});

export const healthResponseSchema = z.object({
  status: z.literal("ok"),
  service: z.literal("api"),
  timestamp: z.string().datetime(),
});

export type HealthRequest = z.infer<typeof healthRequestSchema>;
export type HealthResponse = z.infer<typeof healthResponseSchema>;
