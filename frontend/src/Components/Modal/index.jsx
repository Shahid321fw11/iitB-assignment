import React, { useState } from "react";
import styles from "./styles.module.css";

const ModalPopup = ({ user, onSubmit, onClose }) => {
  // State to manage the edited user data
  const [editedUser, setEditedUser] = useState(user);

  // Function to handle input changes and update edited user data
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  // Function to handle file changes for photo and CV
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setEditedUser({ ...editedUser, [name]: files[0] });
  };

  // Function to handle form submission
  const handleSubmit = () => {
    onSubmit(editedUser);
  };

  // Function to format date string to YYYY-MM-DD format
  const formatDate = (dateString) => {
    if (!dateString) return ""; // Handle empty dateString
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Ensure two digits for month
    const day = date.getDate().toString().padStart(2, "0"); // Ensure two digits for day
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.editUserHeader}>
          <h2>Edit User</h2>
          <img
            src={editedUser.photo}
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
              value={editedUser.username}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={editedUser.email}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Date of Birth:</label>
            <input
              type="date"
              name="dob"
              value={formatDate(editedUser.dob)}
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

          {/* Buttons for saving changes and closing modal */}
          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.saveBtn}
              onClick={handleSubmit}
            >
              Save
            </button>
            <button type="button" className={styles.closeBtn} onClick={onClose}>
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalPopup;
