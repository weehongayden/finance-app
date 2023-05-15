import { PrismaClient } from "@prisma/client";
import moment from "moment";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const installments = await prisma.installment.findMany({
    where: {
      isActive: true,
    },
    include: {
      user: true,
      card: true,
    },
  });

  const today = moment().startOf("day");

  try {
    for (const installment of installments) {
      if (today.date() === installment.card.statementDate) {
        const leftoverTenure = installment.leftoverTenure - 1;
        await prisma.installment.update({
          where: {
            id: installment.id,
          },
          data: {
            leftoverTenure: leftoverTenure,
            isActive: leftoverTenure > 0 ? true : false,
            updatedAt: new Date(),
          },
        });
      }
    }
    return NextResponse.json(
      {
        message: "Cron job has been executed successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ data: error }, { status: 400 });
  }
}
