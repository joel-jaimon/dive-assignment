import s from "./sidebar.module.scss";
import { useEffect, useState } from "react";
import {
  collection,
  query,
  onSnapshot,
  where,
  addDoc,
} from "firebase/firestore";
import { auth, firestore, rtdb } from "../../configs/firebase.config";
import { useDispatch, useSelector } from "react-redux";
import {
  setActiveChat,
  setMyRooms,
  setOnlineUsers,
  updateRoomMessages,
} from "../../redux/reducers/general";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import { LogoutPanel } from "../LogoutPanel/LogoutPanel";
import { ref, get, onValue } from "firebase/database";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export const Sidebar = () => {
  const [users, setUsers] = useState<any>(null);
  const [presentTab, setPresentTab] = useState(0);
  const [fetchRoom, setFetchRoom] = useState(false);
  const dispatch = useDispatch();

  const myRooms = useSelector((state: any) => state.generalState.myRooms);
  const onlineUsers = useSelector(
    (state: any) => state.generalState.onlineUsers
  );

  const setRooms = (data: any) => {
    dispatch(setMyRooms(data));
  };

  const updateRoomWithMessages = (roomId: string, messages: any) => {
    dispatch(
      updateRoomMessages({
        roomId,
        messages,
      })
    );
  };

  useEffect(() => {
    console.log("USERS SNAPSHOT");
    const usersRef = collection(firestore, "users");
    onSnapshot(usersRef, async (data) => {
      const remoteUsers = data.docs
        .map((e) => e.data())
        .filter((data: any) => auth.currentUser?.uid != data.uid)
        .reduce((prev: any, current: any) => {
          return {
            ...prev,
            [current.uid]: current,
          };
        }, {});
      setUsers(remoteUsers);
    });
  }, []);

  useEffect(() => {
    if (users && !myRooms) {
      const roomsRef = collection(firestore, "rooms");
      const myRoomsRemote = query(
        roomsRef,
        where("participants", "array-contains", auth.currentUser?.uid)
      );
      onSnapshot(myRoomsRemote, async (data) => {
        console.log("ROOM SNAPSHOT");
        const remoteUsers = data.docs
          .map((e) => {
            const id = e.id;
            const data = e.data();
            return {
              id,
              ...data,
              toUser:
                users[
                  data.participants.find((e: any) => e != auth.currentUser?.uid)
                ],
            };
          })
          .reduce((prev: any, current: any) => {
            return {
              ...prev,
              [current.id]: current,
            };
          }, {});
        setRooms(remoteUsers);
        setFetchRoom(true);
      });
    }
  }, [users]);

  useEffect(() => {
    if (fetchRoom) {
      Object.entries(myRooms).map((room: any) => {
        const messageRef = collection(firestore, `rooms/${room[0]}/messages`);

        onSnapshot(messageRef, async (messages) => {
          console.log("MESSAGE SNAPSHOT");
          const totalMessages = messages.docs
            .map((e) => {
              const id = e.id;
              const data = e.data();
              return {
                id,
                ...data,
              };
            })
            .reduce((prev, current) => {
              console.log(current);
              return {
                ...prev,
                [current.id]: current,
              };
            }, {});
          updateRoomWithMessages(room[0], totalMessages);
        });
      });

      const onlineUsers = ref(rtdb, "onlineUsers/");
      (async () => {
        const oUsers = await get(onlineUsers);

        const jData = oUsers!.toJSON();
        if (jData) dispatch(setOnlineUsers(jData));
      })();
      onValue(onlineUsers, (data) => {
        const jData = data!.toJSON();
        if (jData) dispatch(setOnlineUsers(jData));
      });
    }
  }, [fetchRoom]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setPresentTab(newValue);
  };

  const handleNewChat = async (toUid: string) => {
    const bool = Object.entries(myRooms).find((e: any) =>
      e[1].participants.includes(toUid)
    );
    if (bool) {
      dispatch(setActiveChat(bool[0]));
    } else {
      const roomsRef = collection(firestore, "rooms");
      const { id } = await addDoc(roomsRef, {
        participants: [toUid, auth.currentUser?.uid],
      });

      dispatch(setActiveChat(id));
    }
  };

  return users && myRooms ? (
    <div className={s.sidebar}>
      <LogoutPanel />
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={presentTab}
          onChange={handleChange}
          className={s.tabs}
          aria-label="basic tabs example"
          centered
        >
          <Tab label="Chats" {...a11yProps(0)} />
          <Tab label="Users" {...a11yProps(1)} />
        </Tabs>

        <TabPanel value={presentTab} index={0}>
          {Object.entries(myRooms).map((e: any) => {
            return (
              <button
                onClick={() => dispatch(setActiveChat(e[0]))}
                className={s.users}
                key={e[0]}
              >
                <img src={e[1].toUser.photoUrl} />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <p>{e[1].toUser.displayName}</p>
                  {onlineUsers[e[1].toUser.uid] &&
                    onlineUsers[e[1].toUser.uid].active && (
                      <small
                        style={{
                          height: 10,
                          width: 10,
                          borderRadius: 10,
                          marginRight: 10,
                          backgroundColor: "green",
                        }}
                      >
                        .
                      </small>
                    )}
                </div>
              </button>
            );
          })}
        </TabPanel>
        <TabPanel value={presentTab} index={1}>
          {Object.entries(users).map((e: any) => {
            return (
              <button
                onClick={() => handleNewChat(e[0])}
                className={s.users}
                key={e[0]}
              >
                <img src={e[1].photoUrl} />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <p>{e[1].displayName}</p>
                  {onlineUsers[e[0]] && onlineUsers[e[0]].active && (
                    <small
                      style={{
                        height: 10,
                        width: 10,
                        borderRadius: 10,
                        marginRight: 10,
                        backgroundColor: "green",
                      }}
                    >
                      .
                    </small>
                  )}
                </div>
              </button>
            );
          })}
        </TabPanel>
      </Box>
    </div>
  ) : (
    <div />
  );
};
