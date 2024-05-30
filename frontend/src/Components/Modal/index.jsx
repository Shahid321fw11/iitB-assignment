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

  // Function to handle form submission
  const handleSubmit = () => {
    onSubmit(editedUser);
  };

  // Function to format date string to MM/DD/YYYY format
  const formatDate = (dateString) => {

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {/* Edit User heading with icon */}
        <div className={styles.editUserHeader}>
          <h2>Edit User</h2>
          {/* Icon for better recognition */}
          <img
            src={editedUser.photo}
            alt="Profile"
            className={styles.profileIcon}
          />
        </div>
        <form className={styles.form}>
          {/* Input field for username */}
          <div className={styles.formGroup}>
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={editedUser.username}
              onChange={handleChange}
            />
          </div>
          {/* Input field for email */}
          <div className={styles.formGroup}>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={editedUser.email}
              onChange={handleChange}
            />
          </div>
          {/* Input field for date of birth */}
          <div className={styles.formGroup}>
            <label>Date of Birth:</label>
            <input
              type="date"
              name="dob"
              value={formatDate(editedUser.dob)}
              onChange={handleChange}
            />
          </div>
          {/* Input field for CV */}
          <div className={styles.formGroup}>
            <label>CV:</label>
            <input
              type="text"
              name="cv"
              value={editedUser.cv}
              onChange={handleChange}
            />
          </div>
          {/* Input field for photo */}
          <div className={styles.formGroup}>
            <label>Photo:</label>
            <div className={styles.photoInput}>
              <input
                type="text"
                name="photo"
                value={editedUser.photo}
                onChange={handleChange}
              />
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
