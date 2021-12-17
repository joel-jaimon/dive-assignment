import { auth } from "../../configs/firebase.config";

export const LogoutPanel = () => {
  const signOut = async () => {
    try {
      await auth.signOut();
      window.location.reload();
    } catch (error) {}
  };

  return (
    <div>
      <button onClick={signOut}>Logout</button>
    </div>
  );
};
