import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Required").max(80),
  email: z
    .email("Invalid email")
    .max(254)
    .transform((v) => v.trim().toLowerCase()),
  subject: z.string().trim().min(1, "Required").max(150),
  message: z.string().trim().min(1, "Required").max(3000),
});
