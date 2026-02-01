import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { connectDB } from "../../../../../../lib/db";
import Expense from "../../../../../../models/Expense";
import User from "../../../../../../models/User";

export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await User.findById(session.user.id).select("monthlyBudget");
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (!user.monthlyBudget) {
      return NextResponse.json(
        { success: false, message: "Monthly budget not set" },
        { status: 400 }
      );
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const monthlyExpenses = await Expense.aggregate([
      {
        $match: {
          user: user._id,
          date: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ]);

    const totalExpenses = monthlyExpenses[0]?.total || 0;

    const expenseCount = await Expense.countDocuments({
      user: user._id
    });

    return NextResponse.json(
      {
        success: true,
        totalExpenses,
        remainingBudget: user.monthlyBudget - totalExpenses,
        expenseCount
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to load summary" },
      { status: 500 }
    );
  }
}
