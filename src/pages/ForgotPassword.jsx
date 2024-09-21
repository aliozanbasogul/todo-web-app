import React from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../auth/firebaseConfig";
import "../styles/Form.css";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer} from "react-toastify";

const ForgotPassword = () => {

    const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailVal = e.target.email.value;
    console.log("Forgot password form submitted", emailVal);
    try {
      await sendPasswordResetEmail(auth, emailVal).then(() => {
        console.log("Reset email sent");
        toast.success("Reset email sent! Please check your email.");
        setTimeout(() => {
          navigate("/authpage");
        }, 3000);
      });
    } catch (error) {
      console.log("Reset email failed:", error.message);
    }
  };

  return (
    <>
    <div className="form-container">
      <h1>Forgot Password</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="input-group">
          <label>Email</label>
          <input
            name="email"
            type="email"
            placeholder="Enter your email"
            required
          />
        </div>
        <button type="submit" className="">
          Send Reset Email
        </button>
      </form>
    </div>

    <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
    />
    </>
  );
};

export default ForgotPassword;
