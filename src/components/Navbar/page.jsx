"use client";

import styles from './navbar.module.css'
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();

  const logoutUser = async () => {
    signOut();
  };

  if(!session){
    return (
      <nav className={styles.navbar}>
        <div className={styles.logo}>Intern Project</div>
        <div className={styles.links}>
          <Link href="/">Home</Link>
          <Link href="/expenses">Expense</Link>
          <Link href="/signup">SignUp</Link>
          <Link href="/login">Login</Link>
        </div>
      </nav>
    );
  }

  else{
    return (
      <nav className={styles.navbar}>
        <div className={styles.logo}>Intern Project</div>
        <div className={styles.links}>
          <Link href="/">Home</Link>
          <Link href="/expenses">Expense</Link>
          <button onClick={logoutUser}>Logout</button>
        </div>
      </nav>
    );
  }
 
};

export default Navbar;
