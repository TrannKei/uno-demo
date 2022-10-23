import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { logined } from "../features/status/StatusSlice";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
// import PopUp from "./PopUp";
import { setCurrentUser } from "../features/room/roomSlice";

import Card from "../ass/cards-front/0B.png";
import MainPlayer from "./main-player";
import EnemyCard from "./enemy-card";
import DrawCard from "./draw-card";
import ChooseColor from "./choose-color";
import Winner from "./winner";
import ChatBox from "./chat-box";

import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import Tooltip from "@mui/material/Tooltip";

function Board({ socket }) {
  const { roomCode } = useParams();
  const [text, setText] = useState(roomCode);

  const copy = async () => {
    toast.success("Đã copy");
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
  // console.log("Socket from InGame", socket.id);
  const [isUnoPressed, setUnoPressed] = useState(false);
  const [popUp, setPopUp] = useState(false);
  const [colorChosen, setColorChosen] = useState("");
  const [specialCard, setSpecialCard] = useState("");

  const { users, currentUser } = useSelector((state) => state.room);
  const gameStat = useSelector((state) => state.game);
  const {
    gameOver,
    winner,
    turn,
    deckOfPlayers,
    player1Deck,
    player2Deck,
    currentColor,
    currentNumber,
    playedCardsPile,
    drawCardPile,
  } = gameStat;

  // Utility
  const checkGameOver = (arr) => arr.length === 1;

  const checkWinner = (arr, player) => {
    return arr.length === 1 ? player : "";
  };

  const typeOfCard = (card) => {
    if (card.includes("skip")) {
      return "skip";
    } else if (card.includes("D2")) {
      return "draw2";
    } else if (card === "W") {
      return "wild";
    } else if (card === "D4W") {
      return "draw4wild";
    } else if (card.includes("_")) {
      return "reverse";
    } else {
      return "number";
    }
  };

  const isChangePlayer = (cardType) => {
    const changeTurnCarType = ["number", "wild", "reverse", "draw4wild"];
    return changeTurnCarType.some((type) => type === cardType);
  };

  // const closePopUp = (colorChoose) => {
  //   setColorChosen(colorChoose);
  //   setPopUp(false);
  //   onCardPlayedHandler(specialCard);
  // };

  // Handle Play Card
  const onCardPlayedHandler = (played_card) => {
    if (turn !== currentUser.id) {
      console.log("Chua den luot");
      toast.warning("Not your turn yet");
      return;
    }
    let newObjectToEmit = {};
    const cardFromDeck = deckOfPlayers[turn]; // player1Deck || player2Deck;
    const otherDeck =
      gameStat[cardFromDeck === "player1Deck" ? "player2Deck" : "player1Deck"];
    const currentDeck = gameStat[cardFromDeck];

    const { _id: opponentId } = users.find((user) => user._id !== turn);
    const cardType = typeOfCard(played_card);

    const newPlayedCardPile = [played_card, ...playedCardsPile];
    const copiedDrawCardPile = [...drawCardPile];

    let colorOfPlayedCard;
    let numberOfPlayedCard;

    // If Wild ask for Color first else extract color from played_card
    if (cardType === "wild" || cardType === "draw4wild") {
      if (!colorChosen) {
        setPopUp(true);
        setSpecialCard(played_card);
        return;
      } else {
        colorOfPlayedCard = colorChosen;
        setColorChosen("");
        setSpecialCard("");
      }
    } else {
      colorOfPlayedCard = played_card[played_card.length - 1];
    }
    // GetNumber
    const getNumber = (cardStr) => {
      switch (cardType) {
        case "number":
          return cardStr[0];
        case "skip":
          return 404;
        case "reverse":
          return 301;
        case "draw2":
          return 252;
        case "wild":
          return 300;
        case "draw4wild":
          return 600;
        default:
          return "Uncaught cardType";
      }
    };
    numberOfPlayedCard = getNumber(played_card);

    console.log("plaey Card", numberOfPlayedCard, colorOfPlayedCard);
    console.log("current Card", currentNumber, currentColor);
    // If match color or number
    if (
      colorOfPlayedCard === currentColor ||
      numberOfPlayedCard === currentNumber ||
      // || currentNumber === 404
      // || currentNumber === 252
      // || currentNumber === 301
      currentNumber === 300 ||
      currentNumber === 600
    ) {
      // Update turn
      const nextPlayer = isChangePlayer ? opponentId : turn;

      // New Current Player Deck
      const newPlayerDeck = (() => {
        let newDeck = currentDeck.filter((card) => card !== played_card);
        // isForgetToUNO
        if (currentDeck.length === 2 && !isUnoPressed) {
          toast.info("Forget to UNO. Draw 2 cards as penalty");
          newDeck.push(...copiedDrawCardPile.splice(-2));
        }
        return newDeck;
      })();

      // skip : No turn, new CurrentNumber,
      // Which player Deck to update
      newObjectToEmit = {
        ...newObjectToEmit,
        gameOver: checkGameOver(currentDeck),
        winner: checkWinner(currentDeck, turn),
        turn: nextPlayer,
        playedCardsPile: newPlayedCardPile,
        [cardFromDeck]: [...newPlayerDeck],
        currentColor: colorOfPlayedCard,
        currentNumber: numberOfPlayedCard,
        drawCardPile: [...copiedDrawCardPile],
      };

      // Update Other player if neccessary
      const updateOpponent = () => {
        let newDeck = [...otherDeck];
        if (cardType === "draw2") {
          newDeck.push(...copiedDrawCardPile.splice(-2));
        }
        if (cardType === "draw4wild") {
          newDeck.push(...copiedDrawCardPile.splice(-4));
        }
        return newDeck;
      };

      if (cardType === "draw2" || cardType === "draw4wild") {
        const otherDeckName =
          cardFromDeck === "player1Deck" ? "player2Deck" : "player1Deck";
        newObjectToEmit[otherDeckName] = updateOpponent();
      }

      console.log("New Object ", newObjectToEmit);
      setUnoPressed(false);
      socket.emit("updateGameState", newObjectToEmit);
    } else {
      // if not match color || number
      toast.error("Invalid move");
      return;
    }
  };
  // console.log(playedCardsPile[0]);
  return (
    <>
      <div className="bg-play" />
      <div className="header-play">
        {/* <div></div> */}
        <div>
          <Tooltip title="Bấm để chép mã phòng" placement="bottom">
            <div className="roomId  top-left" onClick={copy}>
              <h3>Mã phòng: {roomCode}</h3>
            </div>
          </Tooltip>
        </div>
        <div className="controller top-right">
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
        <div className="card-throwed Y">
          <img
            className="img-card-throwed"
            src={require(`../ass/cards-front/${playedCardsPile[0]}.png`)}
            alt=""
          />
        </div>

        <div className="main-player-card">
          <MainPlayer socket={socket} />
        </div>
        {/* <div className="main-player-info">
            <h3>Kienngu</h3>
          </div> */}
        {/* 
        <div className="button-aria">

        </div> */}
        <div className="enemy-card">
          <EnemyCard />
        </div>
        <div className="clock ">
          <div className="clock-item Y"><h3>{sec}</h3></div>
        </div>
        <div className="draw-card-aria">
          <DrawCard />
          {/* <Fab color="error" aria-label="add">
            UNO
          </Fab> */}
          <div className = "learn-more">
            uno
          </div>
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
