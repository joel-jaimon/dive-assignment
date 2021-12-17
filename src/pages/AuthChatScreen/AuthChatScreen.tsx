import { MainChat } from "../../components/MainChat/MainChat";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import s from "./authSCreen.module.scss";

export const AuthChatScreen = () => {
  return (
    <div className={s.wrapper}>
      <Sidebar />
      <MainChat />
    </div>
  );
};
