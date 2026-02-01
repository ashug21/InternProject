"use client";

import { useEffect, useState } from "react";
import styles from "./summary.module.css";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar/page";

const Summary = () => {
  const [data, setData] = useState(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user?.id){
        return;
      }

      const fetchSummary = async () => {
        try {
          const res = await fetch(`/api/users/${session.user.id}/summary`);
          const result = await res.json();
      
          if (!res.ok) {
            throw new Error(result.message || "Failed to load summary");
          }
      
          setData(result);
        } catch (error) {
          alert(error.message);
        }
      };
      
    fetchSummary();
  }, []);

  if (!data) {
    <Navbar/>
    return (
        <div>
            <Navbar/>
  <div className={styles.loading}>No summary...</div>
        </div>
  
    );
  }

  return (
    <div>
<Navbar/>

    <div className={styles.container}>
      <h2 className={styles.heading}>Monthly Summary</h2>
      <br/>

      <h3 className={styles.cardheading3}> Initial Budget : {data.totalExpenses + data.remainingBudget}</h3>
      <br/>
      <div className={styles.cards}>
        <div className={styles.card}>
          <p className={styles.label}>Total Spent</p>
          <h3 className={styles.value}>₹{data.totalExpenses}</h3>
        </div>

        <div className={styles.card}>
          <p className={styles.label}>Remaining Budget</p>
          <h3 className={styles.value}>₹{data.remainingBudget}</h3>
        </div>

        <div className={styles.card}>
          <p className={styles.label}>Expenses Added</p>
          <h3 className={styles.value}>{data.expenseCount}</h3>
        </div>
      </div>
    </div>


    </div>
  
  );
};

export default Summary;
