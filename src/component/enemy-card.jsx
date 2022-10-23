import React from "react";
import Card from "../ass/card-back.png";
import PersonIcon from "@mui/icons-material/Person";
import { fontSize } from "@mui/system";

const iconStyle = {
  transform: "scale(3)",
  marginTop: "30px",
  color: "#0971f1"
}

function EnemyCard() {
  return (
    <>
      <div>
        <div className="enemy-info ">
          <PersonIcon style={iconStyle} />
          <h3 >LienDink?</h3>
        </div>
        <div className="main-player-card-item">
          <img style={{ width: "60px" }} src={Card} />
          <img style={{ width: "60px" }} src={Card} />
          <img style={{ width: "60px" }} src={Card} />
          <img style={{ width: "60px" }} src={Card} />
          <img style={{ width: "60px" }} src={Card} />
        </div>
      </div>
    </>
  );
}
export default EnemyCard;
