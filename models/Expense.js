const mongoose = require("mongoose");
const User = require("./User");

const expenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 1
  },
  category: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

expenseSchema.pre("save", async function () {
  const userExists = await User.exists({ _id: this.user });
  if (!userExists) {
    throw new Error("User does not exist");
  }
});

module.exports =
  mongoose.models.Expense || mongoose.model("Expense", expenseSchema);
