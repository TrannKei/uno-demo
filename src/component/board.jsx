import { leaveRoom } from "../features/room/roomSlice";
import { updateUsers } from "../features/room/roomSlice";
import { resetGame, updateGame } from "../features/game/gameSlice";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
// import PopUp from "./PopUp";
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
  // const [sec, setSec] = useState(10);
  // useEffect(() => {
  //   const time = setInterval(() => {
  //     setSec((pre) => pre - 1);
  //   }, 1000);
  //   if (sec === 0) {
  //     setSec(60);
  //   }
  //   return () => {
  //     clearInterval(time);
  //   };
  // });
  const dispatch = useDispatch();
  const handleOut = () => {
    navigate("/");
  };
  // console.log("Socket from InGame", socket.id);

  // Slice: roomSlice {roomCode, users, currentUser}

  const { users, currentUser } = useSelector((state) => state.room);
  const gameStat = useSelector((state) => state.game);
  const {
    gameOver,
    winner,
    turn,
    deckOfPlayers,
    currentColor,
    currentNumber,
    playedCardsPile,
    drawCardPile,
  } = gameStat;
  const { user } = useSelector((state) => state.user);
  // Listeners of socket instance
  useEffect(() => {
    socket.on("initGameState", (gameState) => {
      console.log("Start the Game", gameState);
      dispatch(gameState);
    });

    socket.on("updateGame", (gameState) => {
      dispatch(updateGame(gameState));
    });

    socket.on("message", (message) => {
      console.log("Nhan duoc message", message);
      setMessages((prev) => [...prev, formatMessage(message)]);
    });

    socket.on("roomData", (payload) => {
      console.log("Got room data", payload);
      dispatch(updateUsers(payload));
    });

    socket.on("leaveUser", () => {
      dispatch(resetGame());
    });
  }, []);

  const handleLeave = () => {
    dispatch(leaveRoom());
    const newUsers = users.filter(({ _id }) => user.id !== _id);
    console.log("New users:", newUsers);
    socket.emit("leaving", newUsers);
    navigate("/");
  };

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const formatMessage = ({ message, userName }) => {
    const date = new Date();

    return {
      message,
      userName,
      time: date.getHours() + ":" + date.getMinutes(),
    };
  };
  const sendMessage = (mess) => {
    if (message) {
      console.log("Send");
      socket.emit(
        "message",
        { message: mess, userName: currentUser.userName },
        () => {
          setMessage("");
        }
      );
    }
  };

  const [isUnoPressed, setUnoPressed] = useState(false);
  const [popUp, setPopUp] = useState(false);
  const [colorChosen, setColorChosen] = useState("");
  const [specialCard, setSpecialCard] = useState("");
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
    console.log(
      "Change uturn or not",
      changeTurnCarType.some((type) => type === cardType) +
        " cardType " +
        cardType
    );
    return changeTurnCarType.some((type) => type === cardType);
  };

  const closePopUp = (colorChoose) => {
    setColorChosen(colorChoose);
    setPopUp(false);
    onCardPlayedHandler(specialCard);
  };
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

    console.log("played Card", numberOfPlayedCard, colorOfPlayedCard);
    console.log("current Card", currentNumber, currentColor);
    // If match color or number
    if (
      colorOfPlayedCard === currentColor ||
      numberOfPlayedCard === currentNumber ||
      numberOfPlayedCard === 300 ||
      numberOfPlayedCard === 600
    ) {
      // Update turn
      const nextPlayer = isChangePlayer(cardType) ? opponentId : turn;

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
        console.log("Old opponent", newDeck);

        if (cardType === "draw2") {
          newDeck.push(...copiedDrawCardPile.splice(-2));
        }
        if (cardType === "draw4wild") {
          newDeck.push(...copiedDrawCardPile.splice(-4));
        }
        console.log("Add to opponent", newDeck);
        return newDeck;
      };

      if (cardType === "draw2" || cardType === "draw4wild") {
        const otherDeckName =
          cardFromDeck === "player1Deck" ? "player2Deck" : "player1Deck";
        newObjectToEmit[otherDeckName] = updateOpponent();
        newObjectToEmit.drawCardPile = [...copiedDrawCardPile];
      }

      console.log("New Object ", newObjectToEmit);
      setUnoPressed(false);
      socket.emit("updateGameState", newObjectToEmit);
    } else {
      // if not match color || number
      toast.error("Invalid move");
      console.error(played_card);
      return;
    }
  };

  // Handle Drawcard
  const onCardDrawnHandler = (drawn_card) => {
    if (turn !== currentUser.id) return;
    console.log("Drawing card");
    // if match then play ouright

    // player who draw card
    let newObjectToEmit = {};
    const cardDrawnBy = deckOfPlayers[turn]; // playerDeck1 ||| playerDeck2
    const otherDeck =
      gameStat[cardDrawnBy === "player1Deck" ? "player2Deck" : "player1Deck"];
    const currentDeck = gameStat[cardDrawnBy];
    const { _id: opponentId } = users.find((user) => user._id !== turn);

    // Card
    const cardType = typeOfCard(drawn_card);
    const copiedPlayedCardPile = [...playedCardsPile];
    const copiedDrawCardPile = drawCardPile.filter(
      (card) => card !== drawn_card
    );
    let colorOfDrawnCard;
    let numberOfDrawnCard;

    // If Wild ask for Color first else extract color from played_card
    if (cardType === "wild" || cardType === "draw4wild") {
      if (!colorChosen) {
        setPopUp(true);
        setSpecialCard(drawn_card);
        return;
      } else {
        colorOfDrawnCard = colorChosen;
        setColorChosen("");
        setSpecialCard("");
      }
    } else {
      colorOfDrawnCard = drawn_card[drawn_card.length - 1];
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
    numberOfDrawnCard = getNumber(drawn_card);

    console.log("drawn Card", numberOfDrawnCard, colorOfDrawnCard);
    console.log("current Card", currentNumber, currentColor);
    // Check to drawn card
    if (
      colorOfDrawnCard === currentColor ||
      numberOfDrawnCard === currentNumber ||
      numberOfDrawnCard === 300 ||
      numberOfDrawnCard === 600
    ) {
      // Update turn
      const nextPlayer = isChangePlayer(cardType) ? opponentId : turn;
      // skip : No turn, new CurrentNumber,
      // Which player Deck to update
      newObjectToEmit = {
        ...newObjectToEmit,
        turn: nextPlayer,
        playedCardsPile: [drawn_card, ...copiedPlayedCardPile],
        currentColor: colorOfDrawnCard,
        currentNumber: numberOfDrawnCard,
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
          cardDrawnBy === "player1Deck" ? "player2Deck" : "player1Deck";
        newObjectToEmit[otherDeckName] = updateOpponent();
      }
      console.log("New Object After Draw", newObjectToEmit);
      socket.emit("updateGameState", newObjectToEmit);
    } else {
      // If not match any add to current player deck, remove from drawpile and change turn
      socket.emit("updateGameState", {
        turn: opponentId,
        drawCardPile: copiedDrawCardPile,
        [cardDrawnBy]: [...currentDeck, drawn_card],
      });
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
          <div>{user.userName}</div>
          <Button
            variant="outlined"
            color="error"
            size="small"
            endIcon={<LogoutIcon />}
            onClick={handleLeave}
          >
            Thoát
          </Button>
        </div>
      </div>
      <div className="play-ground">
        <div className={`card-throwed ${currentColor}`}>
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
          <div className={`clock-item ${currentColor}`}>
            <h3>{10}</h3>
          </div>
        </div>
        <div className="draw-card-aria">
          <DrawCard socket={socket} onCardDrawnHandler={onCardDrawnHandler} />
          {/* <Fab color="error" aria-label="add">
            UNO
          </Fab> */}
        </div>
        <div>
          <ChooseColor popUp={popUp} onClosePopUp={closePopUp} card={specialCard}/>
        </div>
        {/* <Winner /> */}
        <ChatBox />
      </div>
    </>
  );
}
export default Board;
