import React, { useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import InsertCommentIcon from "@mui/icons-material/InsertComment";
import Fab from "@mui/material/Fab";

function ChatBox() {
  const [showChat, setShowChat] = useState(true);
  const handleCloseChat = () => {
    setShowChat((pre) => !pre);
  };
  return (
    <>
      {showChat ? (
        <div className="chat-box-container">
          <div className="chat-box-top">
            <CloseIcon
              onClick={handleCloseChat}
              style={{ marginRight: "10px" }}
              className="hover-icon"
              color="primary"
            />
          </div>

          <div className="chat-box-main">
            <div className="chat-item">Kienngu: em oiw</div>
            <div className="chat-item">Kienngu: cuuws a e oiw</div>
            <div className="chat-item">Kienngu: client nhinf ngu qua </div>
            <div className="chat-item">LienDink?: em lo ddc</div>
          </div>

          <div className="chat-box-bot">
            <input className="input-chat" placeholder="Aa" />
            <SendIcon className="hover-icon" color="primary" />
          </div>
        </div>
      ) : (
        <div className="bot-left">
          <Fab onClick={handleCloseChat} color="primary" aria-label="add">
            <InsertCommentIcon />
          </Fab>
        </div>
      )}
    </>
  );
}
export default ChatBox;
