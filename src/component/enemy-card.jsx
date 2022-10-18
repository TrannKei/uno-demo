import React from "react";
import Card from "../ass/card-back.png";
function EnemyCard() {
  return (
    <>
      <div className="main-player-card-item">
        <img style={{ width: "60px" }} src={Card}  />
        <img style={{ width: "60px" }} src={Card} />
        <img style={{ width: "60px" }} src={Card} />
        <img style={{ width: "60px" }} src={Card} />
        <img style={{ width: "60px" }} src={Card} />
      </div>
    </>
  );
}
export default EnemyCard;
