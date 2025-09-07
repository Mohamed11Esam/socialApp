import { config } from "dotenv";
import express from "express";
import bootstrap from "./app.controller";
config({ path: "./config/dev.env" });
const app = express();
const PORT = process.env.PORT;
bootstrap(app, express);
app.get("/", (_req, res) => {
  res.send("Hello from socialApp");
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${PORT}`);
});
