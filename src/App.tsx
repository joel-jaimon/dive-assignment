import { useState, useEffect } from "react";
import { auth } from "./configs/firebase.config";
import { AuthChatScreen } from "./pages/AuthChatScreen/AuthChatScreen";
import { Login } from "./pages/Login/Login";

const App = () => {
  const [authorized, setAuthorized] = useState(false);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user?.uid) {
        setAuthorized(true);
      }
    });
  }, []);
  return (
    <div className="App">{!authorized ? <Login /> : <AuthChatScreen />}</div>
  );
};

export default App;
