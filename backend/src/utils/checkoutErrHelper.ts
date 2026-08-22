// ---- Errors -----------------------------------------------------------
// Thrown with an httpStatus so the controller can map them straight to a
// response without re-deriving status codes from string matching.

export class CheckoutError extends Error {
  httpStatus: number;
  details?: unknown;

  constructor(message: string, httpStatus = 400, details?: unknown) {
    super(message);
    this.name = "CheckoutError";
    this.httpStatus = httpStatus;
    this.details = details;
  }
}
