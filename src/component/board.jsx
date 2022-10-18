import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logined } from "../features/status/StatusSlice";
import { useDispatch } from "react-redux";

import Card from "../ass/cards-front/0B.png";
import MainPlayer from "./main-player";
import EnemyCard from "./enemy-card";
import DrawCard from "./draw-card";
import ChooseColor from "./choose-color";
import Winner from "./winner";
import ChatBox from "./chat-box";

import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import Fab from "@mui/material/Fab";
import Tooltip from "@mui/material/Tooltip";

function Board() {
  const [text, setText] = useState("3FSD5DS9");
  const copy = async () => {
    await navigator.clipboard.writeText(text);
  };
  const navigate = useNavigate();
  const [sec, setSec] = useState(10);
  useEffect(() => {
    const time = setInterval(() => {
      setSec((pre) => pre - 1);
    }, 1000);
    if (sec === 0) {
      setSec(60);
    }
    return () => {
      clearInterval(time);
    };
  });
  const dispatch = useDispatch();
  const handleOut = () => {
    dispatch(logined());
    navigate("/");
  };
  return (
    <>
      <div className="bg-play-r" />
      <div className="header-play">
        <div></div>
        <div>
          <Tooltip title="Bấm để copy" placement="bottom">
            <h3 className="title copy" onClick={copy}>
              MÃ PHÒNG: {text}
            </h3>
          </Tooltip>
        </div>
        <div className="controller">
          <div>Kienngu</div>
          <Button
            variant="outlined"
            color="error"
            size="small"
            endIcon={<LogoutIcon />}
            onClick={handleOut}
          >
            Thoát
          </Button>
        </div>
      </div>
      <div className="play-ground">
        <div className="card-throwed">
          <img src={Card} alt="" className="img-card-throwed" />
        </div>
        <div className="main-player-card">
          <MainPlayer />
        </div>
        <div className="main-player-info">
          <h3>Kienngu</h3>
        </div>
        <div className="button-aria">
          <Fab color="primary" aria-label="add">
            Đánh
          </Fab>
          <Fab color="error" aria-label="add">
            UNO
          </Fab>
        </div>
        <div className="enemy-card">
          <EnemyCard />
        </div>
        <div className="clock ">
          <div>{sec}</div>
        </div>
        <div className="draw-card-aria">
          <DrawCard />
        </div>
        <div className="enemy-info">
          <h3>LienDink?</h3>
        </div>
        <div>
          <ChooseColor />
        </div>
        <Winner />
        <ChatBox />
      </div>
    </>
  );
}
export default Board;
