import React, { useRef } from "react";
import "./DiscountBonanza.css";

const discountItems = [
  {
    name: "Rajasthani Rasoi",
    image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1752252980/01a8503fdbc5be552ae436c2aafcd064_sjk2uw.jpg",
    offer: "50% OFF",
  },
  {
    name: "Santosh Pavbhaji",
    image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1752252985/a79424d1606a535db91108548167727f_rpmxgv.jpg",
    offer: "40% OFF",
  },
  {
    name: "Cheesy Pasta",
    image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1752252984/684ca1498560c84097bebc3805da551b_mt0neb.jpg",
    offer: "30% OFF",
  },
  {
    name: "Grilled Burger",
    image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1752252983/859adef90e854238d9b330d0c7d2cf73_get6ol.jpg",
    offer: "B1 G1",
  },
  {
    name: "Tandoori Wrap",
    image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1752398135/0b5eb439a0fe2c71aa7b427d3402e1ea_jd6bkm.jpg",
    offer: "20% OFF",
  },
  {
    name: "Veg Sandwich",
    image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1752397646/ae21f90d2d9471f8d345edfbe03e4ee2_pxltci.jpg",
    offer: "25% OFF",
  },
  {
    name: "Panner Sabji",
    image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1752398998/7525c28b815e93b8f4ad4a3bb889090e_aunwup.jpg",
    offer: "25% OFF",
  },
  {
    name: "Dominoz Pizzaa",
    image: "https://res.cloudinary.com/dlurlrbou/image/upload/v1752252984/410b32a87e020b0e8dbe8a2850d8ca29_prsyzo.jpg",
    offer: "25% OFF",
  },
];

export default function DiscountBonanza() {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  return (
    <section className="discount-bonanza">
      <h2>🔥 Discount Bonanza</h2>
      <div className="scroll-wrapper">
        <button className="scroll-arrow left" onClick={scrollLeft}>
          &#8249;
        </button>
        <div className="scroll-container" ref={scrollRef}>
          {discountItems.map((item, index) => (
            <div className="discount-card" key={index}>
              <img src={item.image} alt={item.name} />
              <div className="offer-label">{item.offer}</div>
              <p>{item.name}</p>
            </div>
          ))}
        </div>
        <button className="scroll-arrow right" onClick={scrollRight}>
          &#8250;
        </button>
      </div>
    </section>
  );
}
