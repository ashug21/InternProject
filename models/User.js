const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  monthlyBudget: {
    type: Number,
    required: true,
    min: 1
  }
});

module.exports =
  mongoose.models.User || mongoose.model("User", userSchema);
