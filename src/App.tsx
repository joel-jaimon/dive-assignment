import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "./configs/firebase.config";
import { AuthChatScreen } from "./pages/AuthChatScreen/AuthChatScreen";
import { Login } from "./pages/Login/Login";
import { setAuthUser } from "./redux/reducers/general";

const App = () => {
  const dispatch = useDispatch();
  const authUser = useSelector((state: any) => state.generalState.authUser);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user?.uid) {
        dispatch(
          setAuthUser({
            photoURL: user?.photoURL,
            email: user?.email,
            uid: user?.uid,
            displayName: user?.displayName,
          })
        );
      } else {
        dispatch(setAuthUser(null));
      }
    });
  }, []);
  return (
    <div className="App">{!authUser ? <Login /> : <AuthChatScreen />}</div>
  );
};

export default App;
