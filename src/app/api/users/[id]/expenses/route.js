// commented code is , if we want to restrict users from this route if they are not logged in : 

// import { getServerSession } from "next-auth";
// import { authOptions } from "../../../auth/[...nextauth]/route";
// import { NextResponse } from "next/server";
// import { connectDB } from "../../../../../../lib/db";
// import Expense from "../../../../../../models/Expense";

// export async function GET() {
//   try {
//     await connectDB();

//     const session = await getServerSession(authOptions);
//     if (!session) {
//       return NextResponse.json(
//         { message: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const expenses = await Expense.find({
//       user: session.user.id
//     }).sort({ date: -1 });

//     return NextResponse.json(
//       { success: true, expenses },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { success: false, message: "Failed to fetch expenses" },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
import { connectDB } from "../../../../../../lib/db";
import Expense from "../../../../../../models/Expense";
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

    const expenses = await Expense.find({ user: id });

    return NextResponse.json(
      { success: true, expenses },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}



export async function POST(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid user id" },
        { status: 400 }
      );
    }

    const { title, amount, category, date } = await req.json();

    if (!title || !amount || !category || !date) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    if (title.trim().length < 3) {
      return NextResponse.json(
        { success: false, message: "Title must be at least 3 characters" },
        { status: 400 }
      );
    }

    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json(
        { success: false, message: "Amount must be greater than 0" },
        { status: 400 }
      );
    }

    if (category.trim().length < 3) {
      return NextResponse.json(
        { success: false, message: "Category is too short" },
        { status: 400 }
      );
    }

    if (isNaN(new Date(date).getTime())) {
      return NextResponse.json(
        { success: false, message: "Invalid date" },
        { status: 400 }
      );
    }

    const expense = await Expense.create({
      title: title.trim(),
      amount: parsedAmount,
      category: category.trim(),
      date: new Date(date),
      user: new mongoose.Types.ObjectId(id)
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
