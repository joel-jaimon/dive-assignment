import { createSlice } from "@reduxjs/toolkit";

// initial state
const initialState: any = {
  authUser: null,
};

export const generalSlice = createSlice({
  name: "generalSlice",
  initialState,
  reducers: {
    setAuthUser: (state, action) => {
      state.authUser = action.payload;
    },
  },
});

export const { setAuthUser } = generalSlice.actions;
