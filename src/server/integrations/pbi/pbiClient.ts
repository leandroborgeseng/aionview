export type PbiResponse = unknown;

export class PbiClientError extends Error {
  public status?: number;
  public body?: unknown;

  constructor(message: string, opts?: { status?: number; body?: unknown }) {
    super(message);
    this.name = "PbiClientError";
    this.status = opts?.status;
    this.body = opts?.body;
  }
}

function getBaseUrl() {
  const baseUrl = process.env.PBI_BASE_URL;
  if (!baseUrl) throw new Error("Missing env PBI_BASE_URL");
  return baseUrl.replace(/\/+$/, "");
}

function getApiKey(apiKeyEnv?: string) {
  const fromEndpoint = apiKeyEnv ? process.env[apiKeyEnv] : undefined;
  const apiKey = fromEndpoint ?? process.env.PBI_API_KEY ?? process.env.EFFORT_API_KEY;
  if (!apiKey) {
    if (apiKeyEnv) {
      throw new Error(`Missing env ${apiKeyEnv} (or fallback PBI_API_KEY / EFFORT_API_KEY)`);
    }
    throw new Error("Missing env PBI_API_KEY (or EFFORT_API_KEY)");
  }
  return apiKey;
}

export async function pbiGet<T = PbiResponse>(path: string, opts?: { apiKeyEnv?: string }): Promise<T> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  const apiKey = getApiKey(opts?.apiKeyEnv);
  const normalizedPath = path.toLowerCase();
  const isOficinaEndpoint = normalizedPath.includes("/oficina");

  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  // Compatibilidade com cliente legado: /oficina usa API-KEY; demais usam X-API-KEY.
  if (isOficinaEndpoint) {
    headers["API-KEY"] = apiKey;
  } else {
    headers["X-API-KEY"] = apiKey;
  }

  const res = await fetch(url, {
    method: "GET",
    headers,
  });

  if (!res.ok) {
    let body: unknown = undefined;
    try {
      body = await res.clone().json();
    } catch {
      body = await res.text();
    }
    throw new PbiClientError(`PBI GET failed: ${path}`, { status: res.status, body });
  }

  return (await res.json()) as T;
}

