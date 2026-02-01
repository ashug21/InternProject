import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import Expense from "../../../../models/Expense";

export async function POST(req) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" },{ status: 401 });
    }

    const { title, amount, category, date } = await req.json();

    if (!title || !amount || !category || !date) {
      return NextResponse.json({ success: false, message: "All fields are required" },{ status: 400 });
    }

    if (title.trim().length < 3) {
      return NextResponse.json({ success: false, message: "Title must be at least 3 characters" },{ status: 400 });
    }


    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json({ success: false, message: "Amount must be greater than 0" },{ status: 400 }
      );
    }

    if (category.trim().length < 3) {
      return NextResponse.json({ success: false, message: "Category is too short" },{ status: 400 });
    }

    if (isNaN(new Date(date).getTime())) {
      return NextResponse.json({ success: false, message: "Invalid date" },{ status: 400 });
    }

    const expense = await Expense.create({
      title: title.trim(),
      amount: parsedAmount,
      category: category.trim(),
      date,
      user: session.user.id
    });

    return NextResponse.json({ success: true, message: "Expense created", expense },{ status: 201 });
  } 
  catch (error) {
    
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to add expense" },{ status: 500 });
  }
}
