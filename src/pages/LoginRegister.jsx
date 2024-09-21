import React, { useState, useEffect } from "react";
import Switch from "../components/Switch";
import AuthForm from "../components/AuthForm";
import "../styles/Form.css";
import "../styles/Switch.css";
import FirebaseMethods from "../auth/FirebaseMethods.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../auth/firebaseConfig.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const LoginRegister = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [resetFields, setResetFields] = useState(false);

  const navigate = useNavigate();

  const handleToggle = () => {
    setIsChecked(!isChecked);
    setResetFields(true);
  };

  useEffect(() => {
    if (resetFields) {
      setResetFields(false);
    }
  }, [resetFields]);

  const handleSubmit = async (email, password, confirmPassword, username) => {
    if (isChecked) {
      console.log("Register form submitted", email, password, confirmPassword);
      if (password !== confirmPassword) {
        toast.error("Passwords do not match!");
        return;
      }

      try {
        await handleRegister(email, password, username);
        toast.success(
          "Registration successful! Please check your email for verification."
        );
        setTimeout(() => {
          window.location.reload();
          navigate("/authpage");
        }, 5000);
      } catch (error) {
        console.log("Registration failed:", error.message);
        toast.error("Registration failed.");
      }
    } else {
      console.log("Login form submitted", email, password);
      await handleLogin(email, password);
    }
  };

  const handleRegister = async (email, password, username) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await sendEmailVerification(user);
      await FirebaseMethods.AddAuthUserToFirestore(auth, email, username);
    } catch (error) {
      throw error;
    }
  };

  const handleLogin = async (email, password) => {
    try {
      console.log("Attempting to log in with email:", email);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (!user.emailVerified) {
        toast.info("Please verify your email before logging in.");
        return;
      } else {
        navigate("/home");
      }
    } catch (error) {
      console.error("Error details:", error);
      const errorCode = error.code;

      switch (errorCode) {
        case "auth/invalid-email":
          toast.error("Invalid email format. Please check your email.");
          break;
        case "auth/user-not-found":
          toast.error("User not found. Please register.");
          break;
        case "auth/wrong-password":
          toast.error("Incorrect password. Please try again.");
          break;
        default:
          toast.error("Login failed. Please try again.");
          console.log("Login failed:", error.message);
          break;
      }
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Google sign in successful:", user);
      navigate("/home");
    } catch (error) {
      console.log("Google sign in failed:", error.message);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Switch isChecked={isChecked} handleToggle={handleToggle} />
      <AuthForm
        formType={isChecked ? "Register" : "Login"}
        handleSubmit={handleSubmit}
        handleGoogleSubmit={handleGoogleSignIn}
        resetFields={resetFields}
      />
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