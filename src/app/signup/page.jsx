"use client";

import React, { useState } from "react";
import styles from "./signup.module.css";
import Navbar from "../../components/Navbar/page";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [monthlyBudget, setMonthlyBudget] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          monthlyBudget,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }
      alert("User created to DB");
      setName("");
      setEmail("");
      setMonthlyBudget("");
    } catch (error) {
      alert(error.message);
      console.log(error.message);
    }
  };
  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <form className={styles.form} onSubmit={handleSignup}>
          <h2 className={styles.title}>Sign Up</h2>

          <input
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
            placeholder="Name"
            className={styles.input}
          />

          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Email"
            className={styles.input}
          />

          <input
            type="number"
            onChange={(e) => setMonthlyBudget(e.target.value)}
            value={monthlyBudget}
            placeholder="Monthly Budget"
            className={styles.input}
          />

          <button type="submit" className={styles.button}>
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
