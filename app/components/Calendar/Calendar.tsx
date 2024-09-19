"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./Calendar.module.css";
import {
  Community,
  getCommunity,
  Organization,
  getOrganization,
  Group,
  getGroup,
  Event,
  getEvent,
} from "../../lib/list_selection";

// Converting time
function formatTime(time24: string): string {
  const [hours, minutes] = time24.split(":");
  const hours12 = parseInt(hours) % 12 || 12;
  const ampm = parseInt(hours) >= 12 ? "PM" : "AM";
  return `${hours12}:${minutes} ${ampm}`;
}

const Calendar = () => {
  // Set up state variables
  const [community, setCommunity] = useState("");
  const [organization, setOrganization] = useState("%");
  const [group, setGroup] = useState("%");
  const [calendarUrl, setCalendarUrl] = useState(
    "https://calendar.google.com/calendar/u/0/embed"
  );
  // Set up the lists of communities, organizations, and groups
  const [communityList, setCommunityList] = useState<Community[]>([]);
  const [organizationList, setOrganizationList] = useState<Organization[]>([]);
  const [groupList, setGroupList] = useState<Group[]>([]);
  const [eventList, setEventList] = useState<Event[]>([]);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Fetch the community data from the database
  useEffect(() => {
    const fetchCommunity = async () => {
      const data = await getCommunity();
      setCommunityList(data);
    };
    fetchCommunity();
  }, []);

  // Getting the organizations based on communities
  useEffect(() => {
    if (community) {
      const fetchOrganization = async () => {
        const data = await getOrganization(community);
        setOrganizationList(data);
      };
      fetchOrganization();
      setOrganization("%");
      setGroup("%");
      let email = communityList.find(
        (comm) => comm.Community_ID.toString() === community
      )?.Google_Calendar;
      if (email) {
        setCalendarUrl(
          `https://calendar.google.com/calendar/u/0/embed?src=${email}`
        );
      }
    }
  }, [community]);

  // Getting the groups based on organizations
  useEffect(() => {
    if (organization) {
      if (organization === "%") {
        let email = communityList.find(
          (comm) => comm.Community_ID.toString() === community
        )?.Google_Calendar;
        if (email) {
          setCalendarUrl(
            `https://calendar.google.com/calendar/u/0/embed?src=${email}`
          );
        }
      } else {
        const fetchGroup = async () => {
          const data = await getGroup(organization);
          setGroupList(data);
        };
        fetchGroup();
        setGroup("%");
        let email = organizationList.find(
          (comm) => comm.Organization_ID.toString() === organization
        )?.Google_Calendar;
        if (email) {
          setCalendarUrl(
            `https://calendar.google.com/calendar/u/0/embed?src=${email}`
          );
        }
      }
    }
  }, [organization]);

  // Displaying the events of the selected group
  useEffect(() => {
    if (group !== "%") {
      const fetchEvent = async () => {
        const data = await getEvent(group);
        setEventList(data);
      };
      fetchEvent();
      setTimeout(() => {
        if (calendarRef.current) {
          const elementTop = calendarRef.current.getBoundingClientRect().top;
          const offset =
            5 * parseFloat(getComputedStyle(document.documentElement).fontSize);
          window.scrollTo({
            top: window.scrollY + elementTop - offset,
            behavior: "smooth",
          });
        }
      }, 1000);
    } else {
      setEventList([]);
    }
  }, [group]);

  return (
    <div className={styles.contentWrapper}>
      <div className={styles.calendarSelection}>
        <iframe src={calendarUrl} className={styles.calendar}></iframe>
        <form className={styles.form}>
          <p>Select which events you would like to see:</p>
          <label>
            <p>Community</p>
            <select
              className={styles.selectBox}
              value={community}
              onChange={(e) => setCommunity(e.target.value)}
            >
              <option style={{ display: "none" }} value="">
                Select One
              </option>
              {communityList.map((community) => (
                <option
                  key={community.Community_ID}
                  value={community.Community_ID}
                >
                  {community.Community_Name}
                </option>
              ))}
            </select>
          </label>
          {community && (
            <label>
              <p>Organization</p>
              <select
                className={styles.selectBox}
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
              >
                <option value="%">All</option>
                {organizationList.map((organization) => (
                  <option
                    key={organization.Organization_ID}
                    value={organization.Organization_ID}
                  >
                    {organization.Organization_Name}
                  </option>
                ))}
              </select>
            </label>
          )}

          {organization != "%" && (
            <label>
              <p>Group</p>
              <select
                className={styles.selectBox}
                value={group}
                onChange={(e) => setGroup(e.target.value)}
              >
                <option value="%">All</option>
                {groupList.map((group) => (
                  <option key={group.Group_ID} value={group.Group_ID}>
                    {group.Group_Name}
                  </option>
                ))}
              </select>
            </label>
          )}
        </form>
      </div>
      {group != "%" && (
        <div ref={calendarRef} className={styles.eventHolder}>
          {eventList.length === 0 ? (
            <p>This group has no upcoming events</p>
          ) : (
            eventList.map((event) => (
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
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Calendar;
