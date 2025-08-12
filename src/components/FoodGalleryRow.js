import React from "react";

const foods = [
  "https://res.cloudinary.com/dlurlrbou/image/upload/v1753335229/food12_znz6xe.jpg",
  "https://res.cloudinary.com/dlurlrbou/image/upload/v1753335220/food8_ydwayf.jpg",
  "https://res.cloudinary.com/dlurlrbou/image/upload/v1753335212/food2_bjgx6e.jpg",
  "https://res.cloudinary.com/dlurlrbou/image/upload/v1753335206/dish4_ixj65o.jpg",
  "https://res.cloudinary.com/dlurlrbou/image/upload/v1753077148/c77f177e943f6b9eab7bd98f23ec255f_mrxwa8.jpg",
  "https://res.cloudinary.com/dlurlrbou/image/upload/v1753077122/a3a44acbf5742fab196eff46aa01f96f_fs8dva.jpg",
  "https://res.cloudinary.com/dlurlrbou/image/upload/v1753077119/7525c28b815e93b8f4ad4a3bb889090e_vtd6mi.jpg",
  "https://res.cloudinary.com/dlurlrbou/image/upload/v1753077085/705fb1f2d5b6aa891f8f32d685712715_qwvnzy.jpg",
  "https://res.cloudinary.com/dlurlrbou/image/upload/v1753077065/26ceb818ae2b63745c37fcae06894199_rckrbm.jpg",
  "https://res.cloudinary.com/dlurlrbou/image/upload/v1753077047/4f1a7c2cec0b1be9c65a8f17cc10b2ff_lku0aa.jpg",
  "https://res.cloudinary.com/dlurlrbou/image/upload/v1753074301/4d65723ca703fe8bbf6f0d60fdd70939_xpu8pr.jpg",
  "https://res.cloudinary.com/dlurlrbou/image/upload/v1753076604/4ec3af1bd3c98468849f369d601a5831_botbuc.jpg",
];

function FoodGalleryRow() {
  return (
    <div className="food-gallery-row-scroll">
      {foods.map((img, idx) => (
        <img src={img} alt={`Food ${idx + 1}`} className="food-gallery-img" key={idx} />
      ))}
    </div>
  );
}

export default FoodGalleryRow;
