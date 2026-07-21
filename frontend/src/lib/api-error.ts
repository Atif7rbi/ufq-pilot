export type FieldErrors = Record<string, string[]>;

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public readonly fieldErrors: FieldErrors = {}
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

export function isApiRequestError(
  error: unknown
): error is ApiRequestError {
  return error instanceof ApiRequestError;
}

export async function parseApiError(
  response: Response
): Promise<ApiRequestError> {
  try {
    const payload = (await response.json()) as {
      message?: string;
      errors?: FieldErrors;
    };

    const fieldErrors = payload.errors ?? {};
    const firstValidationError = Object.values(
      fieldErrors
    )[0]?.[0];

    return new ApiRequestError(
      firstValidationError ??
        payload.message ??
        "تعذر إكمال العملية.",
      fieldErrors
    );
  } catch {
    return new ApiRequestError("تعذر الاتصال بالخادم.");
  }
}
