import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./styles.module.css";

const User = ({ userData }) => {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    setUserProfile(userData);
  }, [userData]);

  const BASE_URL = "http://localhost:8000";

  const updateUserProfile = () => {
    const { username, email, cv, photo, password, dob } = userProfile;
    const updatedProfile = { username, email, cv, photo, password, dob };

    axios
      .put(`${BASE_URL}/api/users/${userData.userId}`, updatedProfile, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setUserProfile(response.data);
        localStorage.setItem("userData", JSON.stringify(response.data));
      })
      .catch((error) => console.error("Error updating user profile:", error));
  };

  return (
    <div className={styles.user_section}>
      <h2>Welcome, {userData ? userData.username : "User"}!</h2>
      {userProfile ? (
        <>
          <p>Manage your profile:</p>
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
              <label>CV:</label>
              <input
                type="text"
                className={styles.input}
                value={userProfile.cv}
                onChange={(e) =>
                  setUserProfile({
                    ...userProfile,
                    cv: e.target.value,
                  })
                }
              />
            </div>
            <div className={styles.form_container_div}>
              <label>Photo:</label>
              <input
                type="text"
                className={styles.input}
                value={userProfile.photo}
                onChange={(e) =>
                  setUserProfile({
                    ...userProfile,
                    photo: e.target.value,
                  })
                }
              />
            </div>
            <div className={styles.form_container_div}>
              <label>Password:</label>
              <input
                type="password"
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
                value={userProfile.dob}
                onChange={(e) =>
                  setUserProfile({
                    ...userProfile,
                    dob: e.target.value,
                  })
                }
              />
            </div>
            <button
              className={styles.green_btn}
              type="button"
              onClick={() => updateUserProfile(userProfile)}
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
