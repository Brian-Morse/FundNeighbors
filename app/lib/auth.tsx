"use server";
import db from "./db";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

export interface User {
  email: string;
  phone: string;
  name: string;
  id: number;
}

const key = new TextEncoder().encode(process.env.AUTH_KEY);

async function encode(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .sign(key);
}

async function decode(token: string) {
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    return payload as unknown as User;
  } catch (e) {
    return null;
  }
}

export async function login(formData: FormData) {
  // Get the email and password from the form data
  const email = formData.get("email")?.toString().toLowerCase();
  const password = formData.get("password")?.toString();

  // See if the user is in the database
  const [rows, fields]: [any[], any] = await db
    .promise()
    .execute(
      "SELECT User_Name, User_ID, Phone, Validated FROM `Users` WHERE Email = ? AND PW = sha2(?,512)",
      [email, password]
    );

  if (rows.length > 0) {
    // Check if the user has validated their email
    if (!rows[0].Validated) {
      return { success: false, message: "Please validate your email" };
    }
    // User was found, set cookies and return successful message
    const user = {
      email: email,
      phone: rows[0].Phone,
      name: rows[0].User_Name,
      id: rows[0].User_ID,
    };
    const session = await encode(user);
    cookies().set("session", session, { httpOnly: true });
    return { success: true, message: "Login successful" };
  } else {
    // User was not found, return error message
    return { success: false, message: "Invalid email or password" };
  }
}

export async function logout() {
  cookies().set("session", "");
}

export async function getSession() {
  const session = cookies().get("session")?.value;
  if (session) {
    return await decode(session);
  } else {
    return null;
  }
}

export async function signup(formData: FormData) {
  // Get the info from the form data
  const firstName = formData.get("firstName")?.toString();
  const lastName = formData.get("lastName")?.toString();
  const email = formData.get("email")?.toString().toLowerCase();
  const phone = formData.get("phone")?.toString();
  const password = formData.get("password")?.toString();

  // Add the user to the database
  await db
    .promise()
    .execute(
      "INSERT INTO `Users` (User_Name, Email, PW, Phone, Send_Validation_Email) VALUES (?, ?, sha2(?,512), ?, 'y')",
      [firstName + " " + lastName, email, password, phone]
    );
}

export async function checkRepeatEmail(email: string | undefined) {
  const [rows, fields]: [any[], any] = await db
    .promise()
    .execute("SELECT * FROM `Users` WHERE Email = ?", [email]);
  return rows.length > 0;
}
