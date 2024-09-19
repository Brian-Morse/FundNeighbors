"use client";
import { getSession, User } from "@/app/lib/auth";
import { getEventByID, Event, getGroupByID } from "@/app/lib/list_selection";
import React, { useEffect, useState } from "react";
import styles from "./EditEvent.module.css";
import { editEvent } from "@/app/lib/event_alteration";

// Custom date formatting function
const formatDate = (date: Date): string => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const EditEvent = ({ event_id }: { event_id: number }) => {
  const [session, setSession] = useState<User | null>(null);
  const [groupName, setGroupName] = useState<string>("");
  const [permission, setPermission] = useState<boolean>(true);
  const [event, setEvent] = useState<Event | null>(null);
  const [date, setDate] = useState<string>("");
  const [fullDay, setFullDay] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      setSession(session);
    };
    fetchSession();
  }, []);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!session) {
        return;
      }
      const event = await getEventByID(event_id);
      if (event.length === 0) {
        setPermission(false);
        return;
      }
      if (event[0].User_ID !== session.id) {
        setPermission(false);
        return;
      }
      setEvent(event[0]);
      const group = await getGroupByID(event[0].Group_ID);
      setGroupName(group[0].Group_Name);
      setDate(formatDate(event[0].Date));
    };
    fetchEvent();
  }, [session]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "Date") {
      setEvent((prev) => {
        if (!prev) {
          return null;
        }
        return { ...prev, Date: new Date(value) };
      });
    }
    setEvent((prev) => {
      if (!prev) {
        return null;
      }
      return { ...prev, [name]: value };
    });
  };

  const handleFullDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setFullDay(true);
      setEvent((prev) =>
        prev ? { ...prev, Start_Time: "00:00", End_Time: "23:59" } : null
      );
    } else {
      setFullDay(false);
      setEvent((prev) =>
        prev ? { ...prev, Start_Time: "", End_Time: "" } : null
      );
    }
  };

  if (!session || !permission || !event) {
    return (
      <div className={styles.background}>
        <div className={styles.form}>
          You do not have permission to edit this event
        </div>
      </div>
    );
  }
  return (
    <div className={styles.background}>
      <form
        className={styles.form}
        action={async (formData: FormData) => {
          const results = await editEvent(formData, event_id);
          if (results.success) {
            alert(results.message);
            window.location.href = "/";
          } else {
            alert(results.message);
          }
        }}
      >
        <h1>Edit an Event:</h1>
        <h3>Group: {groupName}</h3>
        <h3>Location: {event.Location_Name}</h3>
        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          name="Date"
          className={styles.inputBox}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        ></input>
        <p>
          Full Day Event:{" "}
          <input type="checkbox" onChange={handleFullDayChange}></input>
        </p>
        <label htmlFor="start">Start Time:</label>
        <input
          type="time"
          id="start"
          name="Start_Time"
          className={styles.inputBox}
          value={event.Start_Time}
          onChange={handleInputChange}
          readOnly={fullDay}
          required
        ></input>
        <label htmlFor="end">End Time:</label>
        <input
          type="time"
          id="end"
          name="End_Time"
          className={styles.inputBox}
          value={event.End_Time}
          onChange={handleInputChange}
          readOnly={fullDay}
          required
        ></input>
        <label htmlFor="code">Code:</label>
        <input
          type="text"
          id="code"
          name="Code"
          className={styles.inputBox}
          value={event.Code || ""}
          onChange={handleInputChange}
        ></input>
        <label htmlFor="flyer">Flyer Upload:</label>
        <input
          type="file"
          id="flyer"
          name="flyer"
          className={styles.inputBox}
        ></input>
        <p style={{ marginTop: "0px" }}>
          Current flyer:{" "}
          {event.Flyer_URL ? (
            <a href={event.Flyer_URL} target="_blank" rel="noopener noreferrer">
              View Flyer
            </a>
          ) : (
            "None"
          )}
        </p>
        <div className={styles.inputBox}>
          <label htmlFor="remove">Remove all flyers:</label>
          <input type="checkbox" id="remove" name="remove"></input>
        </div>
        <label htmlFor="comment">Comment:</label>
        <textarea
          id="comment"
          name="Comment"
          className={styles.inputBox}
          style={{ minHeight: "3em", resize: "none" }}
          value={event.Comment || ""}
          onChange={handleInputChange}
        ></textarea>
        <div>
          <button className={styles.submitButton} type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEvent;
