import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(req: Request) {
  const { pathname } = new URL(req.url);
  const splitPath = pathname.split("/");
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
    const installment = await prisma.installment.update({
      where: {
        id: Number(splitPath[splitPath.length - 1]),
      },
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
    return NextResponse.json(
      {
        data: error,
      },
      { status: 400 }
    );
  }
}

export async function DELETE(req: Request) {
  const { pathname } = new URL(req.url);
  const splitPath = pathname.split("/");
  try {
    const installment = await prisma.installment.delete({
      where: {
        id: Number(splitPath[splitPath.length - 1]),
      }
    });
    return NextResponse.json(installment);
  } catch (error) {
    return NextResponse.json(
      {
        data: error,
      },
      { status: 400 }
    );
  }
}