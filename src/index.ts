import express from "express";
import bootstrap from "./app.controller";
import { devConfig } from "./config/env/dev.config";

const app = express();
const PORT = devConfig.PORT;
bootstrap(app, express);
app.get("/", (_req, res) => {
  res.send("Hello from socialApp");
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${PORT}`);
});
