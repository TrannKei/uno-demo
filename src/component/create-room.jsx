import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

function CreateRoom() {
  return (
    <>
      <div className="with-50 center ">
      <div>
        <h1 className="title">CHỌN PHÒNG</h1>
      </div>
      <div className="flex-col mb20 gap20px">
        <TextField className="z-Index20" id="standard-basic" label="Nhập mã phòng" variant="standard" />
        <Button
          variant="contained"
          color="success"
          style={{ borderRadius: "20px" }}
          className="z-Index20"
        >
          Vào phòng
        </Button>
      </div>
      <div className="flex-col mb20">
        <Button
          variant="contained"
          color="success"
          style={{ borderRadius: "20px" }}
          className="z-Index20"
        >
          Tạo phòng
        </Button>
      </div>
      </div>
    </>
  );
}

export default CreateRoom;