import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";

import CusRegister from "../Pages/Customer/cusRegister"; 
import ModalLogin from "../Pages/Customer/cusLogin"; 
import "./navBar.css";


const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 100);
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
    setShowRegisterModal(false);
  };

  const handleRegisterClick = () => {
    setShowRegisterModal(true);
    setShowLoginModal(false);
  };

  const closeModals = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
  };

  return (
    <>
      <nav className="navbar" style={{ backgroundColor: colors.background, color: colors.text }}>
        <div className="navbar-left">
          <Link to="/" className="logo">
            <img src={require("./Foodie_logo.png")} alt="Logo" className="logo-small" />
          </Link>

          <div className="location-dropdown">
           
          </div>
        </div>

        <div className="navbar-right">
          <div
            className="dropdown"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <span className="nav-link" style={{ color: colors.text }}>Partners ⌄</span>
            {isDropdownOpen && (
              <div className="dropdown-menu" style={{ backgroundColor: colors.dropdownBg, borderRadius: 10 }}>
                <Link to="/merchants" className="dropdown-item" style={{ color: colors.text, borderRadius: 10 }}>Merchants</Link>
                <Link to="/couriers" className="dropdown-item" style={{ color: colors.text, borderRadius: 10 }}>Couriers</Link>
              </div>
            )}
          </div>

          <button 
            className="nav-link" 
            style={{ 
              color: colors.text, 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              fontSize: '1rem',
              fontFamily: 'inherit'
            }} 
            onClick={handleLoginClick}
          >
            Log in
          </button>
          <button 
            className="signup-button"
            onClick={handleRegisterClick}
          >
            Sign up
          </button>
        </div>
      </nav>

      {/* Login Modal */}
      {showLoginModal && (
        <ModalLogin 
          onClose={closeModals} 
          onSignUpClick={handleRegisterClick}
        />
      )}

      {/* Registration Modal */}
      {showRegisterModal && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <CusRegister onClose={closeModals} onLoginClick={handleLoginClick} />
          </div>
        </div>
      )}
    </>
  );
};

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

export default Navbar;