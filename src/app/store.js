import { configureStore } from "@reduxjs/toolkit";
import StatusSlice from "../features/status/StatusSlice";

import userReducer from '../features/user/userSlice';
import roomReducer from '../features/room/roomSlice';
import gameReducer from '../features/game/gameSlice';
export const store = configureStore({
  reducer: {
    statusIndex: StatusSlice,
    user: userReducer,
    room: roomReducer,
    game: gameReducer,
  },
});
