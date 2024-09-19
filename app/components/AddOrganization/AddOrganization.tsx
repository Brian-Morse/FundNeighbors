"use client";
import React, { useState, useEffect } from "react";
import styles from "./AddOrganization.module.css";
import { Community, getCommunity } from "../../lib/list_selection";
import { addOrganization } from "../../lib/add";

const AddOrganization = () => {
  // Set up state variable
  const [community, setCommunity] = useState("");
  // Set up the lists of communities
  const [communityList, setCommunityList] = useState<Community[]>([]);

  // Fetch the community data from the database
  useEffect(() => {
    const fetchCommunity = async () => {
      const data = await getCommunity();
      setCommunityList(data);
    };
    fetchCommunity();
  }, []);

  return (
    <div className={styles.background}>
      <form
        className={styles.form}
        action={async (formData: FormData) => {
          const results = await addOrganization(formData);
          if (results.success) {
            alert(results.message);
            window.location.href = "/";
          } else {
            alert(results.message);
          }
        }}
      >
        <h1>Add an Organization:</h1>
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
        <label htmlFor="organization">Organization Name:</label>
        <input
          id="organization"
          name="organization"
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

export default AddOrganization;
