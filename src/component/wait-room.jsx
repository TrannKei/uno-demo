import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { leaveRoom } from "../features/room/roomSlice";
import { useSelector, useDispatch } from "react-redux";
import { updateUsers } from "../features/room/roomSlice";
import { toast } from "react-toastify";
import Tooltip from "@mui/material/Tooltip";

import {
  initializeGame,
  resetGame,
  updateGame,
  updateMessage,
} from "../features/game/gameSlice";

import PACK_OF_CARDS from "../utils/packOfCards";
import shuffleArray from "../utils/shuffleArray";
import io from "socket.io-client";

import { useState } from "react";
import { setCurrentUser } from "../features/room/roomSlice";
import Board from "./board";

const ENDPOINT = "http://localhost:5000";
let socket;

const Game = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Slice: roomSlice {roomCode, users, currentUser}
  const { user } = useSelector((state) => state.user);
  const { users, currentUser } = useSelector((state) => state.room);
  const {
    gameOver,
    turn,
    player1Deck,
    player2Deck,
    currentColor,
    currentNumber,
    playedCardsPile,
    drawCardPile,
  } = useSelector((state) => state.game);

  const [text, setText] = useState(roomCode);

  const copy = async () => {
    toast.success("Đã copy");
    await navigator.clipboard.writeText(text);
  };

  useEffect(() => {
    const connectionOptions = {
      forceNew: true,
      reconnectionAttempts: "Infinity",
      timeout: 10000,
    };
    socket = io.connect(ENDPOINT, connectionOptions);

    socket.emit("join", roomCode);
    return () => {
      socket.disconnect();
      socket.off();
    };
  }, []);

  // Listeners of socket instance
  useEffect(() => {
    socket.on("initGameState", (gameState) => {
      console.log("Start the Game", gameState);
      dispatch(initializeGame(gameState));
    });

    socket.on("updateGame", (gameState) => {
      dispatch(updateGame(gameState));
    });

    socket.on("message", (message) => {
      dispatch(updateMessage(message));
    });

    socket.on("roomData", (payload) => {
      console.log("Got room data", payload);
      dispatch(updateUsers(payload));
    });

    socket.on("message", (message) => {
      // Set Message
      // SCroll top the chat
    });
  }, []);

  const handleLeave = () => {
    dispatch(leaveRoom());
    const newUsers = users.filter(({ _id }) => user.id !== _id);
    console.log("New users:", newUsers);
    socket.emit("leaving", newUsers);
    navigate("/");
  };

  // Initialize the game
  const handleStart = () => {
    // ktra xem co 2 nguoi tro len chua
    if (users.length < 2) {
      toast.warning("Please find more players!");
    } else {
      //shuffle PACK_OF_CARDS array
      const shuffledCards = shuffleArray(PACK_OF_CARDS);

      //extract first 7 elements to player1Deck
      const player1Deck = shuffledCards.splice(0, 7);

      //extract first 7 elements to player2Deck
      const player2Deck = shuffledCards.splice(0, 7);

      //extract random card from shuffledCards and check if its not an action card
      let startingCardIndex;
      while (true) {
        startingCardIndex = Math.floor(Math.random() * 94);
        if (
          shuffledCards[startingCardIndex] === "skipR" ||
          shuffledCards[startingCardIndex] === "_R" ||
          shuffledCards[startingCardIndex] === "D2R" ||
          shuffledCards[startingCardIndex] === "skipG" ||
          shuffledCards[startingCardIndex] === "_G" ||
          shuffledCards[startingCardIndex] === "D2G" ||
          shuffledCards[startingCardIndex] === "skipB" ||
          shuffledCards[startingCardIndex] === "_B" ||
          shuffledCards[startingCardIndex] === "D2B" ||
          shuffledCards[startingCardIndex] === "skipY" ||
          shuffledCards[startingCardIndex] === "_Y" ||
          shuffledCards[startingCardIndex] === "D2Y" ||
          shuffledCards[startingCardIndex] === "W" ||
          shuffledCards[startingCardIndex] === "D4W"
        ) {
          continue;
        } else break;
      }

      //extract the card from that startingCardIndex into the playedCardsPile
      const playedCardsPile = shuffledCards.splice(startingCardIndex, 1);

      //store all remaining cards into drawCardPile
      const drawCardPile = shuffledCards;

      // Assign users
      let deckOfPlayers = {};
      users.forEach(
        (user, index) => (deckOfPlayers[user._id] = `player${index + 1}Deck`)
      );

      //send initial state to server
      socket.emit("initGameState", {
        gameOver: false,
        turn: users[0]._id,
        deckOfPlayers: deckOfPlayers,
        player1Deck: [...player1Deck],
        player2Deck: [...player2Deck],
        currentColor: playedCardsPile[0].charAt(1),
        currentNumber: playedCardsPile[0].charAt(0),
        playedCardsPile: [...playedCardsPile],
        drawCardPile: [...drawCardPile],
      });
    }
  };

  return (
    <>
     

      {gameOver || users.length === 1 ? (
         <div className="bg-wait-room">
         <div className="header-wait">
           <div className="back-to-create">
             <h3 onClick={handleLeave}>TRỞ LẠI</h3>
           </div>
           <Tooltip title="Bấm để chép mã phòng" placement="bottom">
           <div className="roomId" onClick={copy}>
             <h3>Mã phòng: {roomCode}</h3>
           </div>
           </Tooltip>
           <div></div>
         </div>
         <div className="wait-member-aria">
           {users.map((user) => (
             <div className="member" key={user._id}>
               <div className="member-avatar">
                 <img  src={require('../ass/avatar.png')} />
               </div>
               <div className="member-name">{user.userName}</div>
             </div>
           ))}
         </div>
         <div className="bottom-wait">
           <div className="ready-btn" onClick={handleStart}>
             SẴN SÀNG
           </div>
         </div>
       </div>
      ) : (
        <Board socket={socket} />
      )}
    </>
  );
};

export default Game;
