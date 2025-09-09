import React from "react";
import './AboutUsSection.css'; // Assuming you have a CSS file for styling

function AboutUsSection() {
  return (
    <section className="about-section">
      <h2 className="about-title">About Us</h2>
      <div className="about-content-row">
        <div className="about-mission-vision">
          <div className="about-mission">
            <span className="about-label">Mission:</span>
            <span className="about-desc">
              Making food delivery easy, affordable, and sustainable with multi-restaurant orders, bill splitting, and discounts on surplus meals.
            </span>
          </div>
          <div className="about-vision">
            <span className="about-label">Vision:</span>
            <span className="about-desc">
              A world where enjoying your favourite food also reduces waste and supports local communities.
            </span>
          </div>
        </div>
        <div className="about-map-col">
          <img
            src="https://res.cloudinary.com/dlurlrbou/image/upload/v1753335229/map-placeholder_qinqo7.jpg"
            alt="Map"
            className="about-map-img"
          />
          <button className="about-cities-btn">
            50+<br />
            <span className="about-cities-label">CITIES ACROSS INDIA</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default AboutUsSection;
