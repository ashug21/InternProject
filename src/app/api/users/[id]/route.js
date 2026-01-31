import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";
import User from "../../../../../models/User";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid user id" },{ status: 400 }
      );
    }

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" },{ status: 404 });
    }

    return NextResponse.json({ success: true, message : "User found" , user },{ status: 200});
  }
   catch (error) {
    return NextResponse.json({ success: false, message: error.message },{ status: 500 });
  }
}
