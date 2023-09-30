import { useSession } from "next-auth/react";
import UserSignedIn from "./userSignedIn";
import UserSignedOut from "./userSignedOut";
import UserDev from "./userDev";

export default function User({ dev }) {
  const { data: session } = useSession();
  const renderUser = () => {
    if (dev) {
      return <UserDev />;
    }
    if (session) {
      return <UserSignedIn />;
    } else {
      return <UserSignedOut />;
    }
  };
  return <div>{renderUser()}</div>;
}
