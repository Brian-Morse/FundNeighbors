"use client";
import Link from "next/link";
import React, { useState } from "react";
import styles from "./LoginForm.module.css";
import { login } from "../../lib/auth";

const LoginForm = () => {
  // Set up error and router for the page
  const [error, setError] = useState("");
  return (
    <div className={styles.loginWrapper}>
      <form
        className={styles.form}
        action={async (formData: FormData) => {
          const results = await login(formData);
          if (!results.success) {
            setError(results.message);
          } else {
            setError("");
            window.location.href = "/";
          }
        }}
      >
        <h1>Login</h1>
        <label>
          <p>Email:</p>
          <input
            className={styles.inputBox}
            type="email"
            name="email"
            autoComplete="email"
            required
          />
        </label>
        <label>
          <p>Password:</p>
          <input
            className={styles.inputBox}
            type="password"
            name="password"
            autoComplete="current-password"
            required
          />
        </label>
        <p className={styles.error}>{error}</p>
        <div>
          <button className={styles.submitButton} type="submit">
            Submit
          </button>
        </div>
        <p>
          If you do not have an account, sign up{" "}
          <Link href="/signup">here</Link>
        </p>
        <Link href="/forgotpassword">Forgot Password?</Link>
      </form>
    </div>
  );
};

export default LoginForm;
