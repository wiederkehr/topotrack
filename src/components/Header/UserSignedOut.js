import { signIn } from "next-auth/react";
import styles from "./UserSignedOut.module.css";

export default function UserSignedOut() {
  return (
    <button className={styles.action} onClick={() => signIn("strava")}>
      Sign in with Strava
    </button>
  );
}
