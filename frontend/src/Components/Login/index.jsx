import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import ReCAPTCHA from "react-google-recaptcha";

const Login = () => {
  const BASE_URL = "https://iitb-assignment.onrender.com";
  // const BASE_URL = "http://localhost:8000";
  const [data, setData] = useState({ username: "", password: "", captcha: "" });
  const [captchaVerified, setCaptchaVerified] = useState(false); // State for CAPTCHA verification
  const [error, setError] = useState("");

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleCaptcha = (value) => {
    setData({ ...data, captcha: value }); // Added handleCaptcha function
    setCaptchaVerified(!!value); // Update CAPTCHA verification state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `${BASE_URL}/api/auth`;
      console.log("logindata", data);
      const { data: res } = await axios.post(url, data);
      localStorage.setItem("token", res.data);
      localStorage.setItem("userData", JSON.stringify(res.userData));
      window.location = "/";
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
    <div className={styles.login_container}>
      <div className={styles.login_form_container}>
        <div className={styles.left}>
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <h1>Login to Your Account</h1>
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
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={data.password}
              required
              className={styles.input}
            />

            <ReCAPTCHA
              sitekey="6LcvLuopAAAAAPfU0avqIaru49qmrsJq7Kl6H0Pb"
              // sitekey="your-recaptcha-site-key" // Added ReCAPTCHA component
              onChange={handleCaptcha}
            />

            {error && <div className={styles.error_msg}>{error}</div>}
            <button
              type="submit"
              className={styles.green_btn}
              disabled={!captchaVerified} // Disable button if CAPTCHA is not verified
            >
              Sign In
            </button>
          </form>
        </div>
        <div className={styles.right}>
          <h1>New Here ?</h1>
          <Link to="/signup">
            <button type="button" className={styles.white_btn}>
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
