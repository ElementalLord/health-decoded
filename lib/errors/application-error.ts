export type ApplicationErrorCode =
  | "authorization"
  | "conflict"
  | "forbidden"
  | "not_found"
  | "unexpected"
  | "validation";

type ApplicationErrorOptions = {
  code: ApplicationErrorCode;
  message: string;
  status: number;
};

export class ApplicationError extends Error {
  readonly code: ApplicationErrorCode;
  readonly status: number;

  constructor({ code, message, status }: ApplicationErrorOptions) {
    super(message);
    this.name = "ApplicationError";
    this.code = code;
    this.status = status;
  }
}

export function authorizationError(): ApplicationError {
  return new ApplicationError({
    code: "authorization",
    message: "You need to sign in to continue.",
    status: 401,
  });
}

export function forbiddenError(): ApplicationError {
  return new ApplicationError({
    code: "forbidden",
    message: "You do not have permission to perform this action.",
    status: 403,
  });
}

export function notFoundError(): ApplicationError {
  return new ApplicationError({
    code: "not_found",
    message: "The requested resource was not found.",
    status: 404,
  });
}

export function conflictError(): ApplicationError {
  return new ApplicationError({
    code: "conflict",
    message: "The request conflicts with the current state.",
    status: 409,
  });
}

export function validationError(): ApplicationError {
  return new ApplicationError({
    code: "validation",
    message: "Please check the information and try again.",
    status: 400,
  });
}

export function unexpectedError(): ApplicationError {
  return new ApplicationError({
    code: "unexpected",
    message: "Something went wrong. Please try again.",
    status: 500,
  });
}
