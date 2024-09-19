"use server";
import db from "./db";

export async function setForgotPassword(email: string) {
  try {
    await db
      .promise()
      .execute(
        "UPDATE `Users` SET Forgot_Password_Req = CURRENT_TIMESTAMP WHERE Email = ?",
        [email]
      );
    return true;
  } catch (e) {
    return false;
  }
}

export async function resetPassword(encoded_id: string, password: string) {
  try {
    const [rows, fields]: [any[], any] = await db
      .promise()
      .execute(
        "SELECT User_ID FROM `V_Forgot_PW_Users` WHERE Approval_Code = ?",
        [encoded_id]
      );

    await db
      .promise()
      .execute(
        "UPDATE `Users` SET PW = sha2(?,512), Forgot_Password_Req = NULL WHERE User_ID = ?",
        [password, rows[0].User_ID]
      );
    return true;
  } catch (e) {
    return false;
  }
}
