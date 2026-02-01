import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { connectDB } from "../../../../../../lib/db";
import Expense from "../../../../../../models/Expense";

export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const expenses = await Expense.find({
      user: session.user.id
    }).sort({ date: -1 });

    return NextResponse.json(
      { success: true, expenses },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}
