import 'dotenv/config';
import { PrismaClient } from '~/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const createPrismaClient = () =>
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

declare global {
  // Prevent multiple instances in dev
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db;









// import "dotenv/config";
// import { PrismaPg } from "@prisma/adapter-pg";
// import { env } from "~/env";
// import { PrismaClient } from "prisma/generated/client";

// const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });

// const createPrismaClient = () =>
// 	new PrismaClient({
// 		adapter,
// 		log:
// 			env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
// 	});

// const globalForPrisma = globalThis as unknown as {
// 	prisma: ReturnType<typeof createPrismaClient> | undefined;
// };

// export const db = globalForPrisma.prisma ?? createPrismaClient();

// if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
