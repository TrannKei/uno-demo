import React from "react";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { logined } from "../features/status/StatusSlice";
import { ThemeProvider, createTheme } from '@mui/material/styles'

import { useState, useEffect } from "react";
import { register } from "../features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { reset } from "../features/user/userSlice";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function Login() {

  const dispatch = useDispatch();
  const handleLogined = () => {
    dispatch(logined());
    dispatch(register(formData));
  };


  const navigate = useNavigate();
  const { user, isLoading, isSuccess, isError, message } = useSelector(
    (store) => store.user
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userName: "",
  });

  const { email, password, userName } = formData;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };



  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || user) {
      navigate("/");
    }

    dispatch(reset());
  }, [isLoading, isError, isSuccess, message, navigate, dispatch]);
  return (
    <>
      <div className="with-50 center ">
        <div>
          <h1 className="title">ĐĂNG KÍ</h1>
        </div>
        <div className="flex-col mb20 gap20px">
          <ThemeProvider theme={darkTheme}>
          <TextField
            className="z-Index20"
            id="standard-basic"
            label="Tên Đăng Nhập"
            variant="standard"
            name="username"
            type="text"
            // value={userName}
            onChange={handleChange}
           
          />
          <TextField
            className="z-Index20 mb20"
            id="standard-basic"
            label="Email"
            variant="standard"
            type="text"
            name="email"
            // value={email}
            onChange={handleChange}
          />
          <TextField
            className="z-Index20 mb20"
            id="standard-basic"
            label="Mật Khẩu"
            variant="standard"
            type="password"
            name="repeat"
            // value={password}
            onChange={handleChange}
          />
          </ThemeProvider>
        </div>
        <Button
          onClick={handleLogined}
          className="z-Index20"
          variant="contained"
        >
          Đăng kí
        </Button>
      </div>
    </>
  );
}

export default Login;
