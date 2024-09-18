import React, { useState, useEffect } from "react";
import "../styles/Form.css"; 

const AuthForm = ({ formType, handleSubmit, resetFields }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Effect to reset form fields when switching between forms
  useEffect(() => {
    if (resetFields) {
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }
  }, [resetFields]);

  const googleIcon = (
    <button className="gsi-material-button">
      <div className="gsi-material-button-state"></div>
      <div className="gsi-material-button-content-wrapper">
        <div className="gsi-material-button-icon">
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            style={{ display: "block" }}
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            ></path>
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            ></path>
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            ></path>
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            ></path>
            <path fill="none" d="M0 0h48v48H0z"></path>
          </svg>
        </div>
      </div>
    </button>
  );

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(email, password); // Pass the email and password to the parent
  };

  return (
    <div className="form-container">
      <h1>{formType}</h1>
      <form onSubmit={onSubmit}>
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {formType === "Register" && (
          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        )}

        {formType === "Login" && (
          <div className="actions-container">
            <a href="/forgot-password" className="forgot-password-link">
              Forgot Password?
            </a>
            <a href="/google-sign-in" className="google-sign-in">
              {googleIcon}
            </a>
          </div>
        )}

        {formType === "Register" && (
          <div className="actions-container center">
            <a href="/google-sign-in" className="google-sign-in">
              {googleIcon}
            </a>
          </div>
        )}

        <button type="submit">{formType}</button>
      </form>
    </div>
  );
};

export default AuthForm;
