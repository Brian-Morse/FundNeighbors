"use client";
import React, { useState, useEffect } from "react";
import styles from "./AddEvent.module.css";
import {
  Community,
  getCommunity,
  Organization,
  getOrganization,
  Group,
  getGroup,
  Location,
  getLocation,
} from "../../lib/list_selection";
import { addEvent } from "../../lib/event_alteration";
import Link from "next/link";

const AddEvent = () => {
  // Set up state variables
  const [community, setCommunity] = useState("");
  const [organization, setOrganization] = useState("");
  const [group, setGroup] = useState("");
  const [location, setLocation] = useState("");
  // Set up the lists of communities, organizations, and groups
  const [communityList, setCommunityList] = useState<Community[]>([]);
  const [organizationList, setOrganizationList] = useState<Organization[]>([]);
  const [groupList, setGroupList] = useState<Group[]>([]);
  const [locationList, setLocationList] = useState<Location[]>([]);
  // Get control over the start and end time
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [fullDay, setFullDay] = useState(false);
  const handleFullDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setFullDay(true);
      setStart("00:00");
      setEnd("23:59");
    } else {
      setFullDay(false);
      setStart("");
      setEnd("");
    }
  };

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
      const fetchLocation = async () => {
        const data = await getLocation(community);
        setLocationList(data);
      };
      fetchLocation();
      setOrganization("");
      setGroup("");
    }
  }, [community]);

  // Getting the groups based on organizations
  useEffect(() => {
    if (organization) {
      const fetchGroup = async () => {
        const data = await getGroup(organization);
        setGroupList(data);
      };
      fetchGroup();
      setGroup("");
    }
  }, [organization]);

  return (
    <div className={styles.background}>
      <form
        className={styles.form}
        action={async (formData: FormData) => {
          const results = await addEvent(formData);
          if (results.success) {
            alert(results.message);
            window.location.href = "/";
          } else {
            alert(results.message);
          }
        }}
      >
        <h1>Add an Event:</h1>
        <label htmlFor="community">Community:</label>
        <select
          id="community"
          name="community"
          className={styles.inputBox}
          value={community}
          onChange={(e) => setCommunity(e.target.value)}
          required
        >
          <option style={{ display: "none" }} value="">
            Select One
          </option>
          {communityList.map((community) => (
            <option key={community.Community_ID} value={community.Community_ID}>
              {community.Community_Name}
            </option>
          ))}
        </select>
        <label htmlFor="organization">Organization:</label>
        <select
          id="organization"
          name="organization"
          className={styles.inputBox}
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
          required
        >
          <option style={{ display: "none" }} value="">
            Select One
          </option>
          {organizationList.map((organization) => (
            <option
              key={organization.Organization_ID}
              value={organization.Organization_ID}
            >
              {organization.Organization_Name}
            </option>
          ))}
        </select>
        <p className={styles.add}>
          Don&apos;t see your organization?{" "}
          <Link href="/addorganization">Add it</Link>
        </p>
        <label htmlFor="group">Group:</label>
        <select
          id="group"
          name="group"
          className={styles.inputBox}
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          required
        >
          <option style={{ display: "none" }} value="">
            Select One
          </option>
          {groupList.map((group) => (
            <option key={group.Group_ID} value={group.Group_ID}>
              {group.Group_Name}
            </option>
          ))}
        </select>
        <p className={styles.add}>
          Don&apos;t see your group? <Link href="/addgroup">Add it</Link>
        </p>
        <label htmlFor="location">Location:</label>
        <select
          id="location"
          name="location"
          className={styles.inputBox}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        >
          <option style={{ display: "none" }} value="">
            Select One
          </option>
          {locationList.map((location) => (
            <option key={location.Location_ID} value={location.Location_ID}>
              {location.Location_Name}, {location.Address}
            </option>
          ))}
        </select>
        <p className={styles.add}>
          Don&apos;t see your location? <Link href="/addlocation">Add it</Link>
        </p>
        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          name="date"
          className={styles.inputBox}
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
          name="start"
          className={styles.inputBox}
          value={start}
          onChange={(e) => setStart(e.target.value)}
          readOnly={fullDay}
          required
        ></input>
        <label htmlFor="end">End Time:</label>
        <input
          type="time"
          id="end"
          name="end"
          className={styles.inputBox}
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          readOnly={fullDay}
          required
        ></input>
        <label htmlFor="code">Code:</label>
        <input
          type="text"
          id="code"
          name="code"
          className={styles.inputBox}
        ></input>
        <label htmlFor="flyer">Flyer Upload:</label>
        <input
          type="file"
          id="flyer"
          name="flyer"
          className={styles.inputBox}
        ></input>
        <label htmlFor="comment">Comment:</label>
        <textarea
          id="comment"
          name="comment"
          className={styles.inputBox}
          style={{ minHeight: "3em", resize: "none" }}
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

export default AddEvent;
