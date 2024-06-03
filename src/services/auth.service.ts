// src/services/auth.service.ts

import { getUserByEmailFromDB, createUserInDB } from "../data/users.data";
import bcrypt from "bcrypt";
import { User, UserData } from "../config/dbConfig";

export async function createUser(userData: UserData): Promise<User> {
  const user = await getUserByEmailFromDB(userData.email);

  if (user !== undefined) {
    throw new Error("Email already in use");
  }

  userData.password = await bcrypt.hash(userData.password, 10);

  return await createUserInDB(userData);
}

export async function validateUserCredentials(
  email: string,
  password: string
): Promise<User> {
  const user = await getUserByEmailFromDB(email);

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  return user;
}
