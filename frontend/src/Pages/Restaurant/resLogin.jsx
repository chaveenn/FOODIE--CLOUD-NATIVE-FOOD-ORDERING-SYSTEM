import React, { useState } from "react";
import "./resLogin.css";
import backgroundImage from "./assets/bgSI.jpg";

import ResNavbar from "./restaurantComponents/res-navBar";
import Footer from "../../Components/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa"; 




const ResHome = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false); 

  const handleSignUp = () => {
    navigate("/merchants-signUp");
  };

  const handleForgotPassword = () => {
    
    navigate("/forgot-password");
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErrorMsg("");
  
    try {
      const response = await axios.post("http://localhost:8000/users/login-res-admin", {
        email,
        password,
      });
  
      alert("Login successful!");
  
      const { token, user } = response.data;
  
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
  
      const checkResponse = await axios.get(`http://localhost:8000/restaurants/check-owner`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const { exists } = checkResponse.data;
  
      setTimeout(() => {
        if (exists) {
          navigate("/restaurant/overview");
        } else {
          navigate("/add-restaurant");
        }
      }, 1000);
    } catch (error) {
      console.error("Login failed", error);
      if (error.response?.data?.message) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="res-home">
      <ResNavbar />
      <div className="res-home-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="res-login-section">
          <div className="login-form-container">
            <div className="logo">Business Easily with Foodie  </div>
            <h2>Log In Here</h2>

            <form onSubmit={handleSignIn}>
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Email"
                  className="input-field"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-group password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="input-field"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span 
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <div className="forgot-password">
                <a href="#" onClick={handleForgotPassword}>Forgot password?</a>
              </div>

              {errorMsg && <p className="error-message">{errorMsg}</p>}

              <button type="submit" className="sign-in-btn">
                Sign In
              </button>
            </form>
          </div>
        </div>

        <div className="res-signup-section">
          <div className="signup-content">
            <h2>Become a Foodie Partner</h2>
            <p>Start Serving Today!</p>
            <button className="signup-btn" onClick={handleSignUp}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResHome;