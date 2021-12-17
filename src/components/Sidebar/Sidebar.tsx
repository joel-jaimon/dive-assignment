import s from "./sidebar.module.scss";
import { useEffect, useState } from "react";
import { collection, query, onSnapshot, where } from "firebase/firestore";
import { auth, firestore } from "../../configs/firebase.config";
import { useDispatch } from "react-redux";
import { setActiveChat } from "../../redux/reducers/general";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import { LogoutPanel } from "../LogoutPanel/LogoutPanel";

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
  const [myRooms, setRooms] = useState<any>(null);
  const [presentTab, setPresentTab] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
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
      });
    }
  }, [users]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setPresentTab(newValue);
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
                <p>{e[1].toUser.displayName}</p>
              </button>
            );
          })}
        </TabPanel>
        <TabPanel value={presentTab} index={1}>
          {Object.entries(users).map((e: any) => {
            return (
              <button className={s.users} key={e[0]}>
                <img src={e[1].photoUrl} />
                <p>{e[1].displayName}</p>
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
