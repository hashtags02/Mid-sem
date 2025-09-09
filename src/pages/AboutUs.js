import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FooterSection from '../components/FooterSection';
import './AboutUs.css';

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="about-us-page">
      <Navbar />
      
      <div className="about-us-container">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="about-hero-content">
            <h1>About CraveCart</h1>
            <p>Your trusted partner in food delivery, bringing delicious meals to your doorstep with love and care.</p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mission-section">
          <div className="container">
            <div className="mission-content">
              <h2>Our Mission</h2>
              <p>
                At CraveCart, we believe that great food should be accessible to everyone, everywhere. 
                Our mission is to connect hungry customers with the best local restaurants, ensuring 
                that every meal is delivered fresh, hot, and on time.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="story-section">
          <div className="container">
            <div className="story-grid">
              <div className="story-content">
                <h2>Our Story</h2>
                <p>
                  Founded in 2024, CraveCart started as a simple idea: to make food delivery 
                  more convenient, reliable, and enjoyable. What began as a small team of food 
                  enthusiasts has grown into a platform that serves thousands of customers daily.
                </p>
                <p>
                  We've partnered with the finest restaurants in your area, from cozy cafes to 
                  fine dining establishments, ensuring you have access to diverse culinary experiences 
                  right at your fingertips.
                </p>
              </div>
              <div className="story-image">
                <div className="image-placeholder">
                  <span>🍽️</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="values-section">
          <div className="container">
            <h2>Our Values</h2>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon">🚀</div>
                <h3>Fast Delivery</h3>
                <p>We understand that hunger waits for no one. Our efficient delivery system ensures your food arrives quickly and fresh.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">❤️</div>
                <h3>Quality First</h3>
                <p>We partner only with restaurants that meet our high standards for food quality and hygiene.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🤝</div>
                <h3>Customer Care</h3>
                <p>Your satisfaction is our priority. Our dedicated support team is always ready to help.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🌱</div>
                <h3>Sustainability</h3>
                <p>We're committed to eco-friendly packaging and sustainable delivery practices.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="team-section">
          <div className="container">
            <h2>Meet Our Team</h2>
            <div className="team-grid">
              <div className="team-member">
                <div className="member-avatar">👨‍💼</div>
                <h3>John Smith</h3>
                <p>CEO & Founder</p>
              </div>
              <div className="team-member">
                <div className="member-avatar">👩‍💻</div>
                <h3>Sarah Johnson</h3>
                <p>CTO</p>
              </div>
              <div className="team-member">
                <div className="member-avatar">👨‍🍳</div>
                <h3>Mike Chen</h3>
                <p>Head of Operations</p>
              </div>
              <div className="team-member">
                <div className="member-avatar">👩‍🎨</div>
                <h3>Emily Davis</h3>
                <p>Head of Design</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="container">
            <h2>Our Impact</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">10,000+</div>
                <div className="stat-label">Happy Customers</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Partner Restaurants</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">50,000+</div>
                <div className="stat-label">Orders Delivered</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">4.8★</div>
                <div className="stat-label">Average Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>Ready to Experience CraveCart?</h2>
              <p>Join thousands of satisfied customers and discover amazing food from your favorite restaurants.</p>
              <div className="cta-buttons">
                <button className="btn-primary" onClick={() => navigate('/')}>
                  Order Now
                </button>
                <button className="btn-secondary" onClick={() => navigate('/login')}>
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <FooterSection />
    </div>
  );
};

export default AboutUs;
