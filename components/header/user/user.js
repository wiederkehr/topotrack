import { auth } from "@/auth";
import UserSignedIn from "./userSignedIn";
import UserSignedOut from "./userSignedOut";
import UserDev from "./userDev";

export default async function User({ dev }) {
  const session = await auth();
  const user = session?.user;

  const renderUser = () => {
    if (dev) {
      return <UserDev />;
    }
    if (user) {
      return <UserSignedIn user={user} />;
    } else {
      return <UserSignedOut />;
    }
  };
  return <div>{renderUser()}</div>;
}
