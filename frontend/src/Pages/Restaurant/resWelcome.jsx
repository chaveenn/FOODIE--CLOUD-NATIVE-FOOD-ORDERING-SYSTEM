import React from "react";
import { useNavigate } from "react-router-dom";
import ResNavbar from "./restaurantComponents/res-navBar";
import Footer from "../../Components/Footer";
import "./resWelcome.css";

const ResWelcome = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleAddRestaurant = () => {
    navigate("/add-restaurant");
  };

  return (
    <div className="res-welcome-container">
      <ResNavbar />
      <div className="res-welcome-main">
        <h1>Welcome, @{user?.name || "Merchant"} 👋</h1>
        <p>Manage your restaurant in one place.</p>
        <div className="res-welcome-buttons">
          <button onClick={handleAddRestaurant} className="res-welcome-btn res-add-btn">
            Add Your Restaurant
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResWelcome;
