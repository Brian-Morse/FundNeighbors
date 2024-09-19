"use server";
import db from "./db";
import { promises as fs } from "fs";
import { getSession } from "./auth";

export async function addEvent(formData: FormData) {
  try {
    const session = await getSession();
    if (!session) {
      return {
        success: false,
        message: "You must be logged in to add an event",
      };
    }

    const event = {
      user_id: session.id,
      group: formData.get("group"),
      location: formData.get("location"),
      date: formData.get("date") as string,
      start: formData.get("start"),
      end: formData.get("end"),
      code: formData.get("code") || null,
      comment: formData.get("comment") || null,
    };
    await db.promise().query("START TRANSACTION");
    const [rows] = await db
      .promise()
      .execute(
        "INSERT INTO `Events` (User_ID, Location_ID, Group_ID, Date, Start_Time, End_Time, Comment, Code) VALUES (?,?,?,?,?,?,?,?);",
        [
          event.user_id,
          event.location,
          event.group,
          event.date,
          event.start,
          event.end,
          event.comment,
          event.code,
        ]
      );
    const eventID = (rows as any).insertId;
    const flyer = formData.get("flyer");
    if (flyer && flyer instanceof File && flyer.size > 0) {
      const flyerType = flyer.type;
      if (!flyerType.startsWith("image/")) {
        await db.promise().query("ROLLBACK");
        return { success: false, message: "Flyer must be an image" };
      }
      const flyerExtension = flyerType.split("/")[1];
      const flyerName = `F_${eventID}_${event.date.replace(/-/g, "")}.${flyerExtension}`;
      const flyerData = await flyer.arrayBuffer();
      await fs.writeFile(`./flyers/${flyerName}`, Buffer.from(flyerData));

      await db
        .promise()
        .execute("UPDATE `Events` SET Flyer_URL = ? WHERE Event_ID = ?;", [
          `http://fundneighbors.morsepages.com/flyers/${flyerName}`,
          eventID,
        ]);
    }

    await db.promise().query("COMMIT");
    return { success: true, message: "Event added" };
  } catch (err) {
    await db.promise().query("ROLLBACK");
    return {
      success: false,
      message: "Failed to add event. Please try again later",
    };
  }
}

export async function editEvent(formData: FormData, eventId: number) {
  try {
    const flyer = formData.get("flyer");
    const date = formData.get("Date") as string;
    if (flyer && flyer instanceof File && flyer.size > 0) {
      const flyerType = flyer.type;
      if (!flyerType.startsWith("image/")) {
        return { success: false, message: "Flyer must be an image" };
      }
      const flyerExtension = flyerType.split("/")[1];
      const flyerName = `F_${eventId}_${date.replace(/-/g, "")}.${flyerExtension}`;
      const flyerData = await flyer.arrayBuffer();
      await fs.writeFile(`./flyers/${flyerName}`, Buffer.from(flyerData));

      await db
        .promise()
        .execute(
          "UPDATE `Events` SET Flyer_URL = ?,  Date = ?, Start_Time = ?, End_Time = ?, Comment = ?, Code = ?, Updated = 'y' WHERE Event_ID = ?;",
          [
            `http://fundneighbors.morsepages.com/flyers/${flyerName}`,
            date,
            formData.get("Start_Time"),
            formData.get("End_Time"),
            formData.get("Comment") || null,
            formData.get("Code") || null,
            eventId,
          ]
        );
      return { success: true, message: "Event edited" };
    }

    if (formData.get("remove") === "on") {
      await db
        .promise()
        .execute(
          "UPDATE `Events` SET FLYER_URL = NULL, Date = ?, Start_Time = ?, End_Time = ?, Comment = ?, Code = ?, Updated = 'y' WHERE Event_ID = ?;",
          [
            date,
            formData.get("Start_Time"),
            formData.get("End_Time"),
            formData.get("Comment") || null,
            formData.get("Code") || null,
            eventId,
          ]
        );
    } else {
      await db
        .promise()
        .execute(
          "UPDATE `Events` SET Date = ?, Start_Time = ?, End_Time = ?, Comment = ?, Code = ?, Updated = 'y' WHERE Event_ID = ?;",
          [
            date,
            formData.get("Start_Time"),
            formData.get("End_Time"),
            formData.get("Comment") || null,
            formData.get("Code") || null,
            eventId,
          ]
        );
    }
    return { success: true, message: "Event edited" };
  } catch (err) {
    return {
      success: false,
      message: "Failed to edit event. Please try again later",
    };
  }
}

export async function deleteEvent(eventId: number) {
  try {
    await db
      .promise()
      .execute("UPDATE `Events` SET Remove = 'Y' WHERE Event_ID = ?;", [
        eventId,
      ]);
    return { success: true, message: "Event marked for deletion" };
  } catch (err) {
    return {
      success: false,
      message: "Failed to mark event for deletion. Please try again later",
    };
  }
}
