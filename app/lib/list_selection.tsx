"use server";
import db from "./db";

export interface Community {
  Community_ID: number;
  Community_Name: string;
  Google_Calendar: string;
}

export interface Organization {
  Organization_ID: number;
  Organization_Name: string;
  Google_Calendar: string;
}

export interface Group {
  Group_ID: number;
  Group_Name: string;
}

export interface Event {
  User_ID: number;
  Group_ID: number;
  Event_ID: number;
  Date: Date;
  Start_Time: string;
  End_Time: string;
  Comment: string;
  Code: string;
  Flyer_URL: string;
  Location_Name: string;
  Address: string;
  City: string;
  State: string;
  Zip_Code: string;
  Contact_Phone: string;
}

export interface Location {
  Location_ID: number;
  Location_Name: string;
  Address: string;
}

export async function getCommunity() {
  const [rows, fields] = await db
    .promise()
    .execute(
      "SELECT Community_ID, Community_Name, Google_Calendar FROM `Community` ORDER BY Community_Name"
    );

  return rows as Community[];
}

export async function getOrganization(community: string) {
  const [rows, fields] = await db
    .promise()
    .execute(
      "SELECT Organization_ID, Organization_Name, Google_Calendar FROM `Organization` WHERE Community_ID = ? ORDER BY Organization_Name",
      [community]
    );

  return rows as Organization[];
}

export async function getGroup(organization: string) {
  const [rows, fields] = await db
    .promise()
    .execute(
      "SELECT Group_ID, Group_Name FROM `Groups` WHERE Organization_ID = ? ORDER BY Group_Name",
      [organization]
    );

  return rows as Group[];
}

export async function getEvent(group: string) {
  const [rows, fields] = await db
    .promise()
    .execute(
      "SELECT Events.Event_ID, Events.Date, Events.Start_Time, Events.End_Time, Events.Comment, Events.Code, Events.Flyer_URL, Locations.Location_Name, Locations.Address, Locations.City, Locations.State, Locations.Zip_Code, Locations.Contact_Phone FROM `Events`, `Locations` WHERE Events.Group_ID = ? AND Events.Approval_Date IS NOT NULL AND Events.Location_ID = Locations.Location_ID AND Events.Date >= CURRENT_DATE ORDER BY Events.Date, Events.Start_Time",
      [group]
    );

  return rows as Event[];
}

export async function getLocation(community: string) {
  const [rows, fields] = await db
    .promise()
    .execute(
      "SELECT Location_ID, Location_Name, Address FROM `Locations` WHERE Community_ID = ? ORDER BY Location_Name",
      [community]
    );

  return rows as Location[];
}

export async function getFutureEventByUser(user_id: number) {
  const [rows, fields] = await db
    .promise()
    .execute(
      "SELECT Events.Event_ID, Events.Date, Events.Start_Time, Events.End_Time, Events.Comment, Events.Code, Events.Flyer_URL, Locations.Location_Name, Locations.Address, Locations.City, Locations.State, Locations.Zip_Code, Locations.Contact_Phone FROM `Events`, `Locations` WHERE Events.User_ID = ? AND Events.Location_ID = Locations.Location_ID AND Events.Date >= CURRENT_DATE ORDER BY Events.Date, Events.Start_Time",
      [user_id]
    );

  return rows as Event[];
}

export async function getPastEventByUser(user_id: number) {
  const [rows, fields] = await db
    .promise()
    .execute(
      "SELECT Events.Event_ID, Events.Date, Events.Start_Time, Events.End_Time, Events.Comment, Events.Code, Events.Flyer_URL, Locations.Location_Name, Locations.Address, Locations.City, Locations.State, Locations.Zip_Code, Locations.Contact_Phone FROM `Events`, `Locations` WHERE Events.User_ID = ? AND Events.Location_ID = Locations.Location_ID AND Events.Date < CURRENT_DATE ORDER BY Events.Date DESC, Events.Start_Time DESC",
      [user_id]
    );

  return rows as Event[];
}

export async function getEventByID(event_id: number) {
  const [rows, fields] = await db
    .promise()
    .execute(
      "SELECT Events.User_ID, Events.Group_ID, Events.Event_ID, Events.Date, Events.Start_Time, Events.End_Time, Events.Comment, Events.Code, Events.Flyer_URL, Locations.Location_Name, Locations.Address, Locations.City, Locations.State, Locations.Zip_Code, Locations.Contact_Phone FROM `Events`, `Locations` WHERE Events.Event_ID = ? AND Events.Location_ID = Locations.Location_ID",
      [event_id]
    );

  return rows as Event[];
}

export async function getGroupByID(group_id: number) {
  const [rows, fields] = await db
    .promise()
    .execute("SELECT Group_Name FROM `Groups` WHERE Group_ID = ?", [group_id]);

  return rows as Group[];
}
