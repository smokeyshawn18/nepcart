import { createApp } from "./app";
import { getEnv } from "./config/env";
import keepAliveCron from "./config/cron";

export function startServer() {
  const env = getEnv();
  const app = createApp();

  const server = app.listen(env.PORT, () => {
    console.log("Listening on port:", env.PORT);
    if (env.NODE_ENV === "production") {
      keepAliveCron.start();
    }
  });

  return server;
}
