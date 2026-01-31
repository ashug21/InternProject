import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import Expense from "../../../../models/Expense";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { title, amount, category, date } = await req.json();

    const expense = await Expense.create({
      title,
      amount: Number(amount),
      category,
      date,
      user: session.user.id
    });

    return NextResponse.json(
      { success: true, message: "Expense created", expense },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
