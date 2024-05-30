import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./styles.module.css";
import User from "./User";

const Main = () => {
  const [userData, setUserData] = useState(null);
  const [users, setUsers] = useState([]);
  const [loadingUser, setLoadingUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updatedUser, setUpdatedUser] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);

  const BASE_URL = "http://localhost:8000";
  // const BASE_URL = "https://iitb-assignment.onrender.com";

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    setUserData(userData);
    if (userData && userData.isAdmin) {
      fetchUsers();
    }
  }, []);

  const fetchUsers = () => {
    const url = `${BASE_URL}/api/users`;
    axios
      .get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowModal(true);
    setUpdatedUser({ ...user });
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setShowModal(false);
    setUpdatedUser(null);
    setCvFile(null);
    setPhotoFile(null);
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
      // console.log("cloudi", data);
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading file to Cloudinary:", error);
      throw error;
    }
  };

  const handleSubmitEdit = async () => {
    if (updatedUser.username.length < 3 || updatedUser.username.length > 20) {
      alert("Username must be between 3 and 20 characters.");
      return;
    }

    // Basic email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(updatedUser.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    let photoUrl, cvUrl;
    console.log(photoUrl, cvUrl);
    if (photoFile !== null) {
      photoUrl = await uploadToCloudinary(photoFile);
      setUpdatedUser((prevUser) => ({ ...prevUser, photo: photoUrl }));
    }

    if (cvFile !== null) {
      cvUrl = await uploadToCloudinary(cvFile);
      setUpdatedUser((prevUser) => ({ ...prevUser, cv: cvUrl }));
    }
    console.log(photoUrl, cvUrl);

    await new Promise((resolve) => setTimeout(resolve, 100));

    // Reconstruct the changes object after state updates
    const changes = {};
    for (const key in selectedUser) {
      if (selectedUser[key] !== updatedUser[key]) {
        changes[key] = updatedUser[key];
      }
    }
    // Add photoUrl and cvUrl to changes if they are defined
    if (photoUrl) {
      changes.photo = photoUrl;
    }
    if (cvUrl) {
      changes.cv = cvUrl;
    }

    console.log("Selected User:", selectedUser);
    console.log("Updated User:", updatedUser);
    console.log("Changes:", changes);

    axios
      .put(`${BASE_URL}/api/users/${selectedUser._id}`, changes, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => {
        fetchUsers();
        handleCloseModal();
      })
      .catch((error) => console.error("Error updating user data:", error));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "cv") {
      setCvFile(files[0]);
    } else if (name === "photo") {
      setPhotoFile(files[0]);
    }
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
                    <th>Username</th>
                    <th>Email</th>
                    <th>DOB</th>
                    <th>Status</th>
                    <th>Actions</th>
                    <th>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{new Date(user.dob).toLocaleDateString()}</td>
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
            <User userData={userData} />
            // <User userData={userData} />
          )}
        </div>
      </div>
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.editUserHeader}>
              <h2>Edit User</h2>
              <img
                src={updatedUser.photo}
                alt="Profile"
                className={styles.profileIcon}
              />
            </div>
            <form className={styles.form}>
              <div className={styles.formGroup}>
                <label>Username:</label>
                <input
                  type="text"
                  name="username"
                  value={updatedUser.username}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={updatedUser.email}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Date of Birth:</label>
                <input
                  type="date"
                  name="dob"
                  value={formatDate(updatedUser.dob)}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label>CV:</label>
                <div className={styles.input_container}>
                  <input
                    type="file"
                    name="cv"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    required
                    className={styles.input_field}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Photo:</label>
                <div className={styles.input_container}>
                  <input
                    type="file"
                    name="photo"
                    accept="image/jpeg, image/png"
                    onChange={handleFileChange}
                    required
                    className={styles.input_field}
                  />
                </div>
              </div>

              {/* Buttons for saving changes and closing modal */}
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.saveBtn}
                  onClick={handleSubmitEdit}
                >
                  Save
                </button>
                <button
                  type="button"
                  className={styles.closeBtn}
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Main;
