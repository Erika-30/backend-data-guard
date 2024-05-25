import { Migration } from "../scripts/dbMigrate";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

export type User = {
  username: string;
  email: string;
  age: number;
  role: string;
  password: string;
};

const roles = ["user", "admin"];

export async function generateUser(): Promise<User> {
  const username = faker.person.fullName();
  const email = faker.internet.email();
  const age = faker.number.int({ min: 18, max: 100 });
  const role = faker.helpers.arrayElement(roles);
  const password = await bcrypt.hash("password123", 10);

  return {
    username,
    email,
    age,
    role,
    password,
  };
}

export const up: Migration = async (params) => {
  const users: User[] = [];
  for (let i = 0; i < 10; i++) {
    users.push(await generateUser());
  }

  const values = users
    .map(
      (user) =>
        `('${user.username}', '${user.email}', ${user.age}, '${user.role}', '${user.password}')`
    )
    .join(", ");
  const sqlQuery = `INSERT INTO users (username, email, age, role, password) VALUES ${values};`;

  return await params.context.query(sqlQuery);
};

export const down: Migration = async (params) => {
  return params.context.query(`DELETE FROM users;`);
};
