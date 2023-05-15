import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
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
    return NextResponse.json({ data: installments }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ data: error }, { status: 400 });
  }
}

export async function POST(req: Request) {
  try {
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
    return NextResponse.json({ data: installment }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ data: error }, { status: 400 });
  }
}
