import { useSession } from "next-auth/react";
import UserSignedIn from "./UserSignedIn";
import UserSignedOut from "./UserSignedOut";

export default function User() {
  const { data: session } = useSession();
  return <div>{session ? <UserSignedIn /> : <UserSignedOut />}</div>;
}
