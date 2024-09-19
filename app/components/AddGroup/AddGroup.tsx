"use client";
import React, { useState, useEffect } from "react";
import styles from "./AddGroup.module.css";
import {
  Community,
  getCommunity,
  Organization,
  getOrganization,
} from "../../lib/list_selection";
import { addGroup } from "../../lib/add";

const AddGroup = () => {
  // Set up state variable
  const [community, setCommunity] = useState("");
  const [organization, setOrganization] = useState("");
  // Set up the lists of communities
  const [communityList, setCommunityList] = useState<Community[]>([]);
  const [organizationList, setOrganizationList] = useState<Organization[]>([]);

  // Fetch the community data from the database
  useEffect(() => {
    const fetchCommunity = async () => {
      const data = await getCommunity();
      setCommunityList(data);
    };
    fetchCommunity();
  }, []);

  // Fetch the organization data from the database based on community
  useEffect(() => {
    const fetchOrganization = async () => {
      const data = await getOrganization(community);
      setOrganizationList(data);
    };
    fetchOrganization();
  }, [community]);

  return (
    <div className={styles.background}>
      <form
        className={styles.form}
        action={async (formData: FormData) => {
          const results = await addGroup(formData);
          if (results.success) {
            alert(results.message);
            window.location.href = "/";
          } else {
            alert(results.message);
          }
        }}
      >
        <h1>Add a Group:</h1>
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
        <label htmlFor="group">Group Name:</label>
        <input
          id="group"
          name="group"
          type="text"
          className={styles.inputBox}
          required
        ></input>
        <div>
          <button className={styles.submitButton} type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddGroup;
