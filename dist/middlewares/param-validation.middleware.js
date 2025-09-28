"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidParams = void 0;
const errors_1 = require("../utils/errors");
const isValidParams = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.params);
            next();
        }
        catch (error) {
            throw new errors_1.badRequestException("Validation error", error.errors);
        }
    };
};
exports.isValidParams = isValidParams;
