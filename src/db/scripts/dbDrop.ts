import { config as configDotenv } from "dotenv";
import fs from "fs";
import path from "path";
import { pool } from "../../config/dbConfig";

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

pool.connect();

pool.query(dropTable, (err) => {
  if (err) {
    console.error("Error al eliminar la tabla", err.stack);
  } else {
    console.log("Tabla 'users' eliminada exitosamente");
    try {
      fs.unlinkSync(path.join(__dirname, "../migrations", migrationsFileName));
    } catch {
      console.log(
        "No se pudo eliminar el archivo de migraciones",
        migrationsFileName
      );
    }
  }
  pool.end();
});
