// src/config/dbConfig.ts

import { config as configDotenv } from "dotenv";
import { Pool, Client } from "pg";
import { z } from "zod";

if (process.env["NODE_ENV"] === "test") {
  configDotenv({ path: ".env.test" });
} else {
  configDotenv();
}

const { PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD, PGADMINDATABASE } =
  process.env;

if (
  !PGHOST ||
  !PGPORT ||
  !PGDATABASE ||
  !PGUSER ||
  !PGPASSWORD ||
  !PGADMINDATABASE
) {
  throw new Error("Required environment variables are not defined");
}

export const pool = new Pool({
  host: PGHOST,
  port: Number(PGPORT),
  database: PGDATABASE,
  user: PGUSER,
  password: PGPASSWORD,
});

export const query = async (
  text: string,
  params?: (string | number | boolean | null)[]
) => {
  try {
    const results = await pool.query(text, params);
    return results;
  } catch (error) {
    console.error(`Error executing query: ${text}`, error);
    throw error;
  }
};

export const adminClient = new Client({
  host: PGHOST,
  port: Number(PGPORT),
  database: PGADMINDATABASE,
  user: PGUSER,
  password: PGPASSWORD,
});

adminClient.connect().catch((error) => {
  console.error("Error connecting to admin database", error);
  throw error;
});

export const UserSchema = z.object({
  id: z.number().optional(),
  username: z
    .string()
    .min(1, "El nombre es requerido")
    .max(30, "El nombre no puede exceder los 30 caracteres")
    .regex(/^[a-zA-Z ]*$/, "El nombre solo puede contener letras y espacios"),
  email: z
    .string()
    .email("Debe ser un email válido")
    .max(50, "El email no puede exceder los 50 caracteres"),
  age: z
    .string()
    .refine((value) => /^\d+$/.test(value), {
      message: "La edad debe ser un número positivo",
      path: ["age"],
    })
    .optional()
    .nullable(),
  role: z
    .string()
    .refine((value) => /^user$|^admin$/.test(value), {
      message: "Debe ser 'user' o 'admin'",
    })
    .default("user"),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export type User = z.infer<typeof UserSchema>;
export type UserData = Omit<User, "id" | "createdAt" | "updatedAt"> & {
  password?: string;
};
