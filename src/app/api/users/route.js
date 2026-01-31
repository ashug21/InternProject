import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import User from "../../../../models/User";

export async function POST(req) {
  try {
    await connectDB();

    const { name, email, monthlyBudget } = await req.json();

    if (!name || !email || !monthlyBudget) {
      
      return NextResponse.json({ success: false, message: "All fields are required" },{ status: 400 });
    }

    const user = await User.create({ name, email, monthlyBudget });

    return NextResponse.json({ success: true, message: "User created successfully", user },{ status: 201 });
  } 
  catch (error) {
    return NextResponse.json({ success: false, message: error.message },{ status: 500 });
  }
}
