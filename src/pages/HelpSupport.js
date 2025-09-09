import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FooterSection from '../components/FooterSection';
import './HelpSupport.css';

const HelpSupport = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('faq');
  const [searchQuery, setSearchQuery] = useState('');

  const faqData = [
    {
      question: "How do I place an order?",
      answer: "Simply browse our restaurants, select your favorite dishes, add them to cart, and proceed to checkout. You can pay online or choose cash on delivery."
    },
    {
      question: "What are your delivery charges?",
      answer: "Delivery charges vary by restaurant and distance. Most orders have a delivery fee of ₹20-50. Free delivery is available on orders above ₹299."
    },
    {
      question: "How long does delivery take?",
      answer: "Delivery time typically ranges from 30-60 minutes depending on your location and restaurant preparation time. You can track your order in real-time."
    },
    {
      question: "Can I cancel my order?",
      answer: "You can cancel your order within 5 minutes of placing it. After that, please contact our support team for assistance."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept credit/debit cards, UPI, net banking, and cash on delivery. All online payments are secure and encrypted."
    },
    {
      question: "How do I track my order?",
      answer: "Once your order is confirmed, you'll receive a tracking link. You can also track your order from the 'Track Order' section on our website."
    }
  ];

  const contactMethods = [
    {
      icon: "📞",
      title: "Phone Support",
      description: "Call us for immediate assistance",
      contact: "+91 98765 43210",
      availability: "24/7"
    },
    {
      icon: "💬",
      title: "Live Chat",
      description: "Chat with our support team",
      contact: "Available on website",
      availability: "9 AM - 9 PM"
    },
    {
      icon: "📧",
      title: "Email Support",
      description: "Send us your queries",
      contact: "support@cravecart.com",
      availability: "24/7"
    },
    {
      icon: "📱",
      title: "WhatsApp",
      description: "Quick support via WhatsApp",
      contact: "+91 98765 43210",
      availability: "9 AM - 9 PM"
    }
  ];

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    alert('Support ticket submitted successfully! We\'ll get back to you within 24 hours.');
  };

  return (
    <div className="help-support-page">
      <Navbar />
      
      <div className="help-support-container">
        {/* Hero Section */}
        <section className="help-hero">
          <div className="help-hero-content">
            <h1>Help & Support</h1>
            <p>We're here to help! Find answers to your questions or get in touch with our support team.</p>
            
            {/* Search Bar */}
            <div className="search-section">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search for help..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="search-btn">🔍</button>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <section className="help-navigation">
          <div className="container">
            <div className="help-tabs">
              <button 
                className={`tab-btn ${activeTab === 'faq' ? 'active' : ''}`}
                onClick={() => setActiveTab('faq')}
              >
                FAQ
              </button>
              <button 
                className={`tab-btn ${activeTab === 'contact' ? 'active' : ''}`}
                onClick={() => setActiveTab('contact')}
              >
                Contact Us
              </button>
              <button 
                className={`tab-btn ${activeTab === 'ticket' ? 'active' : ''}`}
                onClick={() => setActiveTab('ticket')}
              >
                Submit Ticket
              </button>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        {activeTab === 'faq' && (
          <section className="faq-section">
            <div className="container">
              <h2>Frequently Asked Questions</h2>
              <div className="faq-list">
                {faqData.map((faq, index) => (
                  <div key={index} className="faq-item">
                    <div className="faq-question">
                      <h3>{faq.question}</h3>
                      <span className="faq-toggle">+</span>
                    </div>
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Contact Section */}
        {activeTab === 'contact' && (
          <section className="contact-section">
            <div className="container">
              <h2>Get in Touch</h2>
              <div className="contact-methods">
                {contactMethods.map((method, index) => (
                  <div key={index} className="contact-card">
                    <div className="contact-icon">{method.icon}</div>
                    <h3>{method.title}</h3>
                    <p>{method.description}</p>
                    <div className="contact-info">
                      <strong>{method.contact}</strong>
                      <span className="availability">{method.availability}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Submit Ticket Section */}
        {activeTab === 'ticket' && (
          <section className="ticket-section">
            <div className="container">
              <h2>Submit a Support Ticket</h2>
              <form className="ticket-form" onSubmit={handleSubmitTicket}>
                <div className="form-group">
                  <label htmlFor="name">Name *</label>
                  <input type="text" id="name" required />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input type="email" id="email" required />
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input type="tel" id="phone" />
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <input type="text" id="subject" required />
                </div>
                
                <div className="form-group">
                  <label htmlFor="category">Category *</label>
                  <select id="category" required>
                    <option value="">Select a category</option>
                    <option value="order">Order Issue</option>
                    <option value="payment">Payment Problem</option>
                    <option value="delivery">Delivery Issue</option>
                    <option value="account">Account Problem</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea id="message" rows="5" required></textarea>
                </div>
                
                <button type="submit" className="submit-btn">Submit Ticket</button>
              </form>
            </div>
          </section>
        )}

        {/* Quick Actions */}
        <section className="quick-actions">
          <div className="container">
            <h2>Quick Actions</h2>
            <div className="action-buttons">
              <button className="action-btn" onClick={() => navigate('/track')}>
                <span className="action-icon">📦</span>
                Track Order
              </button>
              <button className="action-btn" onClick={() => navigate('/cart')}>
                <span className="action-icon">🛒</span>
                View Cart
              </button>
              <button className="action-btn" onClick={() => navigate('/')}>
                <span className="action-icon">🏠</span>
                Go Home
              </button>
              <button className="action-btn" onClick={() => navigate('/login')}>
                <span className="action-icon">👤</span>
                My Account
              </button>
            </div>
          </div>
        </section>
      </div>

      <FooterSection />
    </div>
  );
};

export default HelpSupport;
