import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";

import { truncateTable } from "../../src/db/utils";
import app from "../../src/app";

const user = {
  username: "testuser",
  email: "testuser@example.com",
  password: "password123",
  role: "admin",
  age: "30",
};

describe("Auth Controller", () => {
  beforeAll(async () => {
    await truncateTable("users");
  });

  it("should sign up a new user", async () => {
    const response = await request(app).post("/auth/signup").send(user);

    expect(response.status).toBe(201);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.data).toHaveProperty("username", user.username);
  });

  it("should login an existing user", async () => {
    const { email, password } = user;
    const response = await request(app)
      .post("/auth/login")
      .send({ email, password });

    expect(response.status).toBe(200);
    expect(response.body.ok).toBeTruthy();
    expect(response.body).toHaveProperty("token");
  });
  it("should return an error if email or password are invalid", async () => {
    const loginData = {
      email: "invalid@example.com",
      password: "invalid",
    };

    const response = await request(app).post("/auth/login").send(loginData);
    expect(response.body.ok).toBeFalsy();
    expect(response.body.error.message).toBe("Usuario no encontrado");
  });
});
