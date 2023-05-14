import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const card = await prisma.card.findMany({
    where: {
      user: {
        id: 1,
      },
    },
  });
  return NextResponse.json(card);
}

export async function POST(req: Request) {
  const { name, statementDate } = await req.json();
  const card = await prisma.card.create({
    data: {
      name,
      userId: 1,
      statementDate,
    },
  });
  return NextResponse.json(card);
}
