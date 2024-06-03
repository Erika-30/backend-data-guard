// src/db/scripts/dbSeed.ts

import { config as configDotenv } from "dotenv";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
import { pool, query } from "../../config/dbConfig";

if (process.env["NODE_ENV"] === "test") {
  configDotenv({ path: ".env.test" });
} else {
  configDotenv();
}

const roles = ["user", "admin"];

const seedUsers = async () => {
  const users = [];
  for (let i = 0; i < 10; i++) {
    const username = faker.person.firstName();
    const email = faker.internet.email();
    const age = Number(faker.number.int({ min: 18, max: 65 }));
    const role = faker.helpers.arrayElement(roles);
    const password = bcrypt.hashSync("password123", 10);
    users.push(`('${username}', '${email}', ${age}, '${role}', '${password}')`);
  }

  const values = users.join(", ");
  const sqlQuery = `INSERT INTO users (username, email, age, role, password) VALUES ${values};`;

  console.log(sqlQuery);
  await query(sqlQuery);
  console.log("Users inserted");
  pool.end();
};

seedUsers().catch((err) => {
  console.error("Error al insertar usuarios:", err);
});
