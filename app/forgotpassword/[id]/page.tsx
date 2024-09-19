"use client";
import styles from "../Forgot.module.css";
import { useState } from "react";
import { resetPassword } from "@/app/lib/forgot";

export default function ForgotPasswordID({
  params,
}: {
  params: { id: string };
}) {
  const [error, setError] = useState("");

  return (
    <div className={styles.background}>
      <form
        className={styles.container}
        action={async (formData: FormData) => {
          const password = formData.get("password") as string;
          const confirmPassword = formData.get("confirmPassword") as string;

          if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
          }

          const success = await resetPassword(params.id, password);
          if (!success) {
            setError("Failed to update password.");
            return;
          }
          setError("");
          alert("Password updated successfully.");
          window.location.href = "/login";
        }}
      >
        <h1>Forgot Password</h1>
        <p>Please choose your new password.</p>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          className={styles.inputBox}
          required
        />
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          className={styles.inputBox}
          required
        />
        <p className={styles.error}>{error}</p>
        <button className={styles.submitButton} type="submit">
          Update Password
        </button>
      </form>
    </div>
  );
}
