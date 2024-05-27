// src/db/scripts/dbCreate.ts

import { config as configDotenv } from "dotenv";
import { adminClient } from "../../config/dbConfig";

if (process.env["NODE_ENV"] === "test") {
  configDotenv({ path: ".env.test" });
} else {
  configDotenv();
}

const dbName = process.env["PGDATABASE"];

async function deleteDatabase() {
  try {
    await adminClient.query(`DROP DATABASE IF EXISTS "${dbName}"`);
    console.log(`Base de datos "${dbName}" eliminada exitosamente`);
  } catch (err: any) {
    console.error("Error al eliminar la base de datos", err.stack);
    throw err;
  } finally {
    adminClient.end();
  }
}

deleteDatabase().catch((err) => {
  console.error(
    "Error al ejecutar el script de eliminación de la base de datos:",
    err
  );
});
