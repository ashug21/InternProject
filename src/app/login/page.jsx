"use client";

import React, { useState } from "react";
import styles from "./login.module.css";
import Navbar from "@/components/Navbar/page";
import { signIn} from "next-auth/react";
import { useRouter } from "next/navigation";

const Login = () => {
    const router = useRouter();
  const [email, setEmail] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Both Fields are required");
      return;
    }

    const result = await signIn("credentials", {
      email,
      redirect: false,
    });

    if (result?.error) {
      console.log(result.error);
    } 
    else {
      alert("Logged In successfully!")
      router.push("/");
    }
  };

  return (
    <div>
        <Navbar/>
<div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />

        <button className={styles.button}>
          Continue
        </button>
      </form>
    </div>
    </div>

  );
};

export default Login;
