import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./addRestaurant.css"; // Reusing the same CSS
import ResNavbar from "./restaurantComponents/res-navBar";
import Footer from "../../Components/Footer";
import backgroundImage from "./assets/res-Background.jpg";


const AddRestaurant = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    cuisineType: "",
    description: "",
    openingHours: "",
    closingHours: "",
    ownerId: localStorage.getItem("userId") || "", // 🔐 Set ownerId from storage
  });
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files).slice(0, 5); // Limit to 5 images
    setImages(selectedImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required. Please login again.");
      }

      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      images.forEach(image => {
        formDataToSend.append("images", image);
      });

      const response = await axios.post(
        "http://localhost:8000/restaurants/add-restaurant",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      alert("Restaurant submitted for admin approval!");
      navigate("/merchants");
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.response?.data?.message || err.message || "Failed to submit restaurant");
    } finally {
      setIsSubmitting(false);
    }
  };

  const cuisineTypes = [
    "Sri Lankan", "Indian", "Chinese", "Italian", "American", "Mexican",
    "Japanese", "Thai", "Mediterranean", "Other"
  ];

  return (
    <div className="res-register">
      <ResNavbar />

      <div className="res-reg-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <form className="res-reg-form" onSubmit={handleSubmit}>

          <h2>Add Your Restaurant</h2>

          <p className="subtitle">Join our foodie community</p>

          <input type="text" name="name" placeholder="Restaurant Name" value={formData.name} onChange={handleChange} required />

          <input type="email" name="email" placeholder="Business Email" value={formData.email} onChange={handleChange} required />

          <div className="phone-container">
            <span>(+94) LK </span>
            <input type="tel" name="phone" placeholder="Business Phone" value={formData.phone} onChange={handleChange} required />
          </div>

          <input type="text" name="address" placeholder="Full Address" value={formData.address} onChange={handleChange} required />

          <select name="cuisineType" value={formData.cuisineType} onChange={handleChange} required className="res-reg-form-select">
            
            <option value="">Select Cuisine Type</option>
            {cuisineTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <textarea name="description" placeholder="Restaurant Description" value={formData.description} onChange={handleChange} className="res-reg-form-textarea" />

          <div className="hours-container">
            <div className="hours-input">
              <label>Opening Time</label>
              <input type="time" name="openingHours" value={formData.openingHours} onChange={handleChange} required />
            </div>
            <div className="hours-input">
              <label>Closing Time</label>
              <input type="time" name="closingHours" value={formData.closingHours} onChange={handleChange} required />
            </div>
          </div>

          <div className="image-upload-container">
            <label htmlFor="restaurant-images" className="image-upload-label">
              Upload Restaurant Images (Max 5)
            </label>
            <input id="restaurant-images" type="file" multiple accept="image/*" onChange={handleImageChange} className="image-upload-input" />
            {images.length > 0 && (
              <div className="image-preview">
                {images.map((image, index) => (
                  <div key={index} className="preview-item">
                    <img src={URL.createObjectURL(image)} alt={`Preview ${index}`} className="preview-image" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && <p className="error-message">{error}</p>}

          <p className="terms">
            By submitting, you confirm that all information provided is accurate and
            you agree to our <strong>Terms of Service</strong>.
          </p>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Restaurant"}
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default AddRestaurant;
