import { configureStore } from '@reduxjs/toolkit';
import StatusSlice from '../features/status/StatusSlice';

export const store = configureStore({
  reducer: {
    statusIndex: StatusSlice
  },
});
