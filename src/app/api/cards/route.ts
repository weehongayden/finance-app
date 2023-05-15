import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const cards = await prisma.card.findMany({
      where: {
        user: {
          id: 1,
        },
      },
    });
    return NextResponse.json({ data: cards }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ data: error }, { status: 400 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, statementDate } = await req.json();
    const card = await prisma.card.create({
      data: {
        name,
        userId: 1,
        statementDate,
      },
    });
    return NextResponse.json({ data: card }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ data: error }, { status: 400 });
  }
}
