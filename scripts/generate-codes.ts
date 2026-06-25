import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { buildCodeBatch } from "../lib/codes-pure";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

function arg(name: string, fallback?: string): string {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  const val = hit ? hit.split("=")[1] : undefined;
  if (val === undefined && fallback === undefined) throw new Error(`Missing --${name}`);
  return val ?? fallback!;
}

async function main() {
  const count = Number(arg("count"));
  const batchId = arg("batch");
  if (!Number.isInteger(count) || count <= 0) throw new Error("--count must be a positive integer");
  const batch = buildCodeBatch(count, batchId);
  await prisma.prescriptionCode.createMany({ data: batch });
  // CSV to stdout for handoff
  console.log("code,batchId");
  for (const b of batch) console.log(`${b.code},${b.batchId}`);
  console.error(`Created ${batch.length} codes in batch "${batchId}".`);
}
main().then(() => prisma.$disconnect()).catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
