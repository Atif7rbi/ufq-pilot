import type {
  Project,
  ProjectFormPayload,
  ProjectResponse,
  ProjectsResponse,
} from "@/types/project";

function getApiBaseUrl(): string {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL is not configured."
    );
  }

  return apiBaseUrl;
}

async function parseError(
  response: Response
): Promise<string> {
  try {
    const payload = (await response.json()) as {
      message?: string;
      errors?: Record<string, string[]>;
    };

    const firstValidationError = payload.errors
      ? Object.values(payload.errors)[0]?.[0]
      : null;

    return (
      firstValidationError ??
      payload.message ??
      "تعذر إكمال العملية."
    );
  } catch {
    return "تعذر الاتصال بالخادم.";
  }
}

function getHeaders(token: string): HeadersInit {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchProjects(
  token: string,
  params:
    | {
        page?: number;
        perPage?: number;
        search?: string;
        status?: string;
      }
    | number = {},
  legacyPerPage?: number
): Promise<ProjectsResponse> {
  const queryParams =
    typeof params === "number"
      ? {
          page: params,
          perPage: legacyPerPage,
        }
      : params;

  const query = new URLSearchParams({
    page: String(queryParams.page ?? 1),
    per_page: String(queryParams.perPage ?? 20),
  });

  if (queryParams.search?.trim()) {
    query.set('search', queryParams.search.trim());
  }

  if (queryParams.status) {
    query.set('status', queryParams.status);
  }

  const response = await fetch(
    `${getApiBaseUrl()}/projects?${query.toString()}`,
    {
      headers: getHeaders(token),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return (await response.json()) as ProjectsResponse;
}

export async function createProject(
  token: string,
  payload: ProjectFormPayload
): Promise<Project> {
  const response = await fetch(
    `${getApiBaseUrl()}/projects`,
    {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  const result =
    (await response.json()) as ProjectResponse;

  return result.data.project;
}

export async function updateProject(
  token: string,
  projectId: string,
  payload: Partial<ProjectFormPayload>
): Promise<Project> {
  const response = await fetch(
    `${getApiBaseUrl()}/projects/${projectId}`,
    {
      method: "PUT",
      headers: getHeaders(token),
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  const result =
    (await response.json()) as ProjectResponse;

  return result.data.project;
}

export async function deleteProject(
  token: string,
  projectId: string
): Promise<void> {
  const response = await fetch(
    `${getApiBaseUrl()}/projects/${projectId}`,
    {
      method: "DELETE",
      headers: getHeaders(token),
    }
  );

  if (!response.ok) {
    throw new Error(await parseError(response));
  }
}
