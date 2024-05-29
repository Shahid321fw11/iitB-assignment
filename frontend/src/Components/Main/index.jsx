import styles from "./styles.module.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
// import "./App.css";

const Main = () => {
  const [userData, setUserData] = useState(null);
  const [users, setUsers] = useState([]);
  const [userProfile, setUserProfile] = useState(null); // Added userProfile state
  const BASE_URL = "http://localhost:8000";
  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(null);
  // const BASE_URL = "https://iitb-assignment.onrender.com";

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    setUserData(userData);
    setUserProfile(userData);

    if (userData && userData.isAdmin) {
      fetchUsers();
    } else if (userData || !userData.isAdmin) {
      console.log("not user Admin");
    }
    console.log("userData", users);
  }, []);

  // Function to handle updating user profile
  const updateUserProfile = () => {
    const { username, email } = userProfile;
    const updatedProfile = { username, email };

    axios
      .put(`${BASE_URL}/api/users/${userData.userId}`, updatedProfile, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setUserProfile(response.data);
        setUserData(response.data);
        localStorage.setItem("userData", JSON.stringify(response.data));
      })
      .catch((error) => console.error("Error updating user profile:", error));
  };
  // const updateUserProfile = (userProfile) => {
  //   const updatedProfile = { ...userProfile };
  //   delete updatedProfile.cv;
  //   delete updatedProfile.photo;
  //   // console.log("upda", updateUserProfile);
  //   console.log("upda", updatedProfile);
  //   axios
  //     .put(`${BASE_URL}/api/users/${userData.userId}`, updatedProfile, {
  //       headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  //     })
  //     .then(() => {
  //       // If successful, update userProfile state
  //       setUserProfile(userProfile);
  //     })
  //     .catch((error) => console.error("Error updating user profile:", error));
  // };

  const fetchUsers = () => {
    const url = `${BASE_URL}/api/users`;
    // Fetch the list of users for the admin dashboard
    axios
      .get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    window.location.reload();
  };

  const handleApproval = (userId, isApproved) => {
    setLoadingUser(userId);
    axios
      .put(
        `${BASE_URL}/api/users/approve/${userId}`,
        { isAdminApproved: isApproved },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then(() => {
        fetchUsers();
        setLoadingUser(null);
      })
      .catch((error) => {
        console.error("Error updating user status:", error);
        setLoadingUser(null);
      });
  };

  //   const handleDownload = (filePath) => {
  //     const url = `${BASE_URL}/${filePath}`;
  //     window.open(url, "_blank");
  //   };
  //   const renderPhoto = (photo) => {
  //     if (photo && photo.data) {
  //       const base64Image = `data:${
  //         photo.contentType
  //       };base64,${photo.data.toString("base64")}`;
  //       return (
  //         <img
  //           src={base64Image}
  //           alt="Profile"
  //           className={styles.profile_picture}
  //         />
  //       );
  //     } else {
  //       return "No Picture";
  //     }
  //   };

  //   const renderCV = (cv) => {
  //     if (cv && cv.data) {
  //       return (
  //         <button
  //           onClick={() => handleDownload(`uploads/${cv}`)}
  //           className={styles.download_btn}
  //         >
  //           Download CV
  //         </button>
  //       );
  //     } else {
  //       return "No CV";
  //     }
  //   };

  return (
    <>
      <div className={styles.main_container}>
        <nav className={styles.navbar}>
          <h1>IIT_B Dashboard</h1>
          <button className={styles.white_btn} onClick={handleLogout}>
            Logout
          </button>
        </nav>
        <div className={styles.main_dashboard}>
          {userData && userData.isAdmin ? (
            <div className={styles.admin_section}>
              <h2>Hi {userData.username}, Welcome as Admin</h2>
              <table className={styles.user_table}>
                <thead>
                  <tr>
                    {/* <th>Picture</th> */}
                    <th>Username</th>
                    <th>Email</th>
                    <th>DOB</th>
                    {/* <th>CV</th> */}
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      {/* <td>{renderPhoto(user.photo)}</td> */}
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{new Date(user.dob).toLocaleDateString()}</td>
                      {/* <td>{renderCV(user.cv)}</td> */}
                      <td>{user.isAdminApproved ? "Approved" : "Pending"}</td>
                      <td>
                        <button
                          onClick={() =>
                            handleApproval(user._id, !user.isAdminApproved)
                          }
                          className={
                            user.isAdminApproved
                              ? styles.disapprove_btn
                              : styles.approve_btn
                          }
                          disabled={loadingUser === user._id}
                        >
                          {loadingUser === user._id
                            ? "Loading..."
                            : user.isAdminApproved
                            ? "Disapprove"
                            : "Approve"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
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
                    {/* <div className={styles.form_container_div}>
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
                    </div> */}
                    {/* <div className={styles.form_container_div}>
                      <label>CV:</label>
                      <input
                        className={styles.input}
                        type="file"
                        accept=".pdf"
                        onChange={(e) =>
                          setUserProfile({
                            ...userProfile,
                            cv: e.target.files[0],
                          })
                        }
                      />
                      {userProfile.cv && (
                        <a
                          href={`${BASE_URL}/${userProfile.cv}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View CV
                        </a>
                      )}
                    </div> */}

                    {/* <div className={styles.form_container_div}>
                      <label>Photo:</label>
                      <input
                        className={styles.input}
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setUserProfile({
                            ...userProfile,
                            photo: e.target.files[0],
                          })
                        }
                      />
                      {userProfile.photo && (
                        <img
                          //   src={URL.createObjectURL(userProfile.photo)}
                          alt="Profile"
                          className={styles.profile_picture}
                        />
                      )}
                    </div> */}
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
          )}
        </div>
      </div>
    </>
  );
};

export default Main;
