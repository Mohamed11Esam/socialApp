"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = bootstrap;
const errors_1 = require("./utils/errors");
const DB_1 = require("./DB");
const module_1 = require("./module");
function bootstrap(app, express) {
    app.use(express.json());
    (0, DB_1.connectDB)();
    app.use("/auth", module_1.authRouter);
    app.use("/user", module_1.userRouter);
    app.use("/{*dummy}", (req, res, next) => {
        res.status(404).json({ message: "Not Found", success: false });
    });
    // global error handler (must come last)
    app.use(errors_1.jsonErrorHandler);
}
