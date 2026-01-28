import { z } from "zod";

export type ApplicationFormData = z.infer<typeof applicationSchema>;

export const applicationSchema = z.object({
  fullName: z.string().min(2, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  idType: z.enum(["SA_ID", "PASSPORT"]),
  // SA ID: 13 digits. Passport: Alphanumeric min 6 max 20
  idNumber: z.string().min(6, "ID Number is required").max(20, "ID Number too long"),
  dateOfBirth: z.string().optional(), // Only for passport users
  referralCode: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
});
