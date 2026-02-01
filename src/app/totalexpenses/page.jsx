"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar/page";
import styles from "./total.module.css";

const ExpensesList = () => {
  const { data: session } = useSession();
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    if (!session?.user?.id){
      return;
    }

    const fetchExpenses = async () => {
      try {
        const res = await fetch(
          `/api/users/${session.user.id}/expenses`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch expenses");
        }

        setExpenses(data.expenses);
      } catch (error) {
        alert(error.message);
      }
    };

    fetchExpenses();
  }, [session]);

  return (
    <div>
      <Navbar />
<div className={styles.page}>
      
      <h2 className={styles.heading}>Your Expenses</h2>

      {expenses.length === 0 && (
        <p className={styles.empty}>No expenses found</p>
      )}

      <div className={styles.list}>
        {expenses.map((expense) => (
          <div key={expense._id} className={styles.card}>
            <p className={styles.title}>
              <strong>{expense.title}</strong>
            </p>
            <p className={styles.text}>Amount: ₹{expense.amount}</p>
            <p className={styles.text}>Category: {expense.category}</p>
            <p className={styles.date}>
              Date: {new Date(expense.date).toLocaleDateString()}
            </p>
            <hr className={styles.divider} />
          </div>
        ))}
      </div>
    </div>
    </div>
    
  );
};

export default ExpensesList;
