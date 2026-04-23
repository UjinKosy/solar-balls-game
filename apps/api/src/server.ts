import { createApp } from "./app.js";

const host = process.env.API_HOST ?? "0.0.0.0";
const port = Number(process.env.API_PORT ?? "3000");

const app = createApp();

async function start(): Promise<void> {
  try {
    await app.listen({ host, port });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

void start();
