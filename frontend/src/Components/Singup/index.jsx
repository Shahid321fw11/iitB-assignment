import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import ReCAPTCHA from "react-google-recaptcha"; // Added for CAPTCHA

const Signup = () => {
  const BASE_URL = "https://iitb-assignment.onrender.com";
  // const BASE_URL = "http://localhost:8000";
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    dob: "",
    photo: null,
    cv: null,
    captcha: "",
  });

  const [captchaVerified, setCaptchaVerified] = useState(false); // State for CAPTCHA verification
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  // Handle input change
  const handleChange = ({ target }) => {
    setData({ ...data, [target.name]: target.value });
  };

  // Handle CAPTCHA verification
  const handleCaptcha = (value) => {
    setData({ ...data, captcha: value });
    setCaptchaVerified(!!value);
  };

  // handle file change for cv and photo
  const handleFileChange = ({ target }) => {
    setData({ ...data, [target.name]: target.files[0] });
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

  // Function to validate form data
  const validateForm = () => {
    const errors = {};
    if (!data.username.trim()) errors.username = "Username is required.";
    if (!data.email.trim()) errors.email = "Email is required.";
    if (!data.password.trim()) errors.password = "Password is required.";
    if (!data.dob.trim()) errors.dob = "Date of Birth is required.";
    if (!data.photo) errors.photo = "Profile picture is required.";
    if (!data.cv) errors.cv = "CV is required.";
    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      if (!captchaVerified) {
        setError("Please complete the CAPTCHA verification.");
        return;
      }

      const profilePic = await uploadToCloudinary(data.photo);
      const cv = await uploadToCloudinary(data.cv);

      const formData = {
        username: data.username,
        email: data.email,
        password: data.password,
        dob: data.dob,
        photo: profilePic,
        cv: cv,
        captcha: data.captcha,
      };

      console.log("sending data", formData);

      const url = `${BASE_URL}/api/users`;
      const response = await axios.post(url, formData);

      navigate("/login");
      console.log(response.data.message);
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <div className={styles.signup_container}>
      <div className={styles.signup_form_container}>
        <div className={styles.left}>
          <h1>Welcome Back</h1>
          <Link to="/login">
            <button type="button" className={styles.white_btn}>
              Sign in
            </button>
          </Link>
        </div>
        <div className={styles.right}>
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <h1>Create Account</h1>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
              value={data.username}
              required
              className={styles.input}
              minLength={3}
              maxLength={15}
            />
            {fieldErrors.username && (
              <div className={styles.error_msg}>{fieldErrors.username}</div>
            )}
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={data.email}
              required
              className={styles.input}
              minLength={6}
              maxLength={20}
            />
            {fieldErrors.email && (
              <div className={styles.error_msg}>{fieldErrors.email}</div>
            )}
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={data.password}
              required
              className={styles.input}
              minLength={6}
              maxLength={20}
            />
            {fieldErrors.password && (
              <div className={styles.error_msg}>{fieldErrors.password}</div>
            )}
            <input
              type="date"
              name="dob"
              onChange={handleChange}
              value={data.dob}
              required
              className={styles.input}
            />
            {fieldErrors.dob && (
              <div className={styles.error_msg}>{fieldErrors.dob}</div>
            )}
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
            {fieldErrors.photo && (
              <div className={styles.error_msg}>{fieldErrors.photo}</div>
            )}
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
            {fieldErrors.cv && (
              <div className={styles.error_msg}>{fieldErrors.cv}</div>
            )}
            <ReCAPTCHA
              sitekey="6LcvLuopAAAAAPfU0avqIaru49qmrsJq7Kl6H0Pb" // Added ReCAPTCHA component
              onChange={handleCaptcha}
            />
            {error && <div className={styles.error_msg}>{error}</div>}
            <button
              type="submit"
              className={styles.green_btn}
              // disabled={!captchaVerified}
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Signup;
