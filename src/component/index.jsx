import React, { useState } from "react";
import Login from "./login";
import SignIn from "./signin";
import Guest from "./guest";
import { useDispatch, useSelector } from "react-redux";
import CreateRoom from "./create-room";
import Button from "@mui/material/Button";
import { login, signin, guest, logined } from "../features/status/StatusSlice";
import Header from "./header";
function Index() {
  
  const { statusIndex } = useSelector((state) => state.statusIndex);
  const dispatch = useDispatch();
  const handleSignIn = () => {
    dispatch(signin());
  };

  const handleGuest = () => {
    dispatch(guest());
  };
  const handleLogin = () => {
    dispatch(login());
  };
  console.log(statusIndex);
  return (
    <>
      <div className="bg">
       {statusIndex === "logined" &&  <Header/>} 
        <div className="login-box ">
          {statusIndex !== "logined" && (
            <div className="nav-bar ">
              <Button
              onClick={handleLogin}
                variant={statusIndex === "login" ? "contained" : "outlined"}
                className="z-Index20 with-33"
              >
                đăng nhập
              </Button>
              <Button
              onClick={handleSignIn}
                variant={statusIndex === "signin" ? "contained" : "outlined"}
                className="z-Index20 with-33"
              >
                đăng kí
              </Button>
              <Button
              onClick={handleGuest}
                variant={statusIndex === "guest" ? "contained" : "outlined"}
                className="z-Index20 with-33"
              >
                khách
              </Button>
            </div>
          )}
          {statusIndex === "login" && <Login />}
          {statusIndex === "signin" && <SignIn />}
          {statusIndex === "guest" && <Guest />}
          {statusIndex === "logined" && <CreateRoom />}
        </div>
      </div>
    </>
  );
}

export default Index;
