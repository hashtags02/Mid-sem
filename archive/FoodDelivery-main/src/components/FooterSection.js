import React from "react";
import './FooterSection.css'; // Assuming you have a CSS file for styling

function FooterSection() {
  return (
    <footer className="footer-section">
      <div className="footer-main-row">
        <div className="footer-cta-col">
          <div className="footer-cta-text">Ready to get started?</div>
          <button className="footer-cta-btn">Get started</button>
        </div>
        <div className="footer-links-row">
          <div className="footer-links-col">
            <div className="footer-link-title">Services</div>
            <div className="footer-link">Email Marketing</div>
            <div className="footer-link">Campaigns</div>
            <div className="footer-link">Branding</div>
            <div className="footer-link">Offline</div>
          </div>
          <div className="footer-links-col">
            <div className="footer-link-title">About</div>
            <div className="footer-link">Our Story</div>
            <div className="footer-link">Benefits</div>
            <div className="footer-link">Team</div>
            <div className="footer-link">Careers</div>
          </div>
          <div className="footer-links-col">
            <div className="footer-link-title">Help</div>
            <div className="footer-link">FAQs</div>
            <div className="footer-link">Contact Us</div>
          </div>
        </div>
      </div>
      <div className="footer-copyright">
        Copyright ©2025 - www.CraveCart.com. All Right Reserved
      </div>
    </footer>
  );
}

export default FooterSection; 