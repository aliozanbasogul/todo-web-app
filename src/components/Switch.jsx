// Switch.jsx
import React, { useState } from "react";

const Switch = ({ isChecked, handleToggle }) => {
  return (
    <label className="switch">
      <input type="checkbox" checked={isChecked} onChange={handleToggle} />
      <span className="slider">
        <span className="text-left">Login</span>
        <span className="text-right">Register</span>
      </span>
    </label>
  );
};

export default Switch;
