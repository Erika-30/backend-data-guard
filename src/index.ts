import app from "./app";
import { pool } from "./config/dbConfig";

const port = process.env["PORT"] || 3000;

const gracefulShutdown = () => {
  pool.end(() => {
    console.log("\nApplication ended gracefully");
    process.exit(0);
  });
};
process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

app.listen(port, () => console.log(`Server running on port ${port}`));
