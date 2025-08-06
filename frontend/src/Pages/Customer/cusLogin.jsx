import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { PulseLoader } from "react-spinners";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./cusLogin.css";


const ModalLogin = ({ onClose, onSignUpClick }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = () => {
    navigate("/forgot-password");
    onClose();
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/users/login-user", {
        email,
        password,
      });

      const { token, user } = response.data;

      // Store user data in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setIsLoading(false);
      onClose();
      
      // Redirect to client dashboard
      navigate("/customer-dashboard");
      
    } catch (error) {
      setIsLoading(false);
      console.error("Login failed", error);
      if (error.response?.data?.message) {
        setErrorMsg(error.response.data.message);
      } else if (error.response?.status === 401) {
        setErrorMsg("Invalid email or password");
      } else {
        setErrorMsg("Login failed. Please check your connection and try again.");
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="login-form-container">
          <div className="icons">
            <h1>Hello Foodie!</h1>
            <p>Sign in to continue your food journey</p>
          </div>

          <form onSubmit={handleSignIn}>
            <div className="input-group">
              <input
                type="email"
                placeholder="Enter your email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group password-input">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="form-options">
              <div className="forgot-password">
                <button type="button" className="text-button" onClick={handleForgotPassword}>
                  Forgot password?
                </button>
              </div>
            </div>

            {errorMsg && <div className="error-message">{errorMsg}</div>}

            <button type="submit" className="sign-in-btn" disabled={isLoading}>
              {isLoading ? (
                <PulseLoader color="#fff" size={8} />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="social-login">
            <p>New to Fooodie?</p>
            <button type="button" className="sign-in-btn" onClick={onSignUpClick}>
            Create Account
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalLogin;