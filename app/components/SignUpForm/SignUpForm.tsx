"use client";
import React, { useState } from "react";
import styles from "./SignUpForm.module.css";
import { useRouter } from "next/navigation";
import { signup, checkRepeatEmail } from "../../lib/auth";
import { format } from "path";

const SignUpForm = () => {
  const [error, setError] = useState("");
  const router = useRouter();

  const formatPhoneNumber = (value: string | undefined) => {
    // Remove all non-digit characters
    if (!value) {
      return false;
    }
    const cleaned = value.replace(/\D/g, "");
    // Format the cleaned number as XXX-XXX-XXXX
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return false;
  };

  return (
    <div className={styles.signupWrapper}>
      <form
        className={styles.form}
        action={async (formData: FormData) => {
          const password = formData.get("password")?.toString();
          const cpassword = formData.get("cpassword")?.toString();
          const email = formData.get("email")?.toString().toLowerCase();
          const phone = formData.get("phone")?.toString();
          // Format the phone number
          if (phone !== "") {
            const formatPhone = formatPhoneNumber(phone);
            if (formatPhone === false) {
              setError("Invalid phone number. Use format XXX-XXX-XXXX");
              return;
            } else {
              formData.set("phone", formatPhone as string);
            }
          }
          if (password !== cpassword) {
            setError("Passwords do not match");
          } else if (await checkRepeatEmail(email)) {
            setError("Email is already in use");
          } else {
            signup(formData);
            alert(
              "Account created successfully! Check email to confirm account before use."
            );
            router.push("/");
          }
        }}
      >
        <h1>Sign Up!</h1>
        <p>Enter your information below to create an account.</p>
        <label htmlFor="firstName">First Name:</label>
        <input
          className={styles.inputBox}
          type="text"
          id="firstName"
          name="firstName"
          required
        />
        <label htmlFor="lastName">Last Name:</label>
        <input
          className={styles.inputBox}
          type="text"
          id="lastName"
          name="lastName"
          required
        />
        <label htmlFor="email">Email:</label>
        <input
          className={styles.inputBox}
          type="email"
          id="email"
          name="email"
          required
        />
        <label htmlFor="phone">Phone:</label>
        <input className={styles.inputBox} type="tel" id="phone" name="phone" />
        <label htmlFor="password">Password:</label>
        <input
          className={styles.inputBox}
          type="password"
          id="password"
          name="password"
          required
        />
        <label htmlFor="cpassword">Confirm Password:</label>
        <input
          className={styles.inputBox}
          type="password"
          id="cpassword"
          name="cpassword"
          required
        />
        <p className={styles.error}>{error}</p>
        <div>
          <button className={styles.submitButton} type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
