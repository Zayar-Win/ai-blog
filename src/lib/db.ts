import { PrismaClient } from "@/generated/prisma";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare const globalThis: {
  prisma: undefined | ReturnType<typeof prismaClientSingleton>;
} & typeof global;
const db = globalThis.prisma ?? prismaClientSingleton();

export default db;
if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
