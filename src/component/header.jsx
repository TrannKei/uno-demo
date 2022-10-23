import React from "react";
import Button from "@mui/material/Button";
import { login } from "../features/status/StatusSlice";
import { useDispatch} from "react-redux";
import { useNavigate } from "react-router-dom";
import {useSelector} from "react-redux"
import { logout, deleteUser } from "../features/user/userSlice";
import { reset, createRoom } from "../features/room/roomSlice";
import { resetGame } from "../features/game/gameSlice";
function Header() {
  const navigate = useNavigate()
  const {user} = useSelector(store => store.user)
  const dispatch = useDispatch();
  const handleLogin = () => {
    dispatch(login());
    if (user.isGuest) {
      dispatch(deleteUser());
    }
    dispatch(resetGame());
    dispatch(logout());
    navigate("/");
  };
  
  return (
    <>
      <div className="header-play">
        <div></div>

        <div></div>
        <div className="controller">
          {/* <div>{user.userName}</div> */}
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
