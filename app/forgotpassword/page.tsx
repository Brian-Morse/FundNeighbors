"use client";
import styles from "./Forgot.module.css";
import { checkRepeatEmail } from "@/app/lib/auth";
import { useState } from "react";
import { setForgotPassword } from "@/app/lib/forgot";

export default function ForgotPassword() {
  const [error, setError] = useState("");

  return (
    <div className={styles.background}>
      <form
        className={styles.container}
        action={async (formData: FormData) => {
          const email = formData.get("email") as string;
          const exists = await checkRepeatEmail(email);
          if (!exists) {
            setError("Email not found");
          } else {
            setError("");
            // Send email
            const results = await setForgotPassword(email);
            if (results) {
              alert("You should receive an email shortly");
              window.location.href = "/";
            } else {
              alert("Error sending email");
            }
          }
        }}
      >
        <h1>Forgot Password</h1>
        <p>
          Enter your email address and we&apos;ll send you a link to reset your
          password.
        </p>
        <input
          name="email"
          type="email"
          placeholder="Email"
          className={styles.inputBox}
          required
        />
        <p className={styles.error}>{error}</p>
        <button className={styles.submitButton} type="submit">
          Send Reset Link
        </button>
      </form>
    </div>
  );
}
