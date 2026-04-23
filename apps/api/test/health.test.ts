import test from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../src/app.js";

test("GET /health returns ok payload", async () => {
  const app = createApp();
  const response = await app.inject({
    method: "GET",
    url: "/health",
  });

  assert.equal(response.statusCode, 200);

  const payload = response.json() as {
    status: string;
    service: string;
    timestamp: string;
  };

  assert.equal(payload.status, "ok");
  assert.equal(payload.service, "api");
  assert.ok(typeof payload.timestamp === "string");

  await app.close();
});
