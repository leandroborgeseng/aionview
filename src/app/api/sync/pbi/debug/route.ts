import { NextResponse } from "next/server";

import { getEnabledPbiEndpoints } from "@/server/integrations/pbi/endpoints";
import { applyPbiEndpointQuery, resolvePbiPath } from "@/server/sync/pbi/path-resolver";

function authorized(req: Request) {
  const configured = process.env.CRON_SECRET;
  const url = new URL(req.url);
  const provided = req.headers.get("x-cron-secret") ?? url.searchParams.get("secret");
  return Boolean(configured && provided && configured === provided);
}

type ProbeResult = {
  endpoint: string;
  url: string;
  apiKeyEnv: string;
  apiKeyConfigured: boolean;
  status: number | null;
  ok: boolean;
  bodySnippet?: string;
  error?: string;
};

export async function GET(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const probe = url.searchParams.get("probe") === "1";
  const baseUrl = (process.env.PBI_BASE_URL ?? "").replace(/\/+$/, "");

  const enabledEndpoints = getEnabledPbiEndpoints();
  const resolved = enabledEndpoints.map((ep) => {
    const resolvedPath = resolvePbiPath(ep.path, ep.pathEnv);
    const pathWithQuery = applyPbiEndpointQuery(ep.key, resolvedPath);
    const fullUrl = `${baseUrl}${pathWithQuery.startsWith("/") ? pathWithQuery : `/${pathWithQuery}`}`;
    return {
      endpoint: ep.key,
      defaultPath: ep.path,
      pathEnv: ep.pathEnv,
      resolvedPath: pathWithQuery,
      fullUrl,
      apiKeyEnv: ep.apiKeyEnv,
      apiKeyConfigured: Boolean(process.env[ep.apiKeyEnv] ?? process.env.PBI_API_KEY),
    };
  });

  if (!probe) {
    return NextResponse.json(
      {
        ok: true,
        baseUrl,
        usingFallbackApiKey: Boolean(process.env.PBI_API_KEY),
        enabledCount: enabledEndpoints.length,
        endpoints: resolved,
      },
      { status: 200 },
    );
  }

  const results: ProbeResult[] = [];
  for (const ep of resolved) {
    try {
      const apiKey = process.env[ep.apiKeyEnv] ?? process.env.PBI_API_KEY ?? "";
      const isOficinaEndpoint = ep.endpoint === "oficina";
      const headers: Record<string, string> = {
        Accept: "application/json",
      };
      if (isOficinaEndpoint) {
        headers["API-KEY"] = apiKey;
      } else {
        headers["X-API-KEY"] = apiKey;
      }
      const response = await fetch(ep.fullUrl, {
        method: "GET",
        headers,
      });

      let bodyText = "";
      try {
        bodyText = await response.text();
      } catch {
        bodyText = "";
      }

      results.push({
        endpoint: ep.endpoint,
        url: ep.fullUrl,
        apiKeyEnv: ep.apiKeyEnv,
        apiKeyConfigured: ep.apiKeyConfigured,
        status: response.status,
        ok: response.ok,
        bodySnippet: bodyText.slice(0, 300),
      });
    } catch (err) {
      results.push({
        endpoint: ep.endpoint,
        url: ep.fullUrl,
        apiKeyEnv: ep.apiKeyEnv,
        apiKeyConfigured: ep.apiKeyConfigured,
        status: null,
        ok: false,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  return NextResponse.json(
    {
      ok: true,
      baseUrl,
      probe: true,
      results,
    },
    { status: 200 },
  );
}

