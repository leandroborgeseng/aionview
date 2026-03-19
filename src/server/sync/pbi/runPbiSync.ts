import { prisma } from "@/server/db/prisma";
import { PbiClientError, pbiGet } from "@/server/integrations/pbi/pbiClient";
import { pbiEndpoints, type PbiEndpointKey } from "@/server/integrations/pbi/endpoints";
import type { Prisma } from "@prisma/client";

async function getDefaultCompanyId(): Promise<string | null> {
  const fromEnv = process.env.DEFAULT_COMPANY_ID;
  if (fromEnv) return fromEnv;

  const first = await prisma.company.findFirst({ select: { id: true } });
  return first?.id ?? null;
}

export type PbiSyncResult = {
  syncRunId: string;
  status: "success" | "error";
  errors: Array<{ endpoint: PbiEndpointKey; message: string }>;
};

export async function runPbiSync(): Promise<PbiSyncResult> {
  const companyId = await getDefaultCompanyId();

  const syncRun = await prisma.syncRun.create({
    data: {
      companyId,
      status: "running",
      summary: "Iniciando sincronização PBI",
    },
  });

  const errors: Array<{ endpoint: PbiEndpointKey; message: string }> = [];

  for (const ep of pbiEndpoints) {
    try {
      const payload = await pbiGet(ep.path, { apiKeyEnv: ep.apiKeyEnv });

      const payloadJson = payload as Prisma.InputJsonValue;
      await prisma.rawApiPayload.create({
        data: {
          syncRunId: syncRun.id,
          companyId,
          endpoint: ep.key,
          status: "success",
          requestMeta: {
            path: ep.path,
            apiKeyEnv: ep.apiKeyEnv,
            apiKeyConfigured: Boolean(process.env[ep.apiKeyEnv] ?? process.env.PBI_API_KEY),
          },
          payload: payloadJson,
        },
      });

      // Normalização e atualização de entidades (equipamentos/OS/métricas) virão aqui
      // no próximo passo incremental, mantendo o job tolerante a falhas.
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      const status = err instanceof PbiClientError ? err.status : undefined;
      const body = err instanceof PbiClientError ? err.body : undefined;
      const bodyForJson =
        body === undefined
          ? null
          : typeof body === "string"
          ? body
          : JSON.parse(JSON.stringify(body));
      const bodyText =
        body === undefined
          ? ""
          : ` body=${JSON.stringify(body).slice(0, 400)}`;
      const detailedMessage = status
        ? `${message} [status=${status}]${bodyText}`
        : `${message}${bodyText}`;

      errors.push({ endpoint: ep.key, message: detailedMessage });

      await prisma.rawApiPayload.create({
        data: {
          syncRunId: syncRun.id,
          companyId,
          endpoint: ep.key,
          status: "error",
          requestMeta: {
            path: ep.path,
            apiKeyEnv: ep.apiKeyEnv,
            apiKeyConfigured: Boolean(process.env[ep.apiKeyEnv] ?? process.env.PBI_API_KEY),
            httpStatus: status ?? null,
          },
          payload: { error: true, message: detailedMessage, status, body: bodyForJson },
          errorMessage: detailedMessage,
        },
      });
    }
  }

  const finalStatus: "success" | "error" = errors.length ? "error" : "success";

  await prisma.syncRun.update({
    where: { id: syncRun.id },
    data: {
      status: finalStatus,
      endedAt: new Date(),
      summary: finalStatus === "success" ? "Sincronização concluída com sucesso" : "Sincronização concluída com erros",
      error: errors.length ? JSON.stringify(errors).slice(0, 4000) : null,
    },
  });

  return { syncRunId: syncRun.id, status: finalStatus, errors };
}

