import React from "react";
import Sidebar from "../components/Sidebar";
import "../styles/Home.css";

export default function Home() {
  return (
    <>
      <div className="home">
        <Sidebar className="sidebar" />
        <div className="home-content">
            <h1>Home</h1>
        </div>
      </div>
    </>
  );
}
