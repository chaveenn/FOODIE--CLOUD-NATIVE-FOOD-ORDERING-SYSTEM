import React, { useState } from "react";
import "./resRegister.css";
import ResNavbar from "./restaurantComponents/res-navBar";
import Footer from "../../Components/Footer";
import backgroundImage from "./assets/signUp.jpg";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

const MerchantRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    nic: "",
    role: "restaurant_admin"
  });

  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate(); // ✅ Initialize navigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "password2") {
      setPassword2(value);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== password2) {
      setError("Passwords do not match.");
      alert("Passwords do not match.");
      return;
    }

    try {
      const { password2, ...submitData } = { ...formData };

      const response = await axios.post(
        "http://localhost:8000/users/register-user",
        submitData
      );

      setSuccess(response.data.message || "Registration successful!");
      alert(response.data.message || "Registration successful!");

      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        nic: "",
        role: "restaurant_admin"
      });
      setPassword2("");

      // ✅ Redirect to resHome after 700 m.second
      setTimeout(() => {
        navigate("/merchants");
      }, 700);

    } catch (err) {
      console.error(err);
      if (err.response && err.response.data.errors) {
        const errorMessages = Object.values(err.response.data.errors).join("\n");
        alert(`Validation failed: \n${errorMessages}`);
        setError(`Validation failed: \n${errorMessages}`);
      } else if (err.response) {
        alert(err.response.data.message || "Registration failed. Please try again.");
        setError(err.response.data.message || "Registration failed. Please try again.");
      } else {
        alert("Network error. Please check your connection.");
        setError("Network error. Please check your connection.");
      }
    }
  };

  return (
    <div className="res-register">
      <ResNavbar />

      <div className="res-reg-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <form className="res-reg-form" onSubmit={handleSubmit}>
        <h2>For businesses big and small</h2>
        <p className="subtitle">Let's grow together</p>

        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
        
        <div className="phone-container">
          <span>(+94) LK </span>
          <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
        </div>
        
        <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
        <input type="text" name="nic" placeholder="NIC" value={formData.nic} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <input type="password" name="password2" placeholder="Re-enter Password" value={password2} onChange={handleChange} required />
        
        <p className="terms">
          By clicking <strong>Get started</strong>, you agree to <strong>User Terms of Service</strong> and acknowledge you have read <strong>Foodie Privacy Statement</strong>. You must be 18 years or older to complete the form.
        </p>
        
        <button type="submit">Get started</button>
      </form>
    </div>

      <Footer />
    </div>
  );
};

export default MerchantRegister;
