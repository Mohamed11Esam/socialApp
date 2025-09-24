"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValid = void 0;
const errors_1 = require("../utils/errors");
const isValid = (schema) => {
    return (req, res, next) => {
        let data = Object.assign(Object.assign(Object.assign({}, req.body), req.params), req.query);
        const validation = schema.safeParse(data);
        if (validation.success === false) {
            let errorMessage = validation.error.issues.map((issue) => ({
                path: issue.path[0],
                message: issue.message,
            }));
            throw new errors_1.badRequestException("validation error", errorMessage);
        }
        // validation passed -> continue to next middleware / route handler
        return next();
    };
};
exports.isValid = isValid;
