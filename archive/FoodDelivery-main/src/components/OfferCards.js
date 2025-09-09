import React from "react";
import './OfferCards.css';

const offers = [
  {
    image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1753335215/food4_r4cy98.jpg",
    headline: "Birthday/Anniversary Offers",
    subheadline: "Get a free dessert on your birthday",
    button: "Add Your Birthday",
  },
  {
    image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1753077148/c77f177e943f6b9eab7bd98f23ec255f_mrxwa8.jpg",
    headline: "Grab Leftover Orders at 50% OFF",
    subheadline: "",
    button: "Order Now",
  },
  {
    image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1753077045/4ec3af1bd3c98468849f369d601a5831_x9khtd.jpg",
    headline: "Why Pay for Delivery? Not on Crave Cart",
    subheadline: "Free delivery on orders above ₹299",
    button: "Order Now",
  },
];

function OfferCards() {
  return (
    <div className="offer-cards-row">
      {offers.map((offer, idx) => (
        <div className="offer-card" key={idx}>
          <img src={offer.image} alt={offer.headline} className="offer-card-img" />
          <div className="offer-card-headline">{offer.headline}</div>
          {offer.subheadline && (
            <div className="offer-card-subheadline">{offer.subheadline}</div>
          )}
          <button className="offer-card-btn">{offer.button}</button>
        </div>
      ))}
    </div>
  );
}

export default OfferCards;
