import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const installments = await prisma.installment.findMany({
    orderBy: [
      {
        card: {
          name: "asc",
        },
      },
      {
        leftoverTenure: "asc",
      },
    ],
    include: {
      user: true,
      card: true,
    },
  });
  return NextResponse.json(installments);
}

export async function POST(req: Request) {
  const {
    name,
    card,
    tenure,
    startDate,
    amount,
    endDate,
    leftoverTenure,
    payPerMonth,
  } = await req.json();
  try {
    const installment = await prisma.installment.create({
      data: {
        name,
        tenure,
        leftoverTenure,
        startDate,
        endDate,
        amount,
        payPerMonth,
        userId: 1,
        cardId: card,
      },
    });
    return NextResponse.json(installment);
  } catch (error) {
    return NextResponse.json(error);
  }
}
