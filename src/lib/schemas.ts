import { z } from "zod";

// Basic SA ID Validation (Luhn algorithm check is ideal, but regex length is a good start)
const saIdRegex = /^\d{13}$/;

// Base schema for common fields
const baseSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(10, "Phone number must be at least 10 digits."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters."),
  referralCode: z.string().optional(),
  idType: z.enum(["SA_ID", "PASSPORT"]).default("SA_ID"),
  dateOfBirth: z.string().optional(), // YYYY-MM-DD
  idNumber: z.string(),
});

// Refine the schema to handle conditional validation
export const applicationSchema = baseSchema.superRefine((data, ctx) => {
    // 1. Password Match
    if (data.password !== data.confirmPassword) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Passwords do not match",
            path: ["confirmPassword"],
        });
    }

    // 2. ID Validation based on Type
    if (data.idType === "SA_ID") {
        if (!saIdRegex.test(data.idNumber)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "SA ID Number must be exactly 13 digits.",
                path: ["idNumber"],
            });
        }
    } else {
        // Passport Mode
        if (data.idNumber.length < 6) {
             ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Passport Number must be at least 6 characters.",
                path: ["idNumber"],
            });
        }
        if (!data.dateOfBirth) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Date of Birth is required for Passport holders.",
                path: ["dateOfBirth"],
            });
        }
    }
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;
