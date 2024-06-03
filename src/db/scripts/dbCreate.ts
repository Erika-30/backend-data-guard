// src/db/scripts/dbCreate.ts

import { config as configDotenv } from "dotenv";
import { adminClient, query } from "../../config/dbConfig";

if (process.env["NODE_ENV"] === "test") {
  configDotenv({ path: ".env.test" });
} else {
  configDotenv();
}

const dbName = process.env["PGDATABASE"];

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(30) UNIQUE NOT NULL,
    email VARCHAR(30) UNIQUE NOT NULL,
    age INTEGER,
    role VARCHAR(30) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    password VARCHAR(255) NOT NULL
  );
`;

async function createDatabaseAndTable() {
  try {
    await adminClient.query(`CREATE DATABASE "${dbName}"`);
    console.log(`Base de datos "${dbName}" creada exitosamente`);
  } catch (err: any) {
    if (err.code === "42P04") {
      console.log(`Base de datos "${dbName}" ya existe`);
    } else {
      console.error("Error al crear la base de datos", err.stack);
      throw err;
    }
  }

  try {
    await query(createTableQuery);
    console.log("Tabla 'users' creada exitosamente");
  } catch (err) {
    console.error("Error al crear la tabla", (err as Error).stack);
    throw err;
  }
}

createDatabaseAndTable().catch((err) => {
  console.error(
    "Error al ejecutar el script de creación de base de datos y tabla:",
    err
  );
});
