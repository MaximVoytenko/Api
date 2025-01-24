import type { FastifySchema } from "fastify";
import { z } from "zod";

const schema = z.object({
    title: z.string().min(1).max(127),
    description: z.string(),
    notifyAt: z.string().optional()
});

export type createSchema = z.infer<typeof schema>;
export const createFSchema: FastifySchema = { body: schema };
