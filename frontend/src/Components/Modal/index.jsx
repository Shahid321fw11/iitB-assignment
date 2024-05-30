import React, { useState } from "react";
import styles from "./styles.module.css";

const ModalPopup = ({ user, onSubmit, onClose }) => {
  // State to manage the edited user data
  const [editedUser, setEditedUser] = useState(user); // current user
  // State to track if the CV or photo has been updated
  const [cvFile, setCvFile] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);

  // Function to handle input changes and update edited user data
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  // Function to handle file changes for photo and CV
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "cv") {
      setCvFile(files[0]);
    } else if (name === "photo") {
      setPhotoFile(files[0]);
    }
  };

  // Function to upload file to Cloudinary
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

  // Function to handle form submission
  const handleSubmit = async () => {
    // Check for changes in the CV and photo
    if (cvFile) {
      const cvUrl = await uploadToCloudinary(cvFile);
      setEditedUser((prevUser) => ({ ...prevUser, cv: cvUrl }));
    }
    if (photoFile) {
      const photoUrl = await uploadToCloudinary(photoFile);
      setEditedUser((prevUser) => ({ ...prevUser, photo: photoUrl }));
    }

    // Submit changes
    onSubmit(editedUser);
  };

  // Function to format date string to YYYY-MM-DD format
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
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
