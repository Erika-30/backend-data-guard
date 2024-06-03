// src/db/scripts/dbDrop.ts

import { config as configDotenv } from "dotenv";
import fs from "fs";
import path from "path";
import { pool, query } from "../../config/dbConfig";

if (process.env["NODE_ENV"] === "test") {
  configDotenv({ path: ".env.test" });
} else {
  configDotenv();
}

const migrationsFileName =
  process.env["NODE_ENV"] === "test"
    ? "migrations.test.json"
    : "migrations.json";

const dropTable = `DROP TABLE IF EXISTS users;`;

async function dropDatabaseTable() {
  try {
    await query(dropTable);
    console.log("Tabla 'users' eliminada exitosamente");
    try {
      fs.unlinkSync(path.join(__dirname, "../migrations", migrationsFileName));
    } catch {
      console.log(
        "No se pudo eliminar el archivo de migraciones",
        migrationsFileName
      );
    }
  } catch (err: any) {
    console.error("Error al eliminar la tabla", err.stack);
    throw err;
  } finally {
    pool.end();
  }
}

dropDatabaseTable().catch((err) => {
  console.error(
    "Error al ejecutar el script de eliminación de base de datos y tabla:",
    err
  );
});
