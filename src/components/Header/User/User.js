import { useSession } from "next-auth/react";
import UserSignedIn from "./UserSignedIn";
import UserSignedOut from "./UserSignedOut";
import UserDev from "./UserDev";

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
