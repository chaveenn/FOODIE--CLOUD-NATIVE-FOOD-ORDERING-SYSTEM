import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Navbar from "../../Components/navBar";
import Footer from "../../Components/Footer";
import ModalLogin from "../../Pages/Customer/cusLogin";
import "./home.css";

const images = [
  { src: require("./pizza.jpeg"), text: "Piping Hot Pizzas, Just for You" },
  { src: require("./healthy.jpg"), text: "Fresh & Wholesome Salads" },
  { src: require("./cake.jpg"), text: "Delight in Every Bite of Dessert" },
  { src: require("./Sri+Lankan+breakfast+table.jpg"), text: "Authentic Sri Lankan Cuisine" },
];

const ImageSlider = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <div className="home">
      <Navbar onLoginClick={() => setShowLoginModal(true)} />
      {showLoginModal && (
        <ModalLogin 
          onClose={() => setShowLoginModal(false)}
          onSignUpClick={() => {
            setShowLoginModal(false);
            window.location.href = "/signup";
          }}
        />
      )}
      
      <div className="slider-container">
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={true}
          pagination={{ clickable: true }}
          navigation
          className="swiper-container"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="slide-content">
                
                <img src={image.src} alt={`Slide ${index + 1}`} className="slide-img" />
                <div className="slide-text"><p>{image.text}</p></div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <Footer />
    </div>
  );
};

export default ImageSlider;