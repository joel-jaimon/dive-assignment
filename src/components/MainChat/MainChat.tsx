import { Avatar } from "@mui/material";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { auth, firestore } from "../../configs/firebase.config";
import s from "./mainChat.module.scss";
import { collection, addDoc } from "firebase/firestore";

export const MainChat = () => {
  const chatContainerRef: any = useRef();
  const activeChat = useSelector((state: any) =>
    state.generalState.myRooms
      ? state.generalState.myRooms[state.generalState.activeChat]
      : null
  );
  const onlineUsers = useSelector(
    (state: any) => state.generalState.onlineUsers
  );
  const [sendingMessage, setSendingMessage] = useState("");

  const sendMessage = async (e: any) => {
    if (e.keyCode === 13) {
      const messageRef = collection(
        firestore,
        `rooms/${activeChat.id}/messages`
      );
      await addDoc(messageRef, {
        sentBy: auth.currentUser?.uid,
        textMessage: sendingMessage,
        timestamp: +new Date(),
      });

      chatContainerRef.current?.scrollTo(0, 100000);
      setSendingMessage("");
    }
  };

  return activeChat?.id ? (
    <div className={s.mainChat}>
      <header className={s.chatHeader}>
        <Avatar src={activeChat.toUser.photoUrl} />
        <p>{activeChat.toUser.displayName}</p>
      </header>
      <div ref={chatContainerRef} className={s.mainChatContainer}>
        {activeChat.messages &&
          Object.entries(activeChat.messages)
            .sort(function (x: any, y: any) {
              return x[1].timestamp - y[1].timestamp;
            })
            .map((message: any) => {
              const myMessageBool = message[1].sentBy === auth.currentUser?.uid;
              return (
                <div
                  className={myMessageBool ? s.rightMessage : s.leftMessage}
                  key={message[0]}
                >
                  <div className={s.mainContent}>
                    <p>{message[1].textMessage}</p>
                    {myMessageBool && (
                      <span className={s.activeStatus}>
                        {onlineUsers[activeChat.toUser.uid] &&
                        onlineUsers[activeChat.toUser.uid].lastSeen >
                          message[1].timestamp ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                          >
                            <path d="M8.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L2.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093L8.95 4.992a.252.252 0 0 1 .02-.022zm-.92 5.14.92.92a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 1 0-1.091-1.028L9.477 9.417l-.485-.486-.943 1.179z" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                          >
                            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
                          </svg>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
      </div>
      <footer className={s.footer}>
        <input
          value={sendingMessage}
          onKeyDown={sendMessage}
          onChange={(e: any) => setSendingMessage(e.target.value)}
        />
      </footer>
    </div>
  ) : (
    <div>Choose a chat</div>
  );
};
