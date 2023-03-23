import { PrismaClient } from '@prisma/client';

interface PrismaNodeJsGlobal extends Global {
  prisma: PrismaClient | null;
}

declare const global: PrismaNodeJsGlobal;

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') global.prisma = prisma;
