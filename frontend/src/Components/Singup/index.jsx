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
  const navigate = useNavigate();

  // Handle input change
  const handleChange = ({ currentTarget: input }) => {
    if (input.type === "file") {
      const updatedData = { ...data, [input.name]: input.files[0] };
      setData(updatedData);
    } else {
      setData({ ...data, [input.name]: input.value });
    }
  };

  // Handle CAPTCHA verification
  const handleCaptcha = (value) => {
    setData({ ...data, captcha: value });
    setCaptchaVerified(!!value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("dob", data.dob);
    formData.append("photo", data.photo);
    formData.append("cv", data.cv);
    formData.append("captcha", data.captcha);

    console.log("form", data);
    console.log("formData", formData);
    try {
      const url = `${BASE_URL}/api/users`;
      console.log(url, BASE_URL);
      const { data: res } = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/login");
      console.log(res.message);
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
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={data.email}
              className={styles.input}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={data.password}
              required
              className={styles.input}
            />
            <input
              type="date"
              name="dob"
              onChange={handleChange}
              value={data.dob}
              required
              className={styles.input}
            />
            <input
              type="file"
              name="photo"
              accept="image/jpeg, image/png"
              onChange={handleChange}
              required
              className={styles.input}
            />
            <input
              type="file"
              name="cv"
              accept="application/pdf"
              onChange={handleChange}
              required
              className={styles.input}
            />
            <ReCAPTCHA
              // sitekey="your-recaptcha-site-key" // Added ReCAPTCHA component
              sitekey="6Lf5cOgpAAAAAKxYvKrw8X_vcsN9KsNi0OCNpGD4" // Added ReCAPTCHA component
              onChange={handleCaptcha}
            />
            {error && <div className={styles.error_msg}>{error}</div>}
            <button
              type="submit"
              className={styles.green_btn}
              disabled={!captchaVerified}
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
