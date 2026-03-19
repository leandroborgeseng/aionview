import bcrypt from "bcryptjs";

import { prisma } from "@/server/db/prisma";

type Env = Record<string, string | undefined>;

function env(name: string, fallback?: string) {
  const value = process.env[name];
  if (!value && fallback === undefined) throw new Error(`Missing env: ${name}`);
  return value ?? fallback!;
}

async function getOrCreateCompany() {
  const companyName = env("SEED_COMPANY_NAME", "Empresa Principal");
  const unitName = env("SEED_UNIT_NAME", "Unidade Principal");
  const sectorName = env("SEED_SECTOR_NAME", "Setor Principal");
  const workshopName = env("SEED_WORKSHOP_NAME", "Oficina Principal");

  let company = await prisma.company.findFirst({ where: { name: companyName } });
  if (!company) {
    company = await prisma.company.create({ data: { name: companyName } });
  }

  let unit = await prisma.unit.findFirst({
    where: { companyId: company.id, name: unitName },
  });
  if (!unit) {
    unit = await prisma.unit.create({ data: { companyId: company.id, name: unitName } });
  }

  let sector = await prisma.sector.findFirst({
    where: { companyId: company.id, unitId: unit.id, name: sectorName },
  });
  if (!sector) {
    sector = await prisma.sector.create({
      data: { companyId: company.id, unitId: unit.id, name: sectorName },
    });
  }

  let workshop = await prisma.workshop.findFirst({
    where: { companyId: company.id, unitId: unit.id, name: workshopName },
  });
  if (!workshop) {
    workshop = await prisma.workshop.create({
      data: { companyId: company.id, unitId: unit.id, name: workshopName },
    });
  }

  return { company, unit, sector, workshop };
}

async function main() {
  const adminEmail = env("SEED_ADMIN_EMAIL");
  const adminPassword = env("SEED_ADMIN_PASSWORD");

  const { company } = await getOrCreateCompany();

  const roles = [
    "nursing_sector_user",
    "sector_manager",
    "technician",
    "workshop_supervisor",
    "clinical_engineering_manager",
    "purchases_user",
    "admin_user",
    "quality_user",
    "executive_user",
    "system_admin",
  ];

  const permissions = [
    "dashboard.view",
    "equipments.view",
    "inventory.view",
    "service_orders.view",
    "preventives.view",
    "availability.view",
    "mel.view",
    "obsolescence.view",
    "backups.view",
    "contracts.view",
    "purchases.view",
    "investments.view",
    "transparency.view",
    "configurations.view",
    "admin.users.manage",
    "admin.lockRules.manage",
    "admin.checklists.manage",
  ];

  const roleRecords = [];
  for (const r of roles) {
    const createdOrExisting = await prisma.role.upsert({
      where: { name: r },
      update: {},
      create: { name: r },
    });
    roleRecords.push(createdOrExisting);
  }

  const permRecords = [];
  for (const p of permissions) {
    const createdOrExisting = await prisma.permission.upsert({
      where: { key: p },
      update: {},
      create: { key: p },
    });
    permRecords.push(createdOrExisting);
  }

  // Vincula permissions às roles
  const systemAdminRole = roleRecords.find((r) => r.name === "system_admin");
  if (!systemAdminRole) throw new Error("system_admin role not found");

  for (const perm of permRecords) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: systemAdminRole.id, permissionId: perm.id } },
      update: {},
      create: { roleId: systemAdminRole.id, permissionId: perm.id },
    });
  }

  // Admin user
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  const user = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: { email: adminEmail, passwordHash, name: adminEmail },
  });

  // user_scopes (company scope)
  const systemAdmin = systemAdminRole;
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: user.id, roleId: systemAdmin.id } },
    update: {},
    create: { userId: user.id, roleId: systemAdmin.id },
  });

  await prisma.userScope.upsert({
    where: { userId_scopeType_scopeId: { userId: user.id, scopeType: "company", scopeId: company.id } },
    update: {},
    create: { userId: user.id, scopeType: "company", scopeId: company.id },
  });

  // Templates de checklist (seed mínimo)
  const checklistTemplates = [
    { type: "inventario" as const, title: "Inventário - Conferência de Equipamentos" },
    { type: "preventiva" as const, title: "Preventiva - Checklist Operacional" },
    { type: "calibracao" as const, title: "Calibração - Checklist Técnico" },
    { type: "tse" as const, title: "TSE - Checklist de Segurança" },
  ];

  for (const t of checklistTemplates) {
    // title não é unique, então usamos findFirst
    const existing = await prisma.checklistTemplate.findFirst({
      where: { companyId: company.id, type: t.type, title: t.title },
    });
    if (!existing) {
      await prisma.checklistTemplate.create({
        data: {
          companyId: company.id,
          type: t.type,
          title: t.title,
          schemaJson: {},
        },
      });
    }
  }

  // Regras base para classificação de lock (estrutura pronta, engine será implementada depois)
  const classificationRules = [
    {
      name: "aguardando_compra - pendencia relacionada a compra",
      category: "aguardando_compra",
      match: { pendencia: ["compra", "orçamento", "cotação"] },
    },
    {
      name: "aguardando_calibracao - pendencia relacionada a calibração",
      category: "aguardando_calibracao",
      match: { pendencia: ["calibracao", "calibração"] },
    },
    {
      name: "em_execucao - OS em andamento",
      category: "em_execucao",
      match: { status: ["em_andamento", "aguardando"] },
    },
  ];

  for (const r of classificationRules) {
    const existing = await prisma.classificationRule.findFirst({
      where: { companyId: company.id, name: r.name },
    });
    if (existing) continue;

    await prisma.classificationRule.create({
      data: {
        companyId: company.id,
        name: r.name,
        enabled: true,
        priority: 100,
        ruleJson: r,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

