import React, { useState, useEffect } from "react";
import Switch from "./Switch.jsx";
import AuthForm from "./AuthForm"; // Import the reusable form component
import "../styles/Form.css"; // Assuming this handles your general styles
import "../styles/Switch.css"; // Assuming this handles your general styles
import FirebaseMethods from "../auth/FirebaseMethods.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../auth/firebaseConfig.js";
import { toast } from "react-toastify";

const LoginRegister = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [resetFields, setResetFields] = useState(false); // State to trigger field reset

  // Toggle between Login and Register
  const handleToggle = () => {
    setIsChecked(!isChecked);
    setResetFields(true); // Trigger field reset when toggling
  };

  // Reset resetFields state after form switches
  useEffect(() => {
    if (resetFields) {
      setResetFields(false); // Reset happens once per switch
    }
  }, [resetFields]);

  const handleSubmit = async (email, password) => {
    if (isChecked) {
      // Handle Register form
      console.log("Register form submitted", email, password);
      try {
        // Call handleRegister and wait for the result
        await handleRegister(email, password);
        console.log("Registration successful");
      } catch (error) {
        console.log("Registration failed:", error.message);
      }
    } else {
      console.log("Login form submitted", email, password);
      // Handle Login logic here
    }
  };

  // Handle user registration and email verification
  const handleRegister = async (email, password) => {
    try {
      // Create user with Firebase authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(user);
      toast.success("Email verification link sent to your email");

      // Add user to Firestore
      const result = await FirebaseMethods.AddAuthUserToFirestore(auth, email, password);

      if (result.success) {
        toast.success("Account created successfully and added to Firestore!");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Error during registration: " + error.message);
      throw error; // Re-throw the error to be caught by handleSubmit
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Switch isChecked={isChecked} handleToggle={handleToggle} />
      <AuthForm
        formType={isChecked ? "Register" : "Login"}
        handleSubmit={handleSubmit}
        resetFields={resetFields}
      />
    </div>
  );
};

export default LoginRegister;
