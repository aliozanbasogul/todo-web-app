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
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../auth/firebaseConfig.js";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; 
import { BrowserRouter, Route, Routes, Navigate, useNavigate } from 'react-router-dom';

const LoginRegister = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [resetFields, setResetFields] = useState(false);

  const navigate = useNavigate();

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
        toast.success("Registration successful! Please check your email for verification.");
        navigate('/home');
      } catch (error) {
        console.log("Registration failed:", error.message);
        toast.error("Registration failed.");
      }
    } else {
      console.log("Login form submitted", email, password);
      await handleLogin(email, password);
      toast.success("Login successful.");
    }
  };

  const handleRegister = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);

      const result = await FirebaseMethods.AddAuthUserToFirestore(auth, email, password);

      if (!result.success) {
        throw new Error(result.message);
      }
    } catch (error) {
      throw error;
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      navigate('/home');
      if (!user.emailVerified) {
        toast.info("Please verify your email before logging in.");
        return;
      }
    } catch (error) {
      throw error;
    }
  }

  return (
    <div style={{ textAlign: "center" }}>
      <Switch isChecked={isChecked} handleToggle={handleToggle} />
      <AuthForm
        formType={isChecked ? "Register" : "Login"}
        handleSubmit={handleSubmit}
        resetFields={resetFields}
      />
      {/* Add ToastContainer to render the toast messages */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        rtl={false}
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default LoginRegister;
