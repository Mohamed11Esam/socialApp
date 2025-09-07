"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = bootstrap;
const auth_controller_1 = __importDefault(require("./module/auth/auth.controller"));
const errors_1 = require("./utils/errors");
const connection_1 = require("./DB/connection");
function bootstrap(app, express) {
    app.use(express.json());
    (0, connection_1.connectDB)();
    app.use("/auth", auth_controller_1.default);
    app.use("/{*dummy}", (req, res, next) => {
        res.status(404).json({ message: "Not Found", success: false });
    });
    // global error handler (must come last)
    app.use(errors_1.jsonErrorHandler);
}
