import request from "supertest";
import app from "../src/app";
import { db } from "../src/db";
import { describe, it, beforeEach, expect, jest } from "@jest/globals";
import axios from "axios";
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

it("should verify an existing credential", async () => {
  const credential = { id: "abc123", name: "Alice", email: "alice@example.com" };

  mockedAxios.post.mockResolvedValueOnce({ data: { exists: true } });

  const res = await request(app)
    .post("/verify")
    .send(credential);

  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("verifiedAt");
  expect(res.body.status).toBe("verified");
});

it("should return not found for unissued credentials", async () => {
  const credential = { id: "unknown123", name: "Unknown", email: "noone@example.com" };

  mockedAxios.post.mockResolvedValueOnce({ data: { exists: false } });

  const res = await request(app)
    .post("/verify")
    .send(credential);

  expect(res.status).toBe(404);
  expect(res.body.message).toMatch(/not found/i);
  expect(res.body.error).toMatch(/not found/i);
});

