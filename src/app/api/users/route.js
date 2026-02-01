import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import User from "../../../../models/User";

export async function POST(req) {
  try {
    await connectDB();

    const { name, email, monthlyBudget } = await req.json();

    if (!name || !email || !monthlyBudget) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    if (name.trim().length < 3) {
      return NextResponse.json(
        { success: false, message: "Name is too short" },
        { status: 400 }
      );
    }

    const budget = Number(monthlyBudget);
    if (isNaN(budget) || budget <= 0) {
      return NextResponse.json(
        { success: false, message: "Monthly budget must be greater than 0" },
        { status: 400 }
      );
    }

    const user = await User.create({
      name: name.trim(),
      email: email.trim(),
      monthlyBudget: budget
    });

    return NextResponse.json(
      { success: true, message: "User created successfully", user },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to create user" },
      { status: 500 }
    );
  }
}
