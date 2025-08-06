import React from "react";
import { Link } from "react-router-dom";
import "./footer.css"; 

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left Section: Logo & App Store Links */}
        <div className="footer-left">
          <h2 className="footer-logo">Foodie</h2>
          
        </div>

        {/* Center Sections */}
        <div className="footer-section">
          <h4>Partner with Foodie</h4>
          <Link to="/couriers">For couriers</Link>
          <Link to="/merchants">For merchants</Link>
          
        </div>

        <div className="footer-section">
          <h4>Company</h4>
          <Link to="/about">About us</Link>
          <Link to="/values">What we stand for</Link>
          <Link to="/jobs">Jobs</Link>
          <Link to="/security">Security</Link>
          <Link to="/investors">Investors</Link>
        </div>


        <div className="footer-section">
          <h4>Useful Links</h4>
          <Link to="/support">Support</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/promo">Promo codes</Link>
          <Link to="/developers">Developers</Link>

        </div>

        <div className="footer-section">
          <h4>Follow Us</h4>
          <Link to="/blog">Blog</Link>

          <Link to="/instagram">Instagram</Link>
          <Link to="/facebook">Facebook</Link>
          <Link to="/twitter">X</Link>
          <Link to="/linkedin">LinkedIn</Link>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
