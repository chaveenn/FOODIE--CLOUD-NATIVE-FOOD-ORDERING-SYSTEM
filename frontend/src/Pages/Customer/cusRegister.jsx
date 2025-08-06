import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { PulseLoader } from "react-spinners";
import axios from "axios";
import "./cusLogin.css";

const ModalRegister = ({ onClose, onLoginClick }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    nic: "",
    role: "customer"
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "nic" ? value.toUpperCase() : value
    }));

    // Clear password match error when either password field changes
    if (name === "password" || name === "confirmPassword") {
      setPasswordMatchError("");
    }
  };

  const validatePasswords = () => {
    if (formData.password !== formData.confirmPassword) {
      setPasswordMatchError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    
    // Validate passwords match
    if (!validatePasswords()) {
      return;
    }

    setIsLoading(true);

    try {
      // Create payload without confirmPassword
      const { confirmPassword, ...payload } = formData;
      
      const response = await axios.post(
        "http://localhost:8000/users/register-user", 
        payload
      );
      
      if (response.data.message === "User registered successfully") {
        // Registration successful - switch to login modal
        onLoginClick();
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Registration failed", error);
      if (error.response?.data?.message) {
        setErrorMsg(error.response.data.message);
      } else if (error.response?.data?.errors) {
        // Handle validation errors
        const errorMessages = Object.values(error.response.data.errors).flat();
        setErrorMsg(errorMessages.join(", "));
      } else {
        setErrorMsg("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="login-form-container">
          <div className="icons">
            <h1>Join Foodie Today!</h1>
            <p>Create your account to start your food journey</p>
          </div>

          <form onSubmit={handleRegister}>
            <div className="input-group">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="input-field"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="input-field"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group password-input">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create Password"
                className="input-field"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
              />
              <span 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="input-group password-input">
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Re-enter Password"
                className="input-field"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength="6"
              />
              <span 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              {passwordMatchError && (
                <div className="error-message" style={{ marginTop: '5px' }}>
                  {passwordMatchError}
                </div>
              )}
            </div>

            <div className="input-group">
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                className="input-field"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="text"
                name="address"
                placeholder="Full Address"
                className="input-field"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="text"
                name="nic"
                placeholder="NIC Number"
                className="input-field"
                value={formData.nic}
                onChange={handleChange}
                required
              />
            </div>

            {errorMsg && <div className="error-message">{errorMsg}</div>}

            <button type="submit" className="sign-in-btn" disabled={isLoading}>
              {isLoading ? (
                <PulseLoader color="#fff" size={8} />
              ) : (
                "Register"
              )}
            </button>
          </form>

          <div className="social-login">
            <p>Already have an account?</p>
            <button type="button" className="sign-in-btn" onClick={onLoginClick}>
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalRegister;