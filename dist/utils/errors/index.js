"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.badRequestException = exports.ForbiddenException = exports.UnauthorizedException = exports.NotFoundException = exports.ConflictException = exports.AppError = void 0;
exports.jsonErrorHandler = jsonErrorHandler;
class AppError extends Error {
    constructor(message, statusCode, details) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.name = "AppError";
    }
}
exports.AppError = AppError;
class ConflictException extends AppError {
    constructor(message, details) {
        super(message, 409, details);
    }
}
exports.ConflictException = ConflictException;
class NotFoundException extends AppError {
    constructor(message, details) {
        super(message, 404, details);
    }
}
exports.NotFoundException = NotFoundException;
class UnauthorizedException extends AppError {
    constructor(message, details) {
        super(message, 401, details);
    }
}
exports.UnauthorizedException = UnauthorizedException;
class ForbiddenException extends AppError {
    constructor(message, details) {
        super(message, 403, details);
    }
}
exports.ForbiddenException = ForbiddenException;
class badRequestException extends AppError {
    constructor(message, details) {
        super(message, 400, details);
    }
}
exports.badRequestException = badRequestException;
// simple async wrapper to forward errors to express error handler
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
exports.asyncHandler = asyncHandler;
// express error middleware producing the requested JSON shape
function jsonErrorHandler(err, _req, res, _next) {
    const isApp = err instanceof AppError;
    const status = isApp ? err.statusCode : 500;
    const name = isApp ? err.name : (err && err.name) || "Error";
    const message = err && err.message ? err.message : "Internal Server Error";
    const stack = err && err.stack ? err.stack.split("\n").map((s) => s.trim()) : [];
    res.status(status).json({
        error: {
            name,
            message,
            statusCode: status,
            stack,
            details: isApp ? err.details : undefined
        },
    });
}
