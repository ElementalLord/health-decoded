import { z } from "zod";

const email = z.string().trim().email("Enter a valid email address.").max(254);
const existingPassword = z.string().min(1, "Enter your password.").max(128);
const newPassword = z.string().min(12, "Use at least 12 characters.").max(128);

export const loginSchema = z.object({ email, password: existingPassword });
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
  .object({ email, password: newPassword, passwordConfirmation: newPassword })
  .refine((value) => value.password === value.passwordConfirmation, {
    message: "Passwords do not match.",
    path: ["passwordConfirmation"],
  });
export const resetPasswordSchema = z
  .object({ password: newPassword, passwordConfirmation: newPassword })
  .refine((value) => value.password === value.passwordConfirmation, {
    message: "Passwords do not match.",
    path: ["passwordConfirmation"],
  });
