import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        user: {
          id: 1,
        },
      },
    });
    return NextResponse.json({ data: categories }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ data: error }, { status: 400 });
  }
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    const category = await prisma.category.create({
      data: {
        name,
        userId: 1,
      },
    });
    return NextResponse.json({ data: category }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ data: error }, { status: 400 });
  }
}
