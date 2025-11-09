import type { z } from "zod";
import { authSignInSchema, authSignUpSchema } from "../schemas/auth";

export type AuthSignIn = z.infer<typeof authSignInSchema>;
export type AuthSignUp = z.infer<typeof authSignUpSchema>;
