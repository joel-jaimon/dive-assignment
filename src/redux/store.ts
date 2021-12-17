import { configureStore } from "@reduxjs/toolkit";
import { combinedReducers } from "./rootReducer";
import logger from "redux-logger";

const middleware = [logger] as const;

const store = configureStore({
  reducer: combinedReducers,
  middleware,
});

export default store;
