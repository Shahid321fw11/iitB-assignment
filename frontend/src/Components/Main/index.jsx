import styles from "./styles.module.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
// import "./App.css";

const Main = () => {
  const [userData, setUserData] = useState(null);
  const [users, setUsers] = useState([]);
  const BASE_URL = "http://localhost:8000";

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    setUserData(userData);
    if (userData && userData.isAdmin) {
      fetchUsers();
    }
  }, []);

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
    axios
      .put(
        `/api/admin/approve/${userId}`,
        { isApproved },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then(() => fetchUsers())
      .catch((error) => console.error("Error updating user status:", error));
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
        <div className={styles.main_weather}>
          {userData && userData.isAdmin ? (
            <div className={styles.admin_section}>
              <h2>Manage Users</h2>
              <table className={styles.user_table}>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>DOB</th>
                    <th>Approval Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{user.dob}</td>
                      <td>{user.isApproved ? "Approved" : "Pending"}</td>
                      <td>
                        <button
                          onClick={() =>
                            handleApproval(user._id, !user.isApproved)
                          }
                          className={
                            user.isApproved
                              ? styles.disapprove_btn
                              : styles.approve_btn
                          }
                        >
                          {user.isApproved ? "Disapprove" : "Approve"}
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
              <p>Here you can manage your profile.</p>
              {/* Add more user-specific functionalities here */}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Main;
