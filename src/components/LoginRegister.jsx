import React, { useState, useEffect } from "react";
import Switch from "./Switch.jsx";
import AuthForm from "./AuthForm"; 
import "../styles/Form.css"; 
import "../styles/Switch.css"; 
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
  const [resetFields, setResetFields] = useState(false); 

  // Toggle between Login and Register
  const handleToggle = () => {
    setIsChecked(!isChecked);
    setResetFields(true);
  };

  useEffect(() => {
    if (resetFields) {
      setResetFields(false); 
    }
  }, [resetFields]);

  const handleSubmit = async (email, password) => {
    if (isChecked) {
      console.log("Register form submitted", email, password);
      try {
        await handleRegister(email, password);
        console.log("Registration successful");
      } catch (error) {
        console.log("Registration failed:", error.message);
      }
    } else {
      console.log("Login form submitted", email, password);
    }
  };

  // Handle user registration and email verification
  const handleRegister = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);
      toast.success("Email verification link sent to your email");

      const result = await FirebaseMethods.AddAuthUserToFirestore(auth, email, password);

      if (result.success) {
        toast.success("Account created successfully and added to Firestore!");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Error during registration: " + error.message);
      throw error; 
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
