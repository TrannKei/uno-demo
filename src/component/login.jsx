import React, { useCallback, useState } from "react";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { logined } from "../features/status/StatusSlice";
import { useDispatch } from "react-redux";
function Login() {
  const [inputData, setInputData] = useState({
    username: "",
    password: "",
  });
  const dispatch = useDispatch();
  const handleLogined = () => {
    dispatch(logined());
  };
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
          <h1 className="title">ĐĂNG NHẬP</h1>
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
          <TextField
            className="z-Index20 mb20"
            id="standard-basic"
            label="Mật Khẩu"
            variant="standard"
            type="password"
            name="password"
            onChange={handleInput}
          />
        </div>
        <div>
          <FormControlLabel
            className="z-Index20 mb20"
            control={<Checkbox className="z-Index20" />}
            label="Lưu tài khoản"
          />
        </div>
        <Button
          onClick={handleLogined}
          className="z-Index20"
          variant="contained"
        >
          Đăng nhập
        </Button>
      </div>
    </>
  );
}

export default Login;
