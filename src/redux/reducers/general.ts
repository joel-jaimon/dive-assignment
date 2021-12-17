import { createSlice } from "@reduxjs/toolkit";

// initial state
const initialState: any = {
  activeChat: null,
  myRooms: null,
  onlineUsers: {},
};

export const generalSlice = createSlice({
  name: "generalSlice",
  initialState,
  reducers: {
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
    },

    setMyRooms: (state, action) => {
      state.myRooms = action.payload;
    },

    updateRoomMessages: (state, action) => {
      state.myRooms[action.payload.roomId].messages = action.payload.messages;
    },

    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },
});

export const { setActiveChat, setMyRooms, updateRoomMessages, setOnlineUsers } =
  generalSlice.actions;
