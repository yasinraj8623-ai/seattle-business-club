import { z } from "zod";

const text = (max = 200) => z.string().trim().max(max);
const required = (max = 200) => text(max).min(1, "Required");
const optional = (max = 200) =>
  text(max)
    .transform((v) => (v === "" ? undefined : v))
    .optional();

export const applicationSchema = z.object({
  firstName: required(80),
  lastName: required(80),
  email: z
    .email("Invalid email")
    .max(254)
    .transform((v) => v.trim().toLowerCase()),
  phone: required(40),
  age: z.coerce.number().int().min(18, "You must be 18 or older").max(120),
  city: optional(80),
  profession: optional(120),
  linkedin: required(300),
  instagram: optional(300),
  website: optional(300),
  source: required(80),
  passion: required(2000),
  oneMessage: required(2000),
  whyJoin: required(2000),
  introduction: optional(2000),
  referralCode: optional(40).transform((v) => v?.toUpperCase()),
});
