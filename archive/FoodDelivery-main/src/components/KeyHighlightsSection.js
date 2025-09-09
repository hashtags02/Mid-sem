import React from "react";

const stats = [
  { value: "150+", label: "RESTAURANTS" },
  { value: "250+", label: "CITIES" },
  { value: "500+", label: "HAPPY CUSTOMERS" },
  { value: "1500+", label: "ORDERS" },
];

function KeyHighlightsSection() {
  return (
    <section className="key-highlights-section">
      <h2 className="key-highlights-title">Our Key Highlights</h2>
      <div className="key-highlights-row">
        <div className="stat-card"> <div className="stat-value">{stats[0].value}</div> <div className="stat-label">{stats[0].label}</div> </div>
        <div className="stat-card"> <div className="stat-value">{stats[1].value}</div> <div className="stat-label">{stats[1].label}</div> </div>
        <div className="stat-dash">-</div>
        <div className="stat-card"> <div className="stat-value">{stats[2].value}</div> <div className="stat-label">{stats[2].label}</div> </div>
        <div className="stat-card"> <div className="stat-value">{stats[3].value}</div> <div className="stat-label">{stats[3].label}</div> </div>
      </div>
    </section>
  );
}

export default KeyHighlightsSection; 