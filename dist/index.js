"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app_controller_1 = __importDefault(require("./app.controller"));
const dev_config_1 = require("./config/env/dev.config");
const app = (0, express_1.default)();
const PORT = dev_config_1.devConfig.PORT;
(0, app_controller_1.default)(app, express_1.default);
app.get("/", (_req, res) => {
    res.send("Hello from socialApp");
});
app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on http://localhost:${PORT}`);
});
