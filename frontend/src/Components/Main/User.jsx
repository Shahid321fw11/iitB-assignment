import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./styles.module.css";

const User = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    setUserData(userData);
    setUserProfile(userData);
  }, []);

  // const BASE_URL = "http://localhost:8000";
  const BASE_URL = "https://iitb-assignment.onrender.com";

  const uploadToCloudinary = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "my-mern-chat-app-cloud");
      formData.append("cloud_name", "my-chat-app-mern-cloudinary");
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/my-chat-app-mern-cloudinary/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading file to Cloudinary:", error);
      throw error;
    }
  };

  const detectChanges = (oldData, newData) => {
    const changes = {};
    for (const key in newData) {
      if (newData[key] !== oldData[key]) {
        changes[key] = newData[key];
      }
    }
    return changes;
  };

  const updateUserProfile = async () => {
    console.log("cjids");
    try {
      const changes = detectChanges(userData, userProfile);
      const formData = new FormData();

      for (const key in changes) {
        formData.append(key, changes[key]);
      }

      if (cvFile && cvFile.type === "application/pdf") {
        const cvUrl = await uploadToCloudinary(cvFile);
        formData.append("cv", cvUrl);
      }

      if (
        photoFile &&
        (photoFile.type === "image/jpeg" || photoFile.type === "image/png")
      ) {
        const photoUrl = await uploadToCloudinary(photoFile);
        formData.append("photo", photoUrl);
      }

      if (formData.entries().next().done === false) {
        axios
          .put(`${BASE_URL}/api/users/${userData._id}`, formData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((response) => {
            setUserProfile(response.data);
            localStorage.setItem("userData", JSON.stringify(response.data));
          })
          .catch((error) =>
            console.error("Error updating user profile:", error)
          );
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserProfile({ ...userProfile, [name]: value });
  };

  const handlePhotoChange = (e) => {
    setPhotoFile(e.target.files[0]);
  };

  const handleCvChange = (e) => {
    setCvFile(e.target.files[0]);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  return (
    <div className={styles.user_section}>
      <div className={styles.editUserHeader}>
        <h2>Welcome, {userData ? userData.username : "User"}!</h2>
        <img
          src={userData?.photo}
          alt="Profile"
          className={styles.profileIcon}
        />
      </div>
      {userProfile ? (
        <>
          <p>Manage your profile from here</p>
          <form className={styles.form_container}>
            <div className={styles.form_container_div}>
              <label>Username:</label>
              <input
                type="text"
                name="username"
                className={styles.input}
                value={userProfile.username}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.form_container_div}>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                className={styles.input}
                value={userProfile.email}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.form_container_div}>
              <label>Password:</label>
              <input
                type="text"
                name="password"
                className={styles.input}
                value={userProfile.password}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.form_container_div}>
              <label>Date of Birth:</label>
              <input
                type="date"
                name="dob"
                className={styles.input}
                value={formatDate(userProfile.dob)}
                onChange={handleInputChange}
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
                />
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
                />
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
