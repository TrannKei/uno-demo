import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

function Guest() {
  
  const [inputData, setInputData] = useState({
    username: "",
  });
  const handleInput = (e) => {
    setInputData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  return (
    <>
      <div className="with-50 center ">
        <div>
          <h1 className="title">Nhập Tên </h1>
        </div>
        <div className="flex-col mb20 gap20px">
          <TextField
            className="z-Index20"
            id="standard-basic"
            label="Tên Đăng Nhập"
            variant="standard"
            name="username"
            onChange={handleInput}
          />
          <Button
           
            className="z-Index20"
            variant="contained"
          >
            Khách
          </Button>
        </div>
      </div>
      
    </>
  );
}
export default Guest;
