import React from "react";
import './HowItWorks.css'; // Keep your styling

const steps = [
  {
    icon: "https://res.cloudinary.com/dlurlrbou/image/upload/v1753335196/browse_itnyj6.jpg",
    label: "Browse To Restaurants",
  },
  {
    icon: "https://res.cloudinary.com/dlurlrbou/image/upload/v1753335196/choose_kd59xm.jpg",
    label: "Choose your Meal",
  },
  {
    icon: "https://res.cloudinary.com/dlurlrbou/image/upload/v1753335228/location_rj8zrp.jpg",
    label: "Select Your Location",
  },
];

function HowItWorks() {
  // Helper to split label and wrap last word
  const renderLabel = (label) => {
    const words = label.split(" ");
    const last = words.pop();
    return (
      <>
        {words.join(" ")} <span className="how-label-last">{last}</span>
      </>
    );
  };

  return (
    <section className="how-it-works">
      <div className="how-row-flex">
        <h2 className="section-title">How it Works</h2>
        <div className="how-steps">
          {steps.map((step, idx) => (
            <div className="how-step" key={idx}>
              <div className="how-icon">
                <img
                  src={step.icon}
                  alt={step.label}
                  className="how-icon-img"
                  style={{ background: "transparent" }}
                />
              </div>
              <div className="how-label">{renderLabel(step.label)}</div>
            </div>
          ))}
        </div>
        <span className="section-arrow">&gt;</span>
      </div>
    </section>
  );
}

export default HowItWorks;
