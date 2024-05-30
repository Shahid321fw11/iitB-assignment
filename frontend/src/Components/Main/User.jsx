import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./styles.module.css";

const User = ({ userData }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [cvFile, setCvFile] = useState(null);

  const photoUrl = JSON.parse(localStorage.getItem("userData")).photo;

  useEffect(() => {
    setUserProfile(userData);
    console.log(userProfile);
  }, [userData]);

  const BASE_URL = "http://localhost:8000";

  const updateUserProfile = () => {
    const formData = new FormData();
    formData.append("username", userProfile.username);
    formData.append("email", userProfile.email);
    formData.append("password", userProfile.password);
    formData.append("dob", userProfile.dob);
    formData.append("cv", cvFile); // Append CV file
    formData.append("photo", photoFile); // Append photo file

    axios
      .put(`${BASE_URL}/api/users/${userData.userId}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setUserProfile(response.data);
        localStorage.setItem("userData", JSON.stringify(response.data));
      })
      .catch((error) => console.error("Error updating user profile:", error));
  };

  // Handle photo file change
  const handlePhotoChange = (e) => {
    setPhotoFile(e.target.files[0]);
  };

  // Handle CV file change
  const handleCvChange = (e) => {
    setCvFile(e.target.files[0]);
  };

  const formatDate = (dateString) => {
    if (!dateString) return ""; // Handle empty dateString
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Ensure two digits for month
    const day = date.getDate().toString().padStart(2, "0"); // Ensure two digits for day
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  return (
    <div className={styles.user_section}>
      <div className={styles.editUserHeader}>
        <h2>Welcome, {userData ? userData.username : "User"}!</h2>
        <img src={photoUrl} alt="Profile" className={styles.profileIcon} />
      </div>
      {/* <h2>Welcome, {userData ? userData.username : "User"}!</h2> */}
      {userProfile ? (
        <>
          <p>Manage your profile from here</p>
          <form className={styles.form_container}>
            <div className={styles.form_container_div}>
              <label>Username:</label>
              <input
                type="text"
                className={styles.input}
                value={userProfile.username}
                onChange={(e) =>
                  setUserProfile({
                    ...userProfile,
                    username: e.target.value,
                  })
                }
              />
            </div>
            <div className={styles.form_container_div}>
              <label>Email:</label>
              <input
                type="email"
                className={styles.input}
                value={userProfile.email}
                onChange={(e) =>
                  setUserProfile({
                    ...userProfile,
                    email: e.target.value,
                  })
                }
              />
            </div>
            <div className={styles.form_container_div}>
              <label>Password:</label>
              <input
                type="text"
                className={styles.input}
                value={userProfile.password}
                onChange={(e) =>
                  setUserProfile({
                    ...userProfile,
                    password: e.target.value,
                  })
                }
              />
            </div>
            <div className={styles.form_container_div}>
              <label>Date of Birth:</label>
              <input
                type="date"
                className={styles.input}
                value={formatDate(userProfile.dob)}
                onChange={(e) =>
                  setUserProfile({
                    ...userProfile,
                    dob: e.target.value,
                  })
                }
              />
            </div>
            <div className={styles.form_container_div}>
              <label>CV:</label>
              <div className={styles.input}>
                <input
                  type="file"
                  name="cv"
                  accept="application/pdf"
                  onChange={handleCvChange}
                  required
                  className={""}
                />
                <svg
                  className={`${styles.icon} w-6 h-6 text-gray-800 dark:text-white`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 3v4a1 1 0 0 1-1 1H5m14-4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z"
                  />
                </svg>
              </div>
            </div>
            <div className={styles.form_container_div}>
              <label>Photo:</label>
              <div className={styles.input}>
                <input
                  type="file"
                  name="photo"
                  accept="image/jpeg, image/png"
                  onChange={handlePhotoChange}
                  required
                  className={""}
                />
                <svg
                  className={`${styles.icon} w-6 h-6 text-gray-800 dark:text-white`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 18V8a1 1 0 0 1 1-1h1.5l1.707-1.707A1 1 0 0 1 8.914 5h6.172a1 1 0 0 1 .707.293L17.5 7H19a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z"
                  />
                  <path
                    stroke="currentColor"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </div>
            </div>
            <button
              className={styles.green_btn}
              type="button"
              onClick={updateUserProfile}
            >
              Update Profile
            </button>
          </form>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default User;
