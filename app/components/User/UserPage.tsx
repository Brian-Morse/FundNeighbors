"use client";
import React, { useState, useEffect } from "react";
import { getSession, User } from "../../lib/auth";
import styles from "./User.module.css";
import {
  Event,
  getFutureEventByUser,
  getPastEventByUser,
} from "../../lib/list_selection";
import Link from "next/link";
import { deleteEvent } from "@/app/lib/event_alteration";

// Converting time
function formatTime(time24: string): string {
  const [hours, minutes] = time24.split(":");
  const hours12 = parseInt(hours) % 12 || 12;
  const ampm = parseInt(hours) >= 12 ? "PM" : "AM";
  return `${hours12}:${minutes} ${ampm}`;
}

const UserPage = () => {
  const [session, setSession] = useState<User | null>(null);
  const [futureEventList, setFutureEventList] = useState<Event[]>([]);
  const [pastEventList, setPastEventList] = useState<Event[]>([]);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      setSession(session);
    };
    fetchSession();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!session) {
        return;
      }
      const fevents = await getFutureEventByUser(session.id);
      setFutureEventList(fevents);
      const pevents = await getPastEventByUser(session.id);
      setPastEventList(pevents.slice(0, 10));
    };
    fetchEvents();
  }, [session]);

  return (
    <div className={styles.background}>
      {session ? (
        <div className={styles.container}>
          <h1>{session.name}</h1>
          <p>Email: {session.email}</p>
          <p>Phone: {session.phone}</p>
          <h2>Future Events:</h2>
          {futureEventList.length === 0 ? (
            <p>No future events</p>
          ) : (
            futureEventList.map((event) => (
              <div className={styles.event} key={event.Event_ID}>
                <h2>{event.Location_Name}</h2>
                {event.Start_Time === "00:00:00" &&
                event.End_Time === "23:59:00" ? (
                  <h3>
                    {new Date(event.Date).toLocaleDateString("en-US", {
                      timeZone: "UTC",
                    })}
                    , All Day
                  </h3>
                ) : (
                  <h3>
                    {new Date(event.Date).toLocaleDateString("en-US", {
                      timeZone: "UTC",
                    })}
                    , {formatTime(event.Start_Time)} -{" "}
                    {formatTime(event.End_Time)}
                  </h3>
                )}
                <p>
                  {event.Address}, {event.City}, {event.State} {event.Zip_Code}
                </p>
                <p>Phone: {event.Contact_Phone}</p>
                {event.Code && (
                  <p>
                    <b>CODE: </b> {event.Code}
                  </p>
                )}
                {event.Flyer_URL && (
                  <a
                    href={event.Flyer_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Flyer
                  </a>
                )}
                {event.Comment && (
                  <p>
                    <b>Comment: </b>
                    {event.Comment}
                  </p>
                )}
                <div className={styles.alter}>
                  <Link href={`/editevent/${event.Event_ID}`}>Edit</Link>
                  <button
                    onClick={async () => {
                      if (
                        confirm("Are you sure you want to delete this event?")
                      ) {
                        const result = await deleteEvent(event.Event_ID);
                        alert(result.message);
                        window.location.reload();
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
          <h2>Past Events:</h2>
          {pastEventList.length === 0 ? (
            <p>No past events</p>
          ) : (
            pastEventList.map((event) => (
              <div className={styles.event} key={event.Event_ID}>
                <h2>{event.Location_Name}</h2>
                {event.Start_Time === "00:00:00" &&
                event.End_Time === "23:59:00" ? (
                  <h3>
                    {new Date(event.Date).toLocaleDateString("en-US", {
                      timeZone: "UTC",
                    })}
                    , All Day
                  </h3>
                ) : (
                  <h3>
                    {new Date(event.Date).toLocaleDateString("en-US", {
                      timeZone: "UTC",
                    })}
                    , {formatTime(event.Start_Time)} -{" "}
                    {formatTime(event.End_Time)}
                  </h3>
                )}
                <p>
                  {event.Address}, {event.City}, {event.State} {event.Zip_Code}
                </p>
                <p>Phone: {event.Contact_Phone}</p>
                {event.Code && (
                  <p>
                    <b>CODE: </b> {event.Code}
                  </p>
                )}
                {event.Flyer_URL && (
                  <a
                    href={event.Flyer_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Flyer
                  </a>
                )}
                {event.Comment && (
                  <p>
                    <b>Comment: </b>
                    {event.Comment}
                  </p>
                )}
                <div className={styles.alter}>
                  <Link href={`/editevent/${event.Event_ID}`}>Edit</Link>
                  <button
                    onClick={async () => {
                      if (
                        confirm("Are you sure you want to delete this event?")
                      ) {
                        const result = await deleteEvent(event.Event_ID);
                        alert(result.message);
                        window.location.reload();
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className={styles.container}>
          <h3>Loading...</h3>
        </div>
      )}
    </div>
  );
};

export default UserPage;
