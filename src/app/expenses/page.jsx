"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar/page";
import styles from "./expenses.module.css";

const ExpenseForm = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session) {
      alert("Please login to add expense");
      router.push("/login");
      return;
    }

    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          amount,
          category,
          date
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add expense");
      }

      alert("Expense added successfully");

      setTitle("");
      setAmount("");
      setCategory("");
      setDate("");
    } catch (err) {
      alert(err.message);
      console.error(err);
    }
  };

  return (
    <div>
      <Navbar />

      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.heading}>Add Expense</h2>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Amount"
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <button type="submit">Save Expense</button>
      </form>
    </div>
  );
};

export default ExpenseForm;
