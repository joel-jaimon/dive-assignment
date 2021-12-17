import { createSlice } from "@reduxjs/toolkit";
import { ref, set } from "firebase/database";
import { auth, rtdb } from "../../configs/firebase.config";

// initial state
const initialState: any = {
  activeChat: null,
  myRooms: null,
  onlineUsers: {},
  roomStatus: {},
};

export const generalSlice = createSlice({
  name: "generalSlice",
  initialState,
  reducers: {
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
    },

    setRoomStatus: (state, action) => {
      state.roomStatus = action.payload;
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

export const {
  setActiveChat,
  setMyRooms,
  updateRoomMessages,
  setOnlineUsers,
  setRoomStatus,
} = generalSlice.actions;
