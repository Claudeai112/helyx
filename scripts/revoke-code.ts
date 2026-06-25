import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

function arg(name: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split("=")[1] : undefined;
}

async function main() {
  const code = arg("code");
  const batch = arg("batch");
  if (!code && !batch) throw new Error("Pass --code=<code> or --batch=<batchId>");
  const where = code ? { code, status: "ACTIVE" as const } : { batchId: batch!, status: "ACTIVE" as const };
  const r = await prisma.prescriptionCode.updateMany({ where, data: { status: "REVOKED" } });
  console.error(`Revoked ${r.count} code(s).`);
}
main().then(() => prisma.$disconnect()).catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
