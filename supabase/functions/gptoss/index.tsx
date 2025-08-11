// This file is deprecated - AI endpoint is now at /functions/v1/make-server-4f36f0d0/gptoss
// This edge function will redirect to the main server

import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";

const app = new Hono();

app.use("/*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization", "apikey"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

// Redirect to main server
app.all("*", (c) => {
  return c.json({
    ok: false,
    error: "This endpoint is deprecated. Use /functions/v1/make-server-4f36f0d0/gptoss instead.",
    redirect: "/functions/v1/make-server-4f36f0d0/gptoss"
  }, 301);
});

Deno.serve(app.fetch);