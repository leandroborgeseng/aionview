import { prisma } from "@/server/db/prisma";

export async function getLatestPayloadByEndpoint(endpoint: string) {
  const row = await prisma.rawApiPayload.findFirst({
    where: { endpoint, status: "success" },
    orderBy: { receivedAt: "desc" },
    select: { payload: true, receivedAt: true, syncRunId: true },
  });

  return row ?? null;
}

