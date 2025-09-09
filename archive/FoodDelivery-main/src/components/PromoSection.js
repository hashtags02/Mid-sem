import React from "react";

function PromoSection() {
  return (
    <div className="promo-section-split-wrapper">
      <section className="promo-section promo-section-split">
        <div className="promo-img-col promo-img-split">
          <img
            src="https://res.cloudinary.com/dlurlrbou/image/upload/v1753077029/0c54c2e7148ea5ae05d702aa64c86451_gx0kej.jpg"
            alt="Pizza"
            className="promo-pizza-img-split"
          />
        </div>
        <div className="promo-card promo-card-split">
          <div className="promo-main-split">
            FLAT 50% off on your first order
            <br />
            Plus FREE Delivery! <span role="img" aria-label="fire">🔥</span>
          </div>
          <div className="promo-sub-split">
            No hidden fees. No fuss. Just delicious food at half the price!
          </div>
        </div>
      </section>
    </div>
  );
}

export default PromoSection;
