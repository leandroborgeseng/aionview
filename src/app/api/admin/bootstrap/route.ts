import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/server/db/prisma";

function getEnv(name: string, fallback?: string) {
  const value = process.env[name];
  if (!value && fallback === undefined) {
    throw new Error(`Missing env ${name}`);
  }
  return value ?? fallback!;
}

export async function POST(req: Request) {
  const configured = process.env.CRON_SECRET;
  const provided = req.headers.get("x-cron-secret");

  if (!configured || !provided || configured !== provided) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let payload: { email?: string; password?: string } = {};
    try {
      payload = (await req.json()) as { email?: string; password?: string };
    } catch {
      // body opcional
    }

    const adminEmail =
      payload.email?.trim() || getEnv("SEED_ADMIN_EMAIL", "admin@empresa.com");
    const adminPassword =
      payload.password?.trim() || getEnv("SEED_ADMIN_PASSWORD", "admin123456");
    const companyName = getEnv("SEED_COMPANY_NAME", "Empresa Principal");
    const unitName = getEnv("SEED_UNIT_NAME", "Unidade Principal");
    const sectorName = getEnv("SEED_SECTOR_NAME", "Setor Principal");
    const workshopName = getEnv("SEED_WORKSHOP_NAME", "Oficina Principal");

    const company =
      (await prisma.company.findFirst({ where: { name: companyName } })) ??
      (await prisma.company.create({ data: { name: companyName } }));

    const unit =
      (await prisma.unit.findFirst({
        where: { companyId: company.id, name: unitName },
      })) ??
      (await prisma.unit.create({
        data: { companyId: company.id, name: unitName },
      }));

    const sector =
      (await prisma.sector.findFirst({
        where: { companyId: company.id, unitId: unit.id, name: sectorName },
      })) ??
      (await prisma.sector.create({
        data: { companyId: company.id, unitId: unit.id, name: sectorName },
      }));

    const workshop =
      (await prisma.workshop.findFirst({
        where: { companyId: company.id, unitId: unit.id, name: workshopName },
      })) ??
      (await prisma.workshop.create({
        data: { companyId: company.id, unitId: unit.id, name: workshopName },
      }));

    const systemAdminRole = await prisma.role.upsert({
      where: { name: "system_admin" },
      update: {},
      create: { name: "system_admin", description: "Administrador do sistema" },
    });

    const passwordHash = await bcrypt.hash(adminPassword, 10);
    const user = await prisma.user.upsert({
      where: { email: adminEmail },
      update: { passwordHash },
      create: { email: adminEmail, name: adminEmail, passwordHash },
    });

    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: user.id,
          roleId: systemAdminRole.id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        roleId: systemAdminRole.id,
      },
    });

    await prisma.userScope.upsert({
      where: {
        userId_scopeType_scopeId: {
          userId: user.id,
          scopeType: "company",
          scopeId: company.id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        scopeType: "company",
        scopeId: company.id,
      },
    });

    return NextResponse.json({
      ok: true,
      adminEmail,
      credentialsUpdated: true,
      companyId: company.id,
      unitId: unit.id,
      sectorId: sector.id,
      workshopId: workshop.id,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

