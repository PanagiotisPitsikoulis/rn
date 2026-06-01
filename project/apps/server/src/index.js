import { env } from "./config/env.js";
import { store } from "./db/store.js";
import { createApp } from "./app.js";

const app = createApp();

app.listen(env.port, env.host, () => {
  console.log(`Expo starter API listening on http://${env.host}:${env.port} (${store.mode} mode)`);
});
