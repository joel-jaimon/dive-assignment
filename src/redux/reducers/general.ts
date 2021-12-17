import { createSlice } from "@reduxjs/toolkit";

// initial state
const initialState: any = {
  activeChat: null,
};

export const generalSlice = createSlice({
  name: "generalSlice",
  initialState,
  reducers: {
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
    },
  },
});

export const { setActiveChat } = generalSlice.actions;
