import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const installments = await prisma.installment.findMany();
  return NextResponse.json(installments);
}
