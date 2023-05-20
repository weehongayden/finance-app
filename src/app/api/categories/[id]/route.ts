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
    return NextResponse.json({ data: installment }, { status: 200 });
  } catch (error) {
    console.error("Installment PUT API: ", error);
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
    const category = await prisma.category.delete({
      where: {
        id: Number(splitPath[splitPath.length - 1]),
      },
    });
    return NextResponse.json({ data: category }, { status: 200 });
  } catch (error) {
    console.error("Category DELETE API: ", error);
    return NextResponse.json(
      {
        data: error,
      },
      { status: 400 }
    );
  }
}
