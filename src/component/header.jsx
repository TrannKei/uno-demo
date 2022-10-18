import React from "react";
import Button from "@mui/material/Button";
import { login } from "../features/status/StatusSlice";
import { useDispatch } from "react-redux";
function Header() {
  const dispatch = useDispatch();
  const handleLogin = () => {
    dispatch(login());
  };
  return (
    <>
      <div className="header-play">
        <div></div>

        <div></div>
        <div className="controller">
          <div>Kienngu</div>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={handleLogin}
          >
            đăng xuất
          </Button>
        </div>
      </div>
    </>
  );
}
export default Header;
