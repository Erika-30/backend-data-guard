//  src/data/users.data.ts

import { query } from "../config/dbConfig";
import { User, UserData } from "../config/dbConfig";

export async function createUserInDB(user: UserData): Promise<User> {
  const queryText = `
    INSERT INTO users (username, email, age, role, password)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const values: (string | number | boolean | null)[] = [
    user.username,
    user.email,
    user.age == undefined ? null : user.age,
    user.role,
    user.password,
  ];
  const result = await query(queryText, values);
  return result.rows[0];
}

export async function getUserByEmailFromDB(email: string): Promise<User> {
  const queryText = "SELECT * FROM users WHERE email = $1";
  const values = [email];
  const result = await query(queryText, values);
  return result.rows[0];
}
