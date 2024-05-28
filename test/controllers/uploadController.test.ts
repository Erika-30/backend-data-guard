import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import path from "path";
import fs from "fs";
import { truncateTable } from "../../src/db/utils";
import { pool } from "../../src/config/dbConfig";
import app from "../../src/app";
import jwt from "jsonwebtoken";

const jwtSecret = process.env["JWT_SECRET"] || "secret"; // Asegúrate de que esto coincide

const user = {
  username: "testuser",
  email: "testuser@example.com",
  password: "password123",
  role: "admin",
  age: "30",
};

let userToken: string;
let userId: number;

describe("Upload Controller", () => {
  beforeAll(async () => {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        email VARCHAR(50) UNIQUE NOT NULL,
        age INTEGER,
        role VARCHAR(10) NOT NULL DEFAULT 'user',
        password VARCHAR(255) NOT NULL
      )
    `);
    await truncateTable("users");

    // Registrar y autenticar usuario administrador
    let response = await request(app).post("/auth/signup").send(user);
    expect(response.status).toBe(201);
    expect(response.body.ok).toBeTruthy();

    response = await request(app)
      .post("/auth/login")
      .send({ email: user.email, password: user.password });
    expect(response.status).toBe(200);
    expect(response.body.ok).toBeTruthy();
    userToken = response.body.token;

    // Recuperar el ID del usuario
    const userResponse = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [user.email]
    );
    userId = userResponse.rows[0].id;
  });

  afterAll(async () => {
    // Limpiar la base de datos después de las pruebas
    await pool.query("DROP TABLE IF EXISTS users");
    await pool.end();
  });

  it("should return an error for no file uploaded", async () => {
    const response = await request(app)
      .post("/user/upload")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(400);
    expect(response.body.ok).toBe(false);
    expect(response.body.message).toBe("No file uploaded");
  });

  it("should return an error for unauthorized request", async () => {
    const csvFilePath = path.resolve(__dirname, "../users/file.csv");

    const response = await request(app)
      .post("/user/upload")
      .attach("file", csvFilePath);

    expect(response.status).toBe(401);
    expect(response.body.ok).toBe(false);
    expect(response.body.error.message).toBe("No token provided");
  });
});
