import request from "supertest";
import app from "../src/app";
import { db } from "../src/db";
import { describe, it, beforeEach, expect } from "@jest/globals";



describe("Credential Issuance API", () => {

      beforeEach(() => {
    db.prepare("DELETE FROM credentials").run();
  });

  it("should issue a new credential successfully", async () => {
    const res = await request(app)
      .post("/issue")
      .send({ name: "Alice", email: "alice@example.com" });

    expect(res.status).toBe(201);
    expect(res.body.message).toMatch(/credential issued by worker/i);
  });

  it("should return already exists if credential exists", async () => {
    await request(app)
      .post("/issue")
      .send({ name: "Bob", email: "bob@example.com" });

    const res = await request(app)
      .post("/issue")
      .send({ name: "Bob", email: "bob@example.com" });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/already exists/i);
    expect(res.body.status).toBe("exists");
  });

  it("should return 400 if missing fields", async () => {
    const res = await request(app)
      .post("/issue")
      .send({ email: "no-name@example.com" });
    expect(res.status).toBe(400);
  });
});


