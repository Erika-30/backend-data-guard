// src/utils/validation.ts

import { UserSchema } from "../config/dbConfig";

export const validateUser = (user: any) => {
  const result = UserSchema.safeParse(user);
  if (!result.success) {
    return {
      success: false,
      errors: result.error.errors.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      })),
    };
  }
  return { success: true, data: result.data };
};
