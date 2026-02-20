import { configureStore } from "@reduxjs/toolkit";
import msgReducer from "./slices/msgSlice";

export const store = configureStore({
  reducer: {
    msg: msgReducer
  }
})