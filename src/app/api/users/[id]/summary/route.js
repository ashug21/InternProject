// commented code is , if we want to restrict users from this route if they are not logged in : 

// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "../../../auth/[...nextauth]/route";
// import { connectDB } from "../../../../../../lib/db";
// import Expense from "../../../../../../models/Expense";
// import User from "../../../../../../models/User";

// export async function GET() {
//   try {
//     await connectDB();

//     const session = await getServerSession(authOptions);
//     if (!session?.user?.id) {
//       return NextResponse.json(
//         { success: false, message: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const user = await User.findById(session.user.id).select("monthlyBudget");
//     if (!user) {
//       return NextResponse.json(
//         { success: false, message: "User not found" },
//         { status: 404 }
//       );
//     }

//     if (!user.monthlyBudget) {
//       return NextResponse.json(
//         { success: false, message: "Monthly budget not set" },
//         { status: 400 }
//       );
//     }

//     const now = new Date();
//     const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

//     const monthlyExpenses = await Expense.aggregate([
//       {
//         $match: {
//           user: user._id,
//           date: { $gte: startOfMonth }
//         }
//       },
//       {
//         $group: {
//           _id: null,
//           total: { $sum: "$amount" }
//         }
//       }
//     ]);

//     const totalExpenses = monthlyExpenses[0]?.total || 0;

//     const expenseCount = await Expense.countDocuments({
//       user: user._id
//     });

//     return NextResponse.json(
//       {
//         success: true,
//         totalExpenses,
//         remainingBudget: user.monthlyBudget - totalExpenses,
//         expenseCount
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { success: false, message: "Failed to load summary" },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
import { connectDB } from "../../../../../../lib/db";
import Expense from "../../../../../../models/Expense";
import User from "../../../../../../models/User";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid user id" },
        { status: 400 }
      );
    }

    const userId = new mongoose.Types.ObjectId(id);

    const user = await User.findById(userId).select("monthlyBudget");
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const expenses = await Expense.find({ user: userId });

    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    return NextResponse.json(
      {
        success: true,
        totalExpenses,
        remainingBudget: user.monthlyBudget - totalExpenses,
        expenseCount: expenses.length
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
