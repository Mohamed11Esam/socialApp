export class AppError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = "AppError";
  }
}

export class ConflictException extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}

export class NotFoundException extends AppError {
  constructor(message: string) {
    super(message, 404);
  }
}

export class UnauthorizedException extends AppError {
  constructor(message: string) {
    super(message, 401);
  }
}

// simple async wrapper to forward errors to express error handler
export const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// express error middleware producing the requested JSON shape
export function jsonErrorHandler(err: any, _req: any, res: any, _next: any) {
  const isApp = err instanceof AppError;
  const status = isApp ? err.statusCode : 500;
  const name = isApp ? err.name : (err && err.name) || "Error";
  const message = err && err.message ? err.message : "Internal Server Error";
  const stack =
    err && err.stack ? err.stack.split("\n").map((s: string) => s.trim()) : [];

  res.status(status).json({
    error: {
      name,
      message,
      statusCode: status,
      stack,
    },
  });
}
