import { ref, set } from "firebase/database";
import { useState, useEffect } from "react";
import { auth, rtdb } from "./configs/firebase.config";
import { AuthChatScreen } from "./pages/AuthChatScreen/AuthChatScreen";
import { Login } from "./pages/Login/Login";

const App = () => {
  const [authorized, setAuthorized] = useState(false);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user?.uid) {
        const onlineRef = ref(rtdb, "onlineUsers/" + user.uid);
        set(onlineRef, {
          active: true,
          lastSeen: +new Date(),
          onRoom: null,
        });
        setAuthorized(true);
      }
    });

    window.onunload = function () {
      const onlineRef = ref(rtdb, "onlineUsers/" + auth.currentUser?.uid);
      set(onlineRef, {
        active: false,
        lastSeen: +new Date(),
        onRoom: null,
      });
    };
  }, []);

  return (
    <div className="App">{!authorized ? <Login /> : <AuthChatScreen />}</div>
  );
};

export default App;
