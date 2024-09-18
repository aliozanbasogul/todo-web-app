import React, { useState } from "react";
import Switch from "./Switch.jsx";
import AuthForm from "./AuthForm"; // Import the reusable form component
import "../styles/Form.css"; // Assuming this handles your general styles

const LoginRegister = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleToggle = () => {
    setIsChecked(!isChecked);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isChecked) {
      // Handle Register submit logic
      console.log("Register form submitted");
    } else {
      // Handle Login submit logic
      console.log("Login form submitted");
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      {/* Switch Component to toggle between Login and Register */}
      <Switch isChecked={isChecked} handleToggle={handleToggle} />

      {/* Conditionally render AuthForm with correct formType */}
      <AuthForm 
        formType={isChecked ? "Register" : "Login"} 
        handleSubmit={handleSubmit} 
      />
    </div>
  );
};

export default LoginRegister;
