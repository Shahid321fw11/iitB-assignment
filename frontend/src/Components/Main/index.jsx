import styles from "./styles.module.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ModalPopup from "../Modal";
// import "./App.css";

const Main = () => {
  const [userData, setUserData] = useState(null);
  const [users, setUsers] = useState([]);
  const [userProfile, setUserProfile] = useState(null); // Added userProfile state
  const [loadingUser, setLoadingUser] = useState(null);
  const BASE_URL = "http://localhost:8000";

  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleEdit = (user) => {
    console.log("sele", user);
    setSelectedUser(user);
    setShowModal(true);
  };

  // Event handler to close modal
  const handleCloseModal = () => {
    setSelectedUser(null);
    setShowModal(false);
  };

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

  // Function to fetch the list of users (admin functionality)
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
  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    window.location.reload();
  };

  // Function to handle user approval/disapproval
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

  // Function to upload file to Cloudinary
  const uploadToCloudinary = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "my-mern-chat-app-cloud"); //due to limit 1 of cloudinary using my old account.
      formData.append("cloud_name", "my-chat-app-mern-cloudinary"); // Replace with your Cloudinary cloud name
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/my-chat-app-mern-cloudinary/image/upload`, // Replace with your Cloudinary endpoint
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      return data.secure_url; // Return the secure URL of the uploaded file
    } catch (error) {
      console.error("Error uploading file to Cloudinary:", error);
      throw error;
    }
  };

  // Function to handle the submission of edited user data from the modal
  const handleSubmitEdit = async (updatedUserData) => {
    // console.log("pre", selectedUser);
    // console.log("update", updatedUserData);

    // Check if CV has been updated
    if (selectedUser.cv !== updatedUserData.cv) {
      const cvUrl = await uploadToCloudinary(updatedUserData.cv);
      updatedUserData.cv = cvUrl;
    }

    // Check if photo has been updated
    if (selectedUser.photo !== updatedUserData.photo) {
      const photoUrl = await uploadToCloudinary(updatedUserData.photo);
      updatedUserData.photo = photoUrl;
    }

    axios
      .put(`${BASE_URL}/api/users/${updatedUserData._id}`, updatedUserData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => {
        fetchUsers();
        handleCloseModal();
      })
      .catch((error) => console.error("Error updating user data:", error));
  };

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
                    <th>Edit</th>
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
                      <td>
                        <button onClick={() => handleEdit(user)}>Edit</button>
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
      {showModal && (
        <ModalPopup
          user={selectedUser}
          onSubmit={handleSubmitEdit}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default Main;
