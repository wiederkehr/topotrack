import { useSession, signIn } from "next-auth/react";
import User from "@/components/User";
import styles from "./Connection.module.css";

export default function Connection() {
  const { data: session } = useSession();
  const action = (
    <button className={styles.action} onClick={() => signIn("strava")}>
      Sign in with Strava
    </button>
  );
  return <div className={styles.connection}>{session ? <User /> : action}</div>;
}
