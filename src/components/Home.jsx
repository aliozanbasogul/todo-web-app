import React from "react";
import useAuth from "../hooks/useAuth"; 
import ReactLoading from 'react-loading';
import { signOut } from 'firebase/auth';
import { auth } from "../auth/firebaseConfig";
import { useNavigate } from "react-router-dom"; 

const Home = () => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate(); 

  if (loading) {
    return (
      <div className="loading-container">
        <ReactLoading type={"spokes"} height={50} width={50} />
      </div>
    );
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth);

      localStorage.clear();
      sessionStorage.clear();

      navigate("/authpage");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  return (
    <div className="home-container">
      <h1>Welcome, {currentUser.username}</h1>
      <p>Email: {currentUser.email}</p>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};

export default Home;
