// src/db/scripts/dbMigrate.ts

import { config as configDotenv } from "dotenv";
import path from "path";
import fs from "fs";
import { Umzug, JSONStorage } from "umzug";
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

const migrator = new Umzug({
  migrations: { glob: path.join(__dirname, "../migrations/*.ts") },
  context: { query },
  storage: new JSONStorage({
    path: path.join(__dirname, "../migrations", migrationsFileName),
  }),
  logger: console,
  create: {
    folder: path.join(__dirname, "../migrations"),
    template: (filepath) => [
      [
        filepath,
        fs
          .readFileSync(
            path.join(__dirname, "../template/migration-template.ts")
          )
          .toString(),
      ],
    ],
  },
});

export type Migration = typeof migrator._types.migration;

migrator.runAsCLI().then(() => pool.end());
