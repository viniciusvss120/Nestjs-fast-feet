/* eslint-disable prettier/prettier */
import {z} from 'zod'

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().optional().default(3001),
  JWT_SECRET: z.string(),
})

// Inferindo ao Env o tipo envSchmea
export type Env = z.infer<typeof envSchema>