import { z } from "zod";

// registerSchema
export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.email(),
  password: z.string().min(8),
})
export type RegisterInput = z.infer<typeof registerSchema>

// loginSchema
export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8)
});


export type LoginInput = z.infer<typeof loginSchema>


