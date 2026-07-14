import { z } from "zod";

const email = z.string().trim().email("Enter a valid email address.").max(254);
const password = z.string().min(8, "Use at least 8 characters.").max(128);

export const loginSchema = z.object({ email, password });
export const forgotPasswordSchema = z.object({ email });
export const resendVerificationSchema = z.object({ email });
export const emailOtpTypeSchema = z.enum([
  "email",
  "email_change",
  "invite",
  "magiclink",
  "recovery",
  "signup",
]);
export const signupSchema = z
  .object({ email, password, passwordConfirmation: password })
  .refine((value) => value.password === value.passwordConfirmation, {
    message: "Passwords do not match.",
    path: ["passwordConfirmation"],
  });
export const resetPasswordSchema = z
  .object({ password, passwordConfirmation: password })
  .refine((value) => value.password === value.passwordConfirmation, {
    message: "Passwords do not match.",
    path: ["passwordConfirmation"],
  });
