import React from "react";
import { Link } from "react-router-dom";
import "./navBar.css";


const colors = {
  background: "#212529",
  text: "#FFFFFF",
  hover: "#0A9396",
  button: "#0A9396",
  buttonHover: "#CA6702",
  dropdownBg: "#212529",
  inputBg: "#0A9396",
  inputText: "#FFFFFF",
  inputBorder: "#94D2BD",
};

const ResNavbar = () => {
  

  return (
    <nav className="navbar" style={{ backgroundColor: colors.background, color: colors.text }}>
      <div className="navbar-left">
        {/* Logo */}
        <Link to="/" className="logo">
          <img src={require("./Foodie_logo.png")} alt="Logo" className="logo-small" />
        </Link>

        {/* Location Selector */}
        <div className="location-dropdown">
        <span className="nav-link" style={{ color: colors.text }}>For merchants</span>
        </div>
      </div>

      {/* Right Section: Navigation Links & Auth Buttons */}
      <div className="navbar-right">
        

        <Link to="/merchants" className="nav-link" style={{ color: colors.text }}>Log in</Link>
        <Link to="/merchants-signUp" className="signup-button">
          Sign up
        </Link>
      </div>
    </nav>
  );
};

export default ResNavbar;
