export interface ApiError extends Error {
  statusCode: number;
}

export function createApiError(message: string, statusCode = 500): ApiError {
  const error = new Error(message) as ApiError;

  error.name = "ApiError";
  error.statusCode = statusCode;

  return error;
}

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" && error !== null && "statusCode" in error && typeof (error as any).statusCode === "number" && (error as any).name === "ApiError"
  );
}
