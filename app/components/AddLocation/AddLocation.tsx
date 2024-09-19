"use client";
import React, { useState, useEffect } from "react";
import styles from "./AddLocation.module.css";
import { Community, getCommunity } from "../../lib/list_selection";
import { addLocation } from "../../lib/add";

const AddLocation = () => {
  // Set up state variable
  const [community, setCommunity] = useState("");
  const [error, setError] = useState("");
  // Set up the lists of communities
  const [communityList, setCommunityList] = useState<Community[]>([]);

  // Function to format a phone number
  const formatPhoneNumber = (value: string | undefined) => {
    // Remove all non-digit characters
    if (!value) {
      return false;
    }
    const cleaned = value.replace(/\D/g, "");
    // Format the cleaned number as XXX-XXX-XXXX
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return false;
  };

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
          const phone = formData.get("contact_phone")?.toString();
          // Format the phone number
          if (phone !== "") {
            const formatPhone = formatPhoneNumber(phone);
            if (formatPhone === false) {
              setError("Invalid phone number. Use format XXX-XXX-XXXX");
              return;
            } else {
              formData.set("contact_phone", formatPhone as string);
            }
          }
          const results = await addLocation(formData);
          if (results.success) {
            alert(results.message);
            window.location.href = "/";
          } else {
            alert(results.message);
          }
        }}
      >
        <h1>Add a Location:</h1>
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
        <label htmlFor="name">Location Name:</label>
        <input
          id="name"
          name="name"
          type="text"
          className={styles.inputBox}
          required
        ></input>
        <label htmlFor="address">Address:</label>
        <input
          id="address"
          name="address"
          type="text"
          className={styles.inputBox}
          required
        ></input>
        <label htmlFor="city">City:</label>
        <input
          id="city"
          name="city"
          type="text"
          className={styles.inputBox}
          required
        ></input>
        <label htmlFor="state">State:</label>
        <select id="state" name="state" className={styles.inputBox} required>
          <option style={{ display: "none" }} value="">
            Select One
          </option>
          <option value="AL">Alabama</option>
          <option value="AK">Alaska</option>
          <option value="AZ">Arizona</option>
          <option value="AR">Arkansas</option>
          <option value="CA">California</option>
          <option value="CO">Colorado</option>
          <option value="CT">Connecticut</option>
          <option value="DE">Delaware</option>
          <option value="DC">District Of Columbia</option>
          <option value="FL">Florida</option>
          <option value="GA">Georgia</option>
          <option value="HI">Hawaii</option>
          <option value="ID">Idaho</option>
          <option value="IL">Illinois</option>
          <option value="IN">Indiana</option>
          <option value="IA">Iowa</option>
          <option value="KS">Kansas</option>
          <option value="KY">Kentucky</option>
          <option value="LA">Louisiana</option>
          <option value="ME">Maine</option>
          <option value="MD">Maryland</option>
          <option value="MA">Massachusetts</option>
          <option value="MI">Michigan</option>
          <option value="MN">Minnesota</option>
          <option value="MS">Mississippi</option>
          <option value="MO">Missouri</option>
          <option value="MT">Montana</option>
          <option value="NE">Nebraska</option>
          <option value="NV">Nevada</option>
          <option value="NH">New Hampshire</option>
          <option value="NJ">New Jersey</option>
          <option value="NM">New Mexico</option>
          <option value="NY">New York</option>
          <option value="NC">North Carolina</option>
          <option value="ND">North Dakota</option>
          <option value="OH">Ohio</option>
          <option value="OK">Oklahoma</option>
          <option value="OR">Oregon</option>
          <option value="PA">Pennsylvania</option>
          <option value="RI">Rhode Island</option>
          <option value="SC">South Carolina</option>
          <option value="SD">South Dakota</option>
          <option value="TN">Tennessee</option>
          <option value="TX">Texas</option>
          <option value="UT">Utah</option>
          <option value="VT">Vermont</option>
          <option value="VA">Virginia</option>
          <option value="WA">Washington</option>
          <option value="WV">West Virginia</option>
          <option value="WI">Wisconsin</option>
          <option value="WY">Wyoming</option>
        </select>
        <label htmlFor="zipcode">Zipcode:</label>
        <input
          id="zipcode"
          name="zipcode"
          type="text"
          className={styles.inputBox}
          required
        ></input>
        <label htmlFor="contact_person">Contact Person:</label>
        <input
          id="contact_person"
          name="contact_person"
          type="text"
          className={styles.inputBox}
        ></input>
        <label htmlFor="contact_phone">Contact Phone:</label>
        <input
          id="contact_phone"
          name="contact_phone"
          type="tel"
          className={styles.inputBox}
        ></input>
        <p className={styles.error}>{error}</p>
        <div>
          <button className={styles.submitButton} type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddLocation;
