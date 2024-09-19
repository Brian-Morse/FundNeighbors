"use server";
import db from "./db";

export async function addOrganization(formData: FormData) {
  try {
    await db
      .promise()
      .execute(
        "INSERT INTO `Organization` (Community_ID, Organization_Name) VALUES (?,?);",
        [formData.get("community"), formData.get("organization")]
      );
    return { success: true, message: "Organization added successfully" };
  } catch (e) {
    return { success: false, message: "Failed to add organization" };
  }
}

export async function addGroup(formData: FormData) {
  try {
    await db
      .promise()
      .execute(
        "INSERT INTO `Groups` (Organization_ID, Group_Name) VALUES (?,?);",
        [formData.get("organization"), formData.get("group")]
      );
    return { success: true, message: "Group added successfully" };
  } catch (e) {
    return { success: false, message: "Failed to add group" };
  }
}

export async function addLocation(formData: FormData) {
  try {
    await db
      .promise()
      .execute(
        "INSERT INTO `Locations` (Community_ID, Location_Name, Address, City, State, Zip_Code, Contact_Person, Contact_Phone) VALUES (?,?,?,?,?,?,?,?);",
        [
          formData.get("community"),
          formData.get("name"),
          formData.get("address"),
          formData.get("city"),
          formData.get("state"),
          formData.get("zipcode"),
          formData.get("contact_person"),
          formData.get("contact_phone"),
        ]
      );
    return { success: true, message: "Location added successfully" };
  } catch (e) {
    return { success: false, message: "Failed to add location" };
  }
}
