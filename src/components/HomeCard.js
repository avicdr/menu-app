import React from "react";

function HomeCard({ image, name, setSelectedItem }) {
  return (
    <div onClick={()=>setSelectedItem(name)}>
      <div className="my-3 menu-item">
        <img src={image} />
        <div className="overlay">{name}</div>
      </div>
    </div>
  );
}

export default HomeCard;
