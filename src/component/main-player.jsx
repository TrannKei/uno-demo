import React, { useState } from "react";
import C1 from "../ass/cards-front/7Y.png";
import C2 from "../ass/cards-front/8Y.png";
import C3 from "../ass/cards-front/9B.png";
import C4 from "../ass/cards-front/_R.png";
import C5 from "../ass/cards-front/skipG.png";
import C6 from "../ass/cards-front/7Y.png";

function MainPlayer() {
  const cards = [C1, C2, C3, C4, C5, C6, C1, C2];
  const turn = true;
  return (
    <>
      <div className="main-player-card-item">
        {cards.map((card) => {
          return <img className="img-card-throwed-main" src={card} alt="" />;
        })}
      </div>
    </>
  );
}
export default MainPlayer;
